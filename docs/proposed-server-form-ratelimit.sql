-- PREPARATION ONLY. Do not apply until server credentials and rollout are approved.
-- Service-role-only RPC; quota and insertion commit or roll back together.
BEGIN;
CREATE SCHEMA IF NOT EXISTS landing_private;
REVOKE ALL ON SCHEMA landing_private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA landing_private TO service_role;
CREATE TABLE landing_private.form_rate_limits (
  bucket text PRIMARY KEY CHECK (bucket ~ '^[0-9a-f]{64}$'),
  next_allowed_at timestamptz NOT NULL,
  accepted_at timestamptz[] NOT NULL CHECK (cardinality(accepted_at) BETWEEN 0 AND 5),
  expires_at timestamptz NOT NULL
);
CREATE INDEX form_rate_limits_expiry ON landing_private.form_rate_limits(expires_at);
ALTER TABLE landing_private.form_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE landing_private.form_rate_limits FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON landing_private.form_rate_limits TO service_role;

CREATE FUNCTION public.submit_landing_form(
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
  DELETE FROM landing_private.form_rate_limits WHERE bucket IN (
    SELECT bucket FROM landing_private.form_rate_limits WHERE expires_at < v_now
    ORDER BY expires_at LIMIT 100 FOR UPDATE SKIP LOCKED
  );
  INSERT INTO landing_private.form_rate_limits(bucket,next_allowed_at,accepted_at,expires_at)
  VALUES(p_key,v_now,ARRAY[]::timestamptz[],v_now + interval '1 day')
  ON CONFLICT (bucket) DO NOTHING;

  -- Lock one shared bucket, including concurrent first submissions from separate servers.
  SELECT next_allowed_at,accepted_at INTO v_next,v_recent
    FROM landing_private.form_rate_limits WHERE bucket=p_key FOR UPDATE;
  v_now := clock_timestamp();
  SELECT coalesce(array_agg(stamp ORDER BY stamp),ARRAY[]::timestamptz[]) INTO v_recent
    FROM unnest(v_recent) AS stamp WHERE stamp > v_now - interval '10 minutes';
  IF v_next > v_now OR cardinality(v_recent) >= 5 THEN
    v_retry := greatest(1,ceil(extract(epoch FROM (greatest(v_next,
      CASE WHEN cardinality(v_recent) >= 5 THEN v_recent[1] + interval '10 minutes' ELSE v_now END
    ) - v_now)))::integer);
    RETURN jsonb_build_object('accepted',false,'retry_after_seconds',v_retry);
  END IF;
  UPDATE landing_private.form_rate_limits SET
    next_allowed_at=v_now + interval '30 seconds', accepted_at=array_append(v_recent,v_now),
    expires_at=v_now + interval '1 day' WHERE bucket=p_key;

  IF p_kind = 'review' THEN
    INSERT INTO public.reviews(name,rating,content) VALUES (p_name,p_rating,p_content);
  ELSE
    INSERT INTO public.feature_requests(name,feature_text) VALUES (p_name,p_content);
  END IF;
  RETURN jsonb_build_object('accepted',true,'retry_after_seconds',0);
END $function$;
REVOKE ALL ON FUNCTION public.submit_landing_form(text,text,text,text,integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_landing_form(text,text,text,text,integer) TO service_role;
COMMIT;
