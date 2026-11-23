// Runs the actual ShareButton handlers with fake browser APIs; nothing is shared.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const source = ts.transpileModule(fs.readFileSync('components/ShareButton.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;
const siteUrl = 'https://www.shift-smartapp.com';
function harness({ native = true, files = true, failure, clipboardFailure = false, imageFailure = false, lang = 'he', hold = false } = {}) {
  let cursor = 0, language = lang, tree, resolve, copied = '', shareCalls = [], fetchCalls = [], effects = [];
  const slots = [];
  const react = {
    useState(value) { const i = cursor++; if (!(i in slots)) slots[i] = value; return [slots[i], next => { slots[i] = next; }]; },
    useRef(value) { const i = cursor++; return slots[i] ??= { current: value }; },
    useEffect(effect) { effects.push(effect); },
  };
  const navigator = {
    clipboard: { async writeText(text) { if (clipboardFailure) throw new Error('denied'); copied = text; } },
    canShare: () => files,
  };
  if (native) navigator.share = (payload) => {
    shareCalls.push(payload);
    if (hold) return new Promise(r => { resolve = r; });
    if (failure) return Promise.reject(Object.assign(new Error('simulated'), { name: failure }));
    return Promise.resolve();
  };
  const exports = {};
  vm.runInNewContext(source, { exports, require: name => {
    if (name === 'react/jsx-runtime') return require(name);
    if (name === 'react') return react;
    if (name === 'lucide-react') return { Check: 'check', Share2: 'share' };
    if (name === '@/lib/links') return { SITE_URL: siteUrl };
    if (name === '@/lib/i18n/LanguageContext') return { useLanguage: () => ({ t: {
      appPoster: { imageSrc: language === 'he' ? '/Sharing image.png' : '/Sharing image2.png' },
      share: { buildText: url => `${language}: ${url}`, title: language, buttonLabel: 'Share', copiedLabel: 'Copied', manualCopyLabel: 'Copy manually' },
    } }) };
    throw new Error(name);
  }, navigator, File, AbortController, Error, setTimeout: () => 1, clearTimeout() {}, fetch: async path => {
    fetchCalls.push(path);
    if (imageFailure) throw new Error('offline');
    return { ok: true, blob: async () => new Blob(['image'], { type: 'image/png' }) };
  } });
  function render() { cursor = 0; effects = []; tree = exports.default({}); return tree; }
  function find(element, test) { if (Array.isArray(element)) return element.flatMap(x => find(x, test)); if (!element?.props) return []; return [...(test(element) ? [element] : []), ...find(element.props.children, test)]; }
  function button() { render(); return find(tree, n => n.type === 'button')[0]; }
  return { render, preload: async () => { render(); effects[0](); await new Promise(setImmediate); },
    click: () => button().props.onClick(), shareCalls, fetchCalls,
    copied: () => copied, manual: () => { render(); return find(tree, n => n.type === 'textarea').length > 0; },
    busy: () => button().props.disabled, finish: () => resolve(), setLanguage(value) { language = value; } };
}
let passed = 0;
for (const lang of ['he', 'en']) {
  const h = harness({ lang }); await h.preload(); await h.click();
  assert.equal(h.fetchCalls[0], lang === 'he' ? '/Sharing%20image.png' : '/Sharing%20image2.png');
  assert.equal(h.shareCalls[0].files.length, 1); assert.ok(h.shareCalls[0].text.includes(siteUrl)); passed++;
}
for (const options of [{ files: false }, { imageFailure: true }]) {
  const h = harness(options); await h.preload(); await h.click(); assert.equal('files' in h.shareCalls[0], false); passed++;
}
{
  const h = harness(); const pending = h.click();
  assert.equal(h.shareCalls.length, 1, 'native share is called synchronously, before any fetch');
  await pending; assert.equal(h.fetchCalls.length, 0); passed++;
}
{
  const h = harness({ failure: 'AbortError' }); await h.click(); assert.equal(h.copied(), ''); assert.equal(h.manual(), false); passed++;
}
for (const options of [{ native: false }, { failure: 'NotAllowedError' }]) {
  const h = harness(options); await h.click(); assert.equal(h.copied(), `he: ${siteUrl}`); assert.equal(h.busy(), false); passed++;
}
{
  const h = harness({ native: false, clipboardFailure: true }); await h.click(); assert.equal(h.manual(), true); passed++;
}
{
  const h = harness(); await h.preload(); h.setLanguage('en'); await h.click();
  assert.equal('files' in h.shareCalls[0], false, 'a stale Hebrew image must never accompany English text'); passed++;
}
{
  const h = harness({ hold: true }); const pending = h.click(); await h.click();
  assert.equal(h.shareCalls.length, 1); assert.equal(h.busy(), true); h.finish(); await pending; assert.equal(h.busy(), false); passed++;
}
console.log(`PASS: ${passed} isolated share scenarios. Zero native dialogs, clipboard changes, or external requests.`);
