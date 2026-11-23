-- Test fixtures and DDL exist only inside an intentionally rolled-back subtransaction.
DO $verify$
DECLARE r jsonb; i integer;
BEGIN
  BEGIN
    CREATE TEMP TABLE reviews (LIKE public.reviews INCLUDING CONSTRAINTS INCLUDING DEFAULTS);
    ALTER TABLE pg_temp.reviews DROP COLUMN id;
    CREATE TEMP TABLE feature_requests (LIKE public.feature_requests INCLUDING CONSTRAINTS INCLUDING DEFAULTS);
    ALTER TABLE pg_temp.feature_requests DROP COLUMN id;
    CREATE TEMP TABLE form_rate_limits (
  bucket text PRIMARY KEY CHECK (bucket ~ '^[0-9a-f]{64}$'),
  next_allowed_at timestamptz NOT NULL,
  accepted_at timestamptz[] NOT NULL CHECK (cardinality(accepted_at) BETWEEN 0 AND 5),
  expires_at timestamptz NOT NULL
);
    EXECUTE $ddl$CREATE FUNCTION pg_temp.submit_landing_form(
  p_kind text, p_key text, p_name text, p_content text, p_rating integer DEFAULT NULL
) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $function$
DECLARE
  v_now timestamptz := clock_timestamp();
  v_recent timestamptz[];
  v_next timestamptz;
  v_retry integer;
BEGIN
  IF p_kind IS NULL OR p_kind NOT IN ('review','feature') OR
     p_key IS NULL OR p_key !~ '^[0-9a-f]{64}$' OR
     (p_kind = 'review' AND (p_rating IS NULL OR p_rating NOT BETWEEN 1 AND 5)) OR
     (p_kind = 'feature' AND p_rating IS NOT NULL) THEN
    RAISE EXCEPTION 'Invalid form payload' USING ERRCODE = '22023';
  END IF;

  -- Bounded indexed cleanup; do not contend on rows another cleanup already locked.
  DELETE FROM pg_temp.form_rate_limits WHERE bucket IN (
    SELECT bucket FROM pg_temp.form_rate_limits WHERE expires_at < v_now
    ORDER BY expires_at LIMIT 100 FOR UPDATE SKIP LOCKED
  );
  INSERT INTO pg_temp.form_rate_limits(bucket,next_allowed_at,accepted_at,expires_at)
  VALUES(p_key,v_now,ARRAY[]::timestamptz[],v_now + interval '1 day')
  ON CONFLICT (bucket) DO NOTHING;

  -- Lock one shared bucket, including concurrent first submissions from separate servers.
  SELECT next_allowed_at,accepted_at INTO v_next,v_recent
    FROM pg_temp.form_rate_limits WHERE bucket=p_key FOR UPDATE;
  v_now := clock_timestamp();
  SELECT coalesce(array_agg(stamp ORDER BY stamp),ARRAY[]::timestamptz[]) INTO v_recent
    FROM unnest(v_recent) AS stamp WHERE stamp > v_now - interval '10 minutes';
  IF v_next > v_now OR cardinality(v_recent) >= 5 THEN
    v_retry := greatest(1,ceil(extract(epoch FROM (greatest(v_next,
      CASE WHEN cardinality(v_recent) >= 5 THEN v_recent[1] + interval '10 minutes' ELSE v_now END
    ) - v_now)))::integer);
    RETURN jsonb_build_object('accepted',false,'retry_after_seconds',v_retry);
  END IF;
  UPDATE pg_temp.form_rate_limits SET
    next_allowed_at=v_now + interval '30 seconds', accepted_at=array_append(v_recent,v_now),
    expires_at=v_now + interval '1 day' WHERE bucket=p_key;

  IF p_kind = 'review' THEN
    INSERT INTO pg_temp.reviews(name,rating,content) VALUES (p_name,p_rating,p_content);
  ELSE
    INSERT INTO pg_temp.feature_requests(name,feature_text) VALUES (p_name,p_content);
  END IF;
  RETURN jsonb_build_object('accepted',true,'retry_after_seconds',0);
END $function$;$ddl$;

    r := pg_temp.submit_landing_form('review',repeat('a',64),'Local fixture','תודה 👍',4);
    IF NOT (r->>'accepted')::boolean OR (SELECT count(*) FROM pg_temp.reviews) <> 1 THEN RAISE EXCEPTION 'first submission failed'; END IF;
    r := pg_temp.submit_landing_form('review',repeat('a',64),'Local fixture','תודה 👍',4);
    IF (r->>'accepted')::boolean OR (r->>'retry_after_seconds')::integer NOT BETWEEN 1 AND 30 THEN RAISE EXCEPTION 'cooldown failed'; END IF;

    FOR i IN 2..5 LOOP
      UPDATE pg_temp.form_rate_limits SET next_allowed_at=clock_timestamp()-interval '1 second' WHERE bucket=repeat('a',64);
      r := pg_temp.submit_landing_form('review',repeat('a',64),'Local fixture','Useful app',4);
      IF NOT (r->>'accepted')::boolean THEN RAISE EXCEPTION 'normal quota failed'; END IF;
    END LOOP;
    UPDATE pg_temp.form_rate_limits SET next_allowed_at=clock_timestamp()-interval '1 second' WHERE bucket=repeat('a',64);
    r := pg_temp.submit_landing_form('review',repeat('a',64),'Local fixture','Useful app',4);
    IF (r->>'accepted')::boolean OR (r->>'retry_after_seconds')::integer NOT BETWEEN 590 AND 600 OR (SELECT count(*) FROM pg_temp.reviews) <> 5 THEN RAISE EXCEPTION 'window limit failed'; END IF;

    UPDATE pg_temp.form_rate_limits SET next_allowed_at=clock_timestamp()-interval '1 second',accepted_at=ARRAY[clock_timestamp()-interval '11 minutes'] WHERE bucket=repeat('a',64);
    r := pg_temp.submit_landing_form('review',repeat('a',64),'Local fixture','Useful app',4);
    IF NOT (r->>'accepted')::boolean OR (SELECT cardinality(accepted_at) FROM pg_temp.form_rate_limits WHERE bucket=repeat('a',64)) <> 1 THEN RAISE EXCEPTION 'window reset failed'; END IF;
    -- Oldest submission expired, four recent submissions remain. Only one slot is free.
    UPDATE pg_temp.form_rate_limits SET next_allowed_at=clock_timestamp()-interval '1 second',
      accepted_at=ARRAY[clock_timestamp()-interval '11 minutes',clock_timestamp()-interval '2 minutes',clock_timestamp()-interval '90 seconds',clock_timestamp()-interval '60 seconds',clock_timestamp()-interval '31 seconds'] WHERE bucket=repeat('a',64);
    r := pg_temp.submit_landing_form('review',repeat('a',64),'Local fixture','Rolling window',4);
    IF NOT (r->>'accepted')::boolean THEN RAISE EXCEPTION 'expired slot not reclaimed'; END IF;
    UPDATE pg_temp.form_rate_limits SET next_allowed_at=clock_timestamp()-interval '1 second' WHERE bucket=repeat('a',64);
    r := pg_temp.submit_landing_form('review',repeat('a',64),'Local fixture','Rolling window',4);
    IF (r->>'accepted')::boolean THEN RAISE EXCEPTION 'rolling boundary bypass'; END IF;
    r := pg_temp.submit_landing_form('feature',repeat('b',64),'Local fixture','רעיון חדש',NULL);
    IF NOT (r->>'accepted')::boolean OR (SELECT count(*) FROM pg_temp.feature_requests) <> 1 THEN RAISE EXCEPTION 'feature submission failed'; END IF;

    BEGIN
      PERFORM pg_temp.submit_landing_form('review',repeat('c',64),'   ','Content',4);
      RAISE EXCEPTION 'invalid content accepted';
    EXCEPTION WHEN check_violation THEN NULL;
    END;
    IF EXISTS(SELECT 1 FROM pg_temp.form_rate_limits WHERE bucket=repeat('c',64)) THEN RAISE EXCEPTION 'failed insert consumed quota'; END IF;
    BEGIN
      PERFORM pg_temp.submit_landing_form('review',repeat('d',64),'Local fixture','Content',8);
      RAISE EXCEPTION 'invalid rating accepted';
    EXCEPTION WHEN invalid_parameter_value THEN NULL;
    END;
    IF EXISTS(SELECT 1 FROM pg_temp.form_rate_limits WHERE bucket=repeat('d',64)) THEN RAISE EXCEPTION 'invalid rating consumed quota'; END IF;

    INSERT INTO pg_temp.form_rate_limits VALUES(repeat('f',64),clock_timestamp(),ARRAY[clock_timestamp()],clock_timestamp()-interval '1 day');
    PERFORM pg_temp.submit_landing_form('feature',repeat('b',64),'Local fixture','Content',NULL);
    IF EXISTS(SELECT 1 FROM pg_temp.form_rate_limits WHERE bucket=repeat('f',64)) THEN RAISE EXCEPTION 'cleanup failed'; END IF;
    RAISE EXCEPTION USING ERRCODE='P0001', MESSAGE='rate_checks_passed_rollback';
  EXCEPTION WHEN SQLSTATE 'P0001' THEN
    IF SQLERRM <> 'rate_checks_passed_rollback' THEN RAISE; END IF;
  END;
END $verify$;
SELECT 'rate SQL checks passed' AS result, to_regclass('pg_temp.form_rate_limits') IS NULL AS temporary_ddl_rolled_back,
 (SELECT count(*) FROM public.reviews) AS reviews_count, (SELECT count(*) FROM public.feature_requests) AS feature_requests_count;
