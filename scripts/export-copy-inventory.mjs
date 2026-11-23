// Read-only extraction of every dictionary leaf for editorial review; no network.
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function load(file, imports = {}) {
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(source, { exports, require(name) {
    if (!(name in imports)) throw Error(`Unexpected import: ${name}`);
    return imports[name];
  } });
  return exports;
}
const assets = load('lib/marketingAssets.ts');
const { dictionaries } = load('lib/i18n/dictionaries.ts', { '@/lib/marketingAssets': assets });
const rows = [];
function visit(path, value) {
  if (typeof value === 'string') rows.push({ path, text: value });
  else if (typeof value === 'function') {
    const argument = path.endsWith('buildText') ? 'https://www.shift-smartapp.com' : path.endsWith('copyright') ? 2026 : 5;
    rows.push({ path, text: value(argument), generatedExample: true });
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) visit(`${path}.${key}`, child);
  }
}
for (const [lang, dictionary] of Object.entries(dictionaries)) visit(lang, dictionary);
fs.mkdirSync('output', { recursive: true });
fs.writeFileSync('output/copy-inventory.json', JSON.stringify(rows, null, 2));
const counts = {};
for (const row of rows) { const group = row.path.split('.').slice(0, 2).join('.'); counts[group] = (counts[group] ?? 0) + 1; }
console.log(JSON.stringify({ totalLeaves: rows.length, groups: counts }, null, 2));
