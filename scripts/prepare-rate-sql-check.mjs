// Produces temporary-table verification SQL. Does not connect to a database.
import fs from 'node:fs';
const source = fs.readFileSync('docs/proposed-server-form-ratelimit.sql', 'utf8');
const table = source.match(/CREATE TABLE landing_private\.form_rate_limits \([\s\S]*?\n\);/)[0].replace('CREATE TABLE landing_private.', 'CREATE TEMP TABLE ');
const fn = source.match(/CREATE FUNCTION public\.submit_landing_form\([\s\S]*?END \$function\$;/)[0]
  .replaceAll('public.submit_landing_form', 'pg_temp.submit_landing_form')
  .replaceAll('landing_private.form_rate_limits', 'pg_temp.form_rate_limits')
  .replaceAll('public.reviews', 'pg_temp.reviews').replaceAll('public.feature_requests', 'pg_temp.feature_requests');
const sql = `-- Test fixtures and DDL exist only inside an intentionally rolled-back subtransaction.
DO $verify$
DECLARE r jsonb; i integer;
BEGIN
  BEGIN
    CREATE TEMP TABLE reviews (LIKE public.reviews INCLUDING CONSTRAINTS INCLUDING DEFAULTS);
    ALTER TABLE pg_temp.reviews DROP COLUMN id;
    CREATE TEMP TABLE feature_requests (LIKE public.feature_requests INCLUDING CONSTRAINTS INCLUDING DEFAULTS);
    ALTER TABLE pg_temp.feature_requests DROP COLUMN id;
    ${table}
    EXECUTE $ddl$${fn}$ddl$;

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
`;
fs.writeFileSync('docs/verify-rate-sql-temporary.sql', sql);
console.log('Generated temporary SQL verification, no database connection.');
