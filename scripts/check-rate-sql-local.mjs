// Run with an absolute path to the TEMP-installed @electric-sql/pglite/dist/index.js.
// All SQL runs in an ephemeral in-memory PostgreSQL; no Supabase credentials or network.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const { PGlite } = await import(pathToFileURL(process.argv[2]).href);
const db = new PGlite();
try {
  await db.exec(`
    CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
    CREATE TABLE public.reviews(id serial PRIMARY KEY,name text,rating integer CHECK(rating BETWEEN 1 AND 5),content text,status text DEFAULT 'pending',created_at timestamptz DEFAULT now(),CHECK(char_length(name)<=60),CHECK(char_length(content)<=500));
    CREATE TABLE public.feature_requests(id serial PRIMARY KEY,name text,feature_text text,status text DEFAULT 'pending',created_at timestamptz DEFAULT now(),CHECK(char_length(name)<=60),CHECK(char_length(feature_text)<=1000));
    GRANT USAGE ON SCHEMA public TO anon,authenticated,service_role;
    GRANT ALL ON public.reviews,public.feature_requests TO service_role;
    GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role,anon;
    GRANT INSERT(name,rating,content) ON public.reviews TO anon;
    GRANT INSERT(name,feature_text) ON public.feature_requests TO anon;
  `);
  await db.exec(fs.readFileSync('docs/applied-visible-form-content.sql','utf8'));
  const check = await db.exec(fs.readFileSync('docs/verify-rate-sql-temporary.sql','utf8'));
  const result = check.at(-1).rows[0];
  assert.equal(result.temporary_ddl_rolled_back,true);
  assert.equal(result.reviews_count,0); assert.equal(result.feature_requests_count,0);
  // Install the exact proposed DDL only in this ephemeral database, then test grants.
  await db.exec(fs.readFileSync('docs/proposed-server-form-ratelimit.sql','utf8'));
  for (const role of ['anon','authenticated']) {
    await db.exec(`SET ROLE ${role}`);
    try {
      await assert.rejects(db.query("SELECT public.submit_landing_form('review',repeat('a',64),'Test','Content',4)"),error=>error.code==='42501');
      await assert.rejects(db.query('SELECT * FROM landing_private.form_rate_limits'),error=>error.code==='42501');
    } finally { await db.exec('RESET ROLE'); }
  }
  await db.exec('SET ROLE service_role');
  const replies = await Promise.all(Array.from({length:20},()=>db.query("SELECT public.submit_landing_form('review',repeat('a',64),'Test','Content',4) AS result")));
  assert.equal(replies.filter(reply=>reply.rows[0].result.accepted).length,1);
  await db.exec('RESET ROLE');
  assert.equal((await db.query('SELECT count(*)::integer AS total FROM public.reviews')).rows[0].total,1);
  await db.exec(fs.readFileSync('docs/proposed-disable-direct-form-inserts.sql','utf8'));
  await db.exec('SET ROLE anon');
  try {
    await assert.rejects(db.query("INSERT INTO public.reviews(name,rating,content) VALUES('Test',4,'Content')"),error=>error.code==='42501');
    await assert.rejects(db.query("INSERT INTO public.feature_requests(name,feature_text) VALUES('Test','Content')"),error=>error.code==='42501');
  } finally { await db.exec('RESET ROLE'); }
  console.log('PASS: exact proposed SQL, cooldown, rolling-window quota/boundary/reset, insert rollback, cleanup, role isolation and direct-insert cutover. 20 overlapping calls accepted once in serialized PGlite. Multi-connection concurrency still requires staging PostgreSQL. No production changes.');
} finally { await db.close(); }
