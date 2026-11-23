-- Actual INSERT checks as anon. Every attempted INSERT is rolled back in an exception subtransaction.
-- Successful INSERTs intentionally raise fixture_rollback; sequences may still advance.
DO $test$
DECLARE bad text; good text; blocked boolean; accepted boolean; passed integer := 0;
BEGIN

  FOREACH bad IN ARRAY ARRAY[NULL::text, '', '  '||chr(9)||chr(10), chr(160)||chr(8203)||chr(8207)||chr(8288)] LOOP
    blocked := false;
    BEGIN
      SET LOCAL ROLE anon;
      EXECUTE 'INSERT INTO public.reviews (name,rating,content) VALUES ($1,4,$2)' USING bad, 'Local validation fixture';
      RAISE EXCEPTION USING ERRCODE='P0001', MESSAGE='fixture_rollback';
    EXCEPTION
      WHEN check_violation OR not_null_violation THEN blocked := true;
      WHEN SQLSTATE 'P0001' THEN
        IF SQLERRM <> 'fixture_rollback' THEN RAISE; END IF;
    END;
    RESET ROLE;
    IF NOT blocked THEN RAISE EXCEPTION 'Blank reviews.name was accepted'; END IF;
    passed := passed + 1;
  END LOOP;

  FOREACH bad IN ARRAY ARRAY[NULL::text, '', '  '||chr(9)||chr(10), chr(160)||chr(8203)||chr(8207)||chr(8288)] LOOP
    blocked := false;
    BEGIN
      SET LOCAL ROLE anon;
      EXECUTE 'INSERT INTO public.reviews (name,rating,content) VALUES ($1,4,$2)' USING 'Local validation fixture', bad;
      RAISE EXCEPTION USING ERRCODE='P0001', MESSAGE='fixture_rollback';
    EXCEPTION
      WHEN check_violation OR not_null_violation THEN blocked := true;
      WHEN SQLSTATE 'P0001' THEN
        IF SQLERRM <> 'fixture_rollback' THEN RAISE; END IF;
    END;
    RESET ROLE;
    IF NOT blocked THEN RAISE EXCEPTION 'Blank reviews.content was accepted'; END IF;
    passed := passed + 1;
  END LOOP;

  FOREACH good IN ARRAY ARRAY['תודה רבה', 'Helpful app', '👍', 'יוסף'||chr(8207)] LOOP
    accepted := false;
    BEGIN
      SET LOCAL ROLE anon;
      EXECUTE 'INSERT INTO public.reviews (name,rating,content) VALUES ($1,4,$2)' USING 'Local validation fixture', good;
      RAISE EXCEPTION USING ERRCODE='P0001', MESSAGE='fixture_rollback';
    EXCEPTION WHEN SQLSTATE 'P0001' THEN
      IF SQLERRM <> 'fixture_rollback' THEN RAISE; END IF;
      accepted := true;
    END;
    RESET ROLE;
    IF NOT accepted THEN RAISE EXCEPTION 'Valid reviews content was rejected'; END IF;
    passed := passed + 1;
  END LOOP;

  FOREACH bad IN ARRAY ARRAY[NULL::text, '', '  '||chr(9)||chr(10), chr(160)||chr(8203)||chr(8207)||chr(8288)] LOOP
    blocked := false;
    BEGIN
      SET LOCAL ROLE anon;
      EXECUTE 'INSERT INTO public.feature_requests (name,feature_text) VALUES ($1,$2)' USING bad, 'Local validation fixture';
      RAISE EXCEPTION USING ERRCODE='P0001', MESSAGE='fixture_rollback';
    EXCEPTION
      WHEN check_violation OR not_null_violation THEN blocked := true;
      WHEN SQLSTATE 'P0001' THEN
        IF SQLERRM <> 'fixture_rollback' THEN RAISE; END IF;
    END;
    RESET ROLE;
    IF NOT blocked THEN RAISE EXCEPTION 'Blank feature_requests.name was accepted'; END IF;
    passed := passed + 1;
  END LOOP;

  FOREACH bad IN ARRAY ARRAY[NULL::text, '', '  '||chr(9)||chr(10), chr(160)||chr(8203)||chr(8207)||chr(8288)] LOOP
    blocked := false;
    BEGIN
      SET LOCAL ROLE anon;
      EXECUTE 'INSERT INTO public.feature_requests (name,feature_text) VALUES ($1,$2)' USING 'Local validation fixture', bad;
      RAISE EXCEPTION USING ERRCODE='P0001', MESSAGE='fixture_rollback';
    EXCEPTION
      WHEN check_violation OR not_null_violation THEN blocked := true;
      WHEN SQLSTATE 'P0001' THEN
        IF SQLERRM <> 'fixture_rollback' THEN RAISE; END IF;
    END;
    RESET ROLE;
    IF NOT blocked THEN RAISE EXCEPTION 'Blank feature_requests.feature_text was accepted'; END IF;
    passed := passed + 1;
  END LOOP;

  FOREACH good IN ARRAY ARRAY['תודה רבה', 'Helpful app', '👍', 'יוסף'||chr(8207)] LOOP
    accepted := false;
    BEGIN
      SET LOCAL ROLE anon;
      EXECUTE 'INSERT INTO public.feature_requests (name,feature_text) VALUES ($1,$2)' USING 'Local validation fixture', good;
      RAISE EXCEPTION USING ERRCODE='P0001', MESSAGE='fixture_rollback';
    EXCEPTION WHEN SQLSTATE 'P0001' THEN
      IF SQLERRM <> 'fixture_rollback' THEN RAISE; END IF;
      accepted := true;
    END;
    RESET ROLE;
    IF NOT accepted THEN RAISE EXCEPTION 'Valid feature_requests content was rejected'; END IF;
    passed := passed + 1;
  END LOOP;

  IF passed <> 24 THEN RAISE EXCEPTION 'Unexpected test count: %', passed; END IF;
END $test$;
SELECT 24 AS passed_insert_checks, (SELECT count(*) FROM public.reviews) AS reviews_count, (SELECT count(*) FROM public.feature_requests) AS feature_requests_count;
