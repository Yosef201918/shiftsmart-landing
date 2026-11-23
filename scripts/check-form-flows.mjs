// Execute the actual component handlers with in-memory hooks and a mocked API.
// No browser, environment file, Supabase connection, or real write is used.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function compile(file, imports, globals = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: (name) => {
    if (name in imports) return imports[name];
    if (name === 'react/jsx-runtime') return require(name);
    throw new Error(`Unexpected dependency: ${name}`);
  }, console: { error() {} }, AbortController, Set, ...globals }, { filename: file });
  return exports;
}
const { dictionaries } = compile('lib/i18n/dictionaries.ts', {
  '@/lib/marketingAssets': compile('lib/marketingAssets.ts', {}),
});
function nodes(element) {
  if (Array.isArray(element)) return element.flatMap(nodes);
  if (!element || typeof element !== 'object' || !element.props) return [];
  return [element, ...nodes(element.props.children)];
}
let useServerMode = false;
function harness(kind, mode = 'success') {
  const slots = [];
  let cursor = 0, tree, resolve, timer, close;
  const calls = [];
  let serverDispatch = false;
  const refs = { dialogRef: {}, triggerRef: {}, viewportRef: {} };
  const state = { cooldown: false, marked: 0, cleared: 0 };
  const react = {
    useState(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = initial;
      return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; }];
    },
    useRef(initial) { const i = cursor++; return slots[i] ??= { current: initial }; },
    useEffect() {}, useId: () => 'test-title', useMemo: fn => fn(),
  };
  const imports = {
    react,
    'framer-motion': { motion: new Proxy({}, { get: (_, key) => `motion.${String(key)}` }), AnimatePresence: 'presence' },
    'lucide-react': { Star: 'star', X: 'x', Lightbulb: 'lightbulb' },
    '@/lib/submitFormViaServer': { submitFormViaServer: async (payload, signal) => {
      if (mode === 'server429' || mode === 'server503') {
        calls.push({ transport: 'server', payload });
        return { error: { message: 'simulated server refusal' }, rateLimited: mode === 'server429' };
      }
      serverDispatch = true;
      const pending = imports['@/lib/supabase'].supabase.from(payload.kind === 'review' ? 'reviews' : 'feature_requests').insert(payload.kind === 'review' ? { name: payload.name, rating: payload.rating, content: payload.content } : { name: payload.name, feature_text: payload.content }).abortSignal(signal);
      serverDispatch = false;
      const result = await pending;
      return { ...result, rateLimited: false };
    } },
    '@/components/OverlayPortal': { default: 'portal' },
    '@/lib/formGuards': { ...compile('lib/formGuards.ts', {}), FORM_LIMITS: { name: 60, review: 500, feature: 1000 }, isCoolingDown: () => state.cooldown, markSubmitted: () => state.marked++ },
    '@/lib/motion': {},
    '@/lib/i18n/LanguageContext': { useLanguage: () => ({ t: dictionaries.he, dir: 'rtl' }) },
    '@/lib/useDialogFocus': { useDialogFocus: (_, handler) => { close = handler; return refs; } },
    '@/lib/supabase': { supabase: { from(table) { return { insert(payload) {
      calls.push({ table, payload, transport: serverDispatch ? 'server' : 'legacy' });
      return { abortSignal(signal) {
        if (mode === 'error') return Promise.resolve({ error: { message: 'simulated API error' } });
        if (mode === 'throw') return Promise.reject(new Error('simulated network failure'));
        if (mode === 'hold') return new Promise(r => {
          resolve = r;
          signal.addEventListener('abort', () => r({ error: { message: 'aborted' } }), { once: true });
        });
        return Promise.resolve({ error: null });
      } };
    } }; } } },
  };
  const file = kind === 'review' ? 'components/Reviews.tsx' : 'components/FeatureRequest.tsx';
  const Component = compile(file, imports, {
    process: { env: { NEXT_PUBLIC_FORM_SUBMISSION_MODE: useServerMode ? 'server' : 'legacy' } },
    setTimeout(fn) { timer = fn; return 1; }, clearTimeout() { state.cleared++; },
  }).default;
  function render() { cursor = 0; tree = Component(); return nodes(tree); }
  function form() { return render().find(n => n.type === 'form'); }
  function fill({ rating = true, honeypot = false, nameValue = '  Local Test  ', contentValue = '  Local content only  ' } = {}) {
    render().find(n => n.type === 'motion.button').props.onClick();
    let all = render();
    all.find(n => n.type === 'input' && n.props.maxLength === 60).props.onChange({ target: { value: nameValue } });
    all.find(n => n.type === 'textarea').props.onChange({ target: { value: contentValue } });
    if (honeypot) all.find(n => n.type === 'input' && n.props.name === 'website').props.onChange({ target: { value: 'bot' } });
    if (kind === 'review' && rating) all.find(n => n.type === 'button' && n.props['aria-label'] === dictionaries.he.reviews.modal.ratingAria(4)).props.onClick();
    render();
  }
  return { render, fill, calls, state, form, submit: () => form().props.onSubmit({ preventDefault() {} }), close: () => close(), finish: () => resolve({ error: null }), expire: () => timer(),
    isOpen: () => !!form(), hasAlert: () => render().some(n => n.props.role === 'alert'),
    isBusy: () => form()?.props['aria-busy'],
    getName: () => render().find(n => n.type === 'input' && n.props.maxLength === 60)?.props.value };
}

let passed = 0;
for (const serverMode of [false, true]) {
useServerMode = serverMode;
for (const kind of ['review', 'feature']) {
  if (useServerMode) for (const mode of ['server429', 'server503', 'throw']) {
    const h = harness(kind, mode); h.fill(); await h.submit();
    assert.equal(h.calls.length, 1); assert.equal(h.calls[0].transport, 'server');
    assert.equal(h.hasAlert(), true); assert.equal(h.isOpen(), true);
    assert.equal(h.state.marked, 0); passed++;
  }
  for (const values of [
    { nameValue: '   ' }, { contentValue: '\t\n' },
    { nameValue: '\u200b\u200f' }, { contentValue: '\u2060\u00a0' },
    { nameValue: 'x'.repeat(61) }, { contentValue: 'x'.repeat(kind === 'review' ? 501 : 1001) },
  ]) {
    const h = harness(kind); h.fill(values); await h.submit();
    assert.equal(h.calls.length, 0); assert.equal(h.hasAlert(), true);
    assert.equal(h.isOpen(), true); assert.equal(h.state.marked, 0); passed++;
  }
  {
    const h = harness(kind); h.fill({ nameValue: 'יוסף', contentValue: 'תודה 👍\u200f' }); await h.submit();
    assert.equal(h.calls.length, 1); assert.equal(h.calls[0].payload.name, 'יוסף'); passed++;
  }
  for (const mode of ['success', 'error', 'throw']) {
    const h = harness(kind, mode); h.fill(); await h.submit();
    assert.equal(h.calls.length, 1);
    assert.equal(h.calls[0].payload.name, 'Local Test');
    assert.equal('status' in h.calls[0].payload, false);
    assert.equal(h.state.cleared, 1);
    if (mode === 'success') { assert.equal(h.isOpen(), false); assert.equal(h.state.marked, 1); }
    else { assert.equal(h.isOpen(), true); assert.equal(h.hasAlert(), true); assert.equal(h.getName(), '  Local Test  '); assert.equal(h.isBusy(), false); }
    passed++;
  }
  {
    const h = harness(kind, 'hold'); h.fill(); const pending = h.submit();
    assert.equal(h.isBusy(), true); h.close(); assert.equal(h.isOpen(), true);
    await h.submit(); assert.equal(h.calls.length, 1);
    h.finish(); await pending; assert.equal(h.isOpen(), false); passed++;
  }
  {
    const h = harness(kind, 'hold'); h.fill(); const pending = h.submit(); h.expire(); await pending;
    assert.equal(h.hasAlert(), true); assert.equal(h.isBusy(), false); assert.equal(h.state.marked, 0);
    h.close(); assert.equal(h.isOpen(), false); passed++;
  }
  {
    const h = harness(kind); h.fill(); h.state.cooldown = true; await h.submit();
    assert.equal(h.calls.length, 0); assert.equal(h.hasAlert(), true); passed++;
  }
  {
    const h = harness(kind); h.fill({ honeypot: true }); await h.submit();
    assert.equal(h.calls.length, 0); assert.equal(h.isOpen(), false); passed++;
  }
}
}
{
  const h = harness('review'); h.fill({ rating: false }); await h.submit();
  assert.equal(h.hasAlert(), true); assert.equal(h.calls.length, 0); passed++;
}
console.log(`PASS: ${passed} isolated form scenarios. Zero network requests or database writes.`);
