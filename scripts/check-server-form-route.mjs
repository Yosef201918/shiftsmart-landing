// Actual handler, fake database callback. No env files, HTTP requests, or database writes.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
let expire;
function compile(file, imports = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  vm.runInNewContext(code, { exports, require: name => name in imports ? imports[name] : require(name),
    Request, Response, TextDecoder, Uint8Array, AbortController, URL,
    setTimeout: fn => { expire = fn; return 1; }, clearTimeout() {},
  });
  return exports;
}
const guards = compile('lib/formGuards.ts');
const { createFormHandler } = compile('lib/server/formSubmission.ts', { '@/lib/formGuards': guards });
const config = { enabled: true, secret: 'test-only-secret-with-at-least-32-characters', databaseUrl: 'https://fake.invalid', databaseKey: 'test-only', origins: ['https://site.invalid'], vercel: true, development: false };
const payload = { kind: 'review', name: ' יוסף ', content: ' תודה 👍 ', rating: 4 };
const accepted = { accepted: true, retry_after_seconds: 0 };
function request(body = payload, headers = {}) {
  return new Request('https://site.invalid/api/forms', { method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://site.invalid', 'x-vercel-forwarded-for': '203.0.113.4', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}
let passed = 0;
for (const [status, req, overrides] of [
  [404, request(), { enabled: false }],
  [403, request(payload, { origin: 'https://attacker.invalid' }), {}],
  [403, request(payload, { origin: '' }), {}],
  [415, request(payload, { 'content-type': 'text/plain' }), {}],
  [413, request(payload, { 'content-length': '9000' }), {}],
  [413, request(' '.repeat(8193)), {}],
  [400, request('{broken'), {}],
  [400, request(null), {}],
  [400, request({ ...payload, content: '\u200b\u200f' }), {}],
  [400, request({ ...payload, name: 'x'.repeat(61) }), {}],
  [400, request({ ...payload, content: 'x'.repeat(501) }), {}],
  [400, request({ ...payload, rating: 1.5 }), {}],
  [400, request({ ...payload, status: 'approved' }), {}],
  [400, request({ ...payload, kind: 'feature' }), {}],
  [503, request(), { secret: undefined }],
  [503, request(), { databaseKey: undefined }],
  [503, request(payload, { 'x-vercel-forwarded-for': '' }), {}],
  [503, request(payload, { 'x-vercel-forwarded-for': 'spoofed', 'x-forwarded-for': '203.0.113.1' }), {}],
  [503, request(), { vercel: false }],
  [200, request({ ...payload, website: 'bot' }), {}],
]) {
  let calls = 0;
  const res = await createFormHandler({ ...config, ...overrides }, async () => { calls++; return accepted; })(req);
  assert.equal(res.status, status); assert.equal(calls, 0); assert.equal(res.headers.get('cache-control'), 'no-store'); passed++;
}
let keys = [];
const success = createFormHandler(config, async (data, key) => {
  assert.equal(data.name, 'יוסף'); assert.equal(data.content, 'תודה 👍');
  assert.match(key, /^[a-f0-9]{64}$/); assert.equal(key.includes('203.0.113'), false); keys.push(key); return accepted;
});
assert.equal((await success(request())).status, 200);
assert.equal((await success(request())).status, 200);
assert.equal(keys[0], keys[1]); passed++;
const isolatedKeys = [];
const capture = createFormHandler(config, async (_, key) => { isolatedKeys.push(key); return accepted; });
assert.equal((await capture(request())).status,200);
assert.equal((await capture(request(payload, {'x-vercel-forwarded-for':'203.0.113.5'}))).status,200);
assert.equal((await capture(request({kind:'feature',name:'יוסף',content:'רעיון חדש'}))).status,200);
assert.equal(new Set(isolatedKeys).size,3); passed++;
const limited = await createFormHandler(config, async () => ({ accepted: false, retry_after_seconds: 37 }))(request());
assert.equal(limited.status, 429); assert.equal(limited.headers.get('retry-after'), '37'); passed++;
assert.equal((await createFormHandler(config, async () => { throw new Error('private detail'); })(request())).status, 503); passed++;
assert.equal((await createFormHandler(config, async () => ({ accepted: true }))(request())).status, 503); passed++;
const local = { ...config, origins: [], vercel: false, development: true };
assert.equal((await createFormHandler(local, async () => accepted)(new Request('http://127.0.0.1:3001/api/forms', { method:'POST', headers:{origin:'http://127.0.0.1:3001','content-type':'application/json'},body:JSON.stringify(payload) }))).status, 200); passed++;
let entered;
const ready = new Promise(resolve => { entered = resolve; });
const timed = createFormHandler(config, async (_, __, signal) => new Promise((resolve, reject) => {
  signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true }); entered();
}))(request());
await ready; expire(); assert.equal((await timed).status, 503); passed++;
// Independent handler instances must use the same derived key and delegate to shared storage.
const used = new Set();
const shared = async (_, key) => { if (used.has(key)) return {accepted:false,retry_after_seconds:30}; used.add(key); return accepted; };
const responses = await Promise.all([createFormHandler(config, shared)(request()), createFormHandler(config, shared)(request())]);
assert.deepEqual(responses.map(x => x.status).sort(), [200,429]); passed++;
console.log(`PASS: ${passed} server-handler scenarios; shared-store concurrency is simulated, not a database concurrency test. Zero network or persistent writes.`);
