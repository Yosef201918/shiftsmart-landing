// Real multi-connection PostgreSQL QA. Fixed loopback endpoint and verified disposable data directory.
// Usage: node scripts/check-rate-sql-postgres.mjs ABSOLUTE_TEMP_QA_ROOT
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const exec = promisify(execFile);
const root = path.resolve(process.argv[2] ?? '');
assert.equal(path.basename(root), 'shiftsmart-postgres-17-qa');
const psql = path.join(root, 'pgsql/bin/psql.exe');
const password = fs.readFileSync(path.join(root, 'qa-password.txt'), 'utf8').trim();
const database = 'shiftsmart_form_qa';
const env = { ...process.env, PGHOST:'127.0.0.1', PGPORT:'55432', PGUSER:'shiftsmart_qa', PGPASSWORD:password, PGSSLMODE:'disable', PGCONNECT_TIMEOUT:'5', PGOPTIONS:'', PGCLIENTENCODING:'UTF8' };
async function sql(query, db = database) {
  // Windows psql argv uses the local ANSI code page; UTF-8 stdin preserves Hebrew.
  const running = exec(psql, ['--no-psqlrc','--quiet','--tuples-only','--no-align','--set','ON_ERROR_STOP=1','--dbname',db,'--file=-'], { env, windowsHide:true, maxBuffer:2_000_000, timeout:30_000 });
  running.child.stdin.end(query, 'utf8');
  const result = await running;
  return result.stdout.trim();
}
async function file(name) { return sql(fs.readFileSync(name,'utf8')); }
function object(result) { return JSON.parse(result.split(/\r?\n/).filter(line=>line.startsWith('{')).at(-1)); }
const actualData = await sql('SHOW data_directory','postgres');
assert.equal(path.resolve(actualData).toLowerCase(),path.join(root,'data').toLowerCase(),'Refusing to modify an unrecognized PostgreSQL cluster');
if ((await sql(`SELECT count(*) FROM pg_database WHERE datname='${database}'`,'postgres')) === '0') await sql(`CREATE DATABASE ${database}`,'postgres');
assert.equal(await sql('SELECT current_database()'),database);
// This destructive reset is confined to the named QA database in the verified TEMP cluster.
await sql(`DROP SCHEMA IF EXISTS landing_private CASCADE; DROP SCHEMA public CASCADE; CREATE SCHEMA public;
DO $roles$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='anon') THEN CREATE ROLE anon NOLOGIN; END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='service_role') THEN CREATE ROLE service_role NOLOGIN BYPASSRLS; END IF;
END $roles$;
CREATE TABLE public.reviews(id serial PRIMARY KEY,name text,rating integer CHECK(rating BETWEEN 1 AND 5),content text,status text NOT NULL DEFAULT 'pending',created_at timestamptz DEFAULT now(),CHECK(char_length(name)<=60),CHECK(char_length(content)<=500));
CREATE TABLE public.feature_requests(id serial PRIMARY KEY,name text,feature_text text,status text NOT NULL DEFAULT 'pending',created_at timestamptz DEFAULT now(),CHECK(char_length(name)<=60),CHECK(char_length(feature_text)<=1000));
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY review_insert ON public.reviews FOR INSERT TO anon WITH CHECK(status='pending');
CREATE POLICY feature_insert ON public.feature_requests FOR INSERT TO anon WITH CHECK(status='pending');
CREATE POLICY review_read ON public.reviews FOR SELECT TO anon USING(status='approved');
GRANT USAGE ON SCHEMA public TO anon,authenticated,service_role;
GRANT ALL ON public.reviews,public.feature_requests TO service_role;
GRANT SELECT ON public.reviews TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role,anon;
GRANT INSERT(name,rating,content) ON public.reviews TO anon;
GRANT INSERT(name,feature_text) ON public.feature_requests TO anon;`);
await file('docs/applied-visible-form-content.sql');
await file('docs/verify-rate-sql-temporary.sql');
await file('docs/proposed-server-form-ratelimit.sql');
for (const role of ['anon','authenticated']) {
  for (const query of ["SELECT public.submit_landing_form('review',repeat('a',64),'QA','Content',4)", 'SELECT * FROM landing_private.form_rate_limits']) {
    await assert.rejects(sql(`SET ROLE ${role}; ${query}`),error=>/permission denied/i.test(error.stderr));
  }
}
const races = [];
async function race(label, key) {
  const before = Number(await sql('SELECT count(*) FROM public.reviews'));
  const replies = await Promise.all(Array.from({length:20},()=>sql(`BEGIN; SET LOCAL ROLE service_role;
    SELECT jsonb_build_object('pid',pg_backend_pid(),'result',public.submit_landing_form('review',repeat('${key}',64),'Local QA fixture','Concurrent QA only',4)) FROM (SELECT pg_sleep(0.2)) AS start_barrier;
    COMMIT;`).then(object)));
  assert.equal(new Set(replies.map(x=>x.pid)).size,20);
  assert.equal(replies.filter(x=>x.result.accepted).length,1,label);
  assert.equal(Number(await sql('SELECT count(*) FROM public.reviews'))-before,1);
  assert.equal(replies.filter(x=>!x.result.accepted && x.result.retry_after_seconds>0).length,19);
  races.push({label,connections:20,accepted:1,limited:19});
}
await race('simultaneous first submissions','a');
await sql(`INSERT INTO landing_private.form_rate_limits VALUES(repeat('b',64),clock_timestamp()-interval '1 second',ARRAY[clock_timestamp()-interval '121 seconds',clock_timestamp()-interval '91 seconds',clock_timestamp()-interval '61 seconds',clock_timestamp()-interval '31 seconds'],clock_timestamp()+interval '1 day')`);
await race('one remaining quota slot','b');
await sql(`INSERT INTO landing_private.form_rate_limits VALUES(repeat('c',64),clock_timestamp()-interval '1 second',ARRAY[clock_timestamp()-interval '11 minutes',clock_timestamp()-interval '121 seconds',clock_timestamp()-interval '91 seconds',clock_timestamp()-interval '61 seconds',clock_timestamp()-interval '31 seconds'],clock_timestamp()+interval '1 day')`);
await race('rolling boundary with one expired slot','c');
await file('docs/proposed-disable-direct-form-inserts.sql');
for (const role of ['anon','authenticated']) for (const query of ["INSERT INTO public.reviews(name,rating,content) VALUES('QA',4,'QA')","INSERT INTO public.feature_requests(name,feature_text) VALUES('QA','QA')"]) {
  await assert.rejects(sql(`SET ROLE ${role}; ${query}`),error=>/permission denied/i.test(error.stderr));
}
const valid = object(await sql("SET ROLE service_role; SELECT public.submit_landing_form('feature',repeat('d',64),'Local QA','רעיון לבדיקה בלבד',NULL)"));
assert.equal(valid.accepted,true);
const report = { checkedAt:new Date().toISOString(),postgres:await sql('SELECT version()'),endpoint:'127.0.0.1:55432',database,productionTouched:false,
  races, checks:['temporary SQL logic and rollback','RLS-enabled fixture tables','RPC and private schema inaccessible to public roles','direct inserts blocked for anon/authenticated','service-role feature submission succeeds after cutover'],
  counts:object(await sql("SELECT jsonb_build_object('reviews',(SELECT count(*) FROM public.reviews),'features',(SELECT count(*) FROM public.feature_requests))")) };
fs.writeFileSync('output/rate-postgres-qa-report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
