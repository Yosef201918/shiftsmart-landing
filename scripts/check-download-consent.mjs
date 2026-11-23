// Executes the actual consent store and React components in a network-free VM.
// This checks JavaScript behavior, not Android UI, browser layout, or GA delivery.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const paths = ['lib/cookieConsent.ts', 'lib/links.ts', 'components/DownloadTracking.tsx', 'components/GoogleTag.tsx'];
const compiled = new Map(paths.map(path => [path, ts.transpileModule(fs.readFileSync(path, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
}).outputText]));

function setup({ stored, blocked = false } = {}) {
  const listeners = new Map();
  const effects = [];
  const cleanups = [];
  const events = [];
  const memory = new Map(stored ? [['shiftsmart-cookie-consent', stored]] : []);
  const window = { localStorage: {
    getItem(key) { if (blocked) throw Error('storage blocked'); return memory.get(key) ?? null; },
    setItem(key, value) { if (blocked) throw Error('storage blocked'); memory.set(key, value); },
  } };
  class Element {
    constructor(anchor) { this.anchor = anchor; }
    closest(selector) { assert.equal(selector, 'a[data-download-placement]'); return this.anchor; }
  }
  const document = {
    documentElement: { lang: 'he' },
    addEventListener(type, callback) { if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type).add(callback); },
    removeEventListener(type, callback) { listeners.get(type)?.delete(callback); },
  };
  const loaded = new Map();
  function load(path) {
    if (loaded.has(path)) return loaded.get(path);
    const exports = {};
    vm.runInNewContext(compiled.get(path), { exports, window, document, Element,
      require(name) {
        if (name === 'react/jsx-runtime') return require(name);
        if (name === 'react') return {
          useEffect(callback) { effects.push(callback); },
          useSyncExternalStore(_subscribe, snapshot) { return snapshot(); },
        };
        if (name === 'next/script') return { default: 'Script' };
        if (name === '@/lib/cookieConsent') return load('lib/cookieConsent.ts');
        if (name === '@/lib/links') return load('lib/links.ts');
        throw Error(`Unexpected dependency: ${name}`);
      },
      // There is deliberately no fetch, navigator, Image, XMLHttpRequest, or real DOM.
    });
    loaded.set(path, exports);
    return exports;
  }
  const store = load('lib/cookieConsent.ts');
  const links = load('lib/links.ts');
  const tracking = load('components/DownloadTracking.tsx');
  const tag = load('components/GoogleTag.tsx');
  function mount() { tracking.default(); for (const effect of effects.splice(0)) cleanups.push(effect()); }
  function unmount() { for (const cleanup of cleanups.splice(0)) cleanup?.(); }
  function activate({ placement = 'hero', href = links.PLAY_STORE_URL, type = 'click', button = 0,
    prevented = false, targetIsElement = true } = {}) {
    const event = { type, button, defaultPrevented: prevented,
      target: targetIsElement ? new Element({ href, dataset: { downloadPlacement: placement } }) : {},
      preventDefault() { throw Error('Tracking must not prevent navigation'); },
    };
    for (const callback of listeners.get(type) ?? []) callback(event);
  }
  function installRecorder() { window.gtag = (...args) => events.push(args); }
  mount();
  return { store, links, window, document, events, activate, mount, unmount, installRecorder,
    renderTag: () => tag.default(), memory };
}

let passed = 0;
function check(name, callback) { callback(); passed++; console.log(`PASS ${name}`); }
for (const value of [undefined, 'rejected', 'unexpected']) {
  check(`No event or Google tag for stored ${String(value)}`, () => {
    const h = setup({ stored: value }); h.installRecorder(); h.activate();
    assert.equal(h.events.length, 0); assert.equal(h.renderTag(), null);
  });
}
check('Accepting enables the actual Google tag configuration', () => {
  const h = setup(); h.store.commitConsent('accepted');
  const children = h.renderTag().props.children;
  assert.equal(children[0].props.src, `https://www.googletagmanager.com/gtag/js?id=${h.links.GA_MEASUREMENT_ID}`);
  assert.equal(children[1].props.id, 'gtag-init');
});
for (const lang of ['he', 'en']) for (const placement of ['hero', 'quick_start', 'launch_banner', 'sticky_cta', 'footer']) {
  check(`One event: ${lang}/${placement}`, () => {
    const h = setup({ stored: 'accepted' }); h.document.documentElement.lang = lang; h.installRecorder();
    h.activate({ placement });
    assert.deepEqual(JSON.parse(JSON.stringify(h.events)), [['event', 'play_store_click', {
      send_to: h.links.GA_MEASUREMENT_ID, placement, interface_language: lang,
    }]]);
  });
}
check('No replay of pre-consent activations after accepting', () => {
  const h = setup(); h.installRecorder(); h.activate(); h.store.commitConsent('accepted');
  assert.equal(h.events.length, 0); h.activate(); assert.equal(h.events.length, 1);
});
check('A live consent change to rejected blocks further events', () => {
  const h = setup({ stored: 'accepted' }); h.installRecorder(); h.activate();
  h.store.commitConsent('rejected'); h.activate();
  assert.equal(h.events.length, 1); assert.equal(h.renderTag(), null);
});
check('Unknown placement, other destination, cancelled click and non-element are ignored', () => {
  const h = setup({ stored: 'accepted' }); h.installRecorder();
  h.activate({ placement: 'private user text' }); h.activate({ href: 'https://example.com' });
  h.activate({ prevented: true }); h.activate({ targetIsElement: false });
  assert.equal(h.events.length, 0);
});
check('Middle click counts once; right click does not count', () => {
  const h = setup({ stored: 'accepted' }); h.installRecorder();
  h.activate({ type: 'auxclick', button: 1 }); h.activate({ type: 'auxclick', button: 2 });
  assert.equal(h.events.length, 1);
});
check('Missing or failing analytics never interrupts activation or queues a replay', () => {
  const h = setup({ stored: 'accepted' }); assert.doesNotThrow(() => h.activate());
  h.window.gtag = () => { throw Error('blocked tag'); }; assert.doesNotThrow(() => h.activate());
  h.installRecorder(); assert.equal(h.events.length, 0); h.activate(); assert.equal(h.events.length, 1);
});
check('Effect teardown and remount do not duplicate listeners', () => {
  const h = setup({ stored: 'accepted' }); h.installRecorder(); h.unmount(); h.activate();
  assert.equal(h.events.length, 0); h.mount(); h.activate(); assert.equal(h.events.length, 1);
});
check('Blocked storage still permits explicit in-memory consent', () => {
  const h = setup({ stored: 'accepted', blocked: true }); h.installRecorder(); h.activate();
  assert.equal(h.events.length, 0); h.store.commitConsent('accepted'); h.activate();
  assert.equal(h.events.length, 1);
});
console.log(`Passed ${passed} offline consent/tracking scenarios. No network APIs available.`);
