import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import ts from 'typescript';

const exports = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/i18n/resolveLanguage.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports });
const cases = [
  ['Hebrew device', null, ['he-IL', 'en-US'], 'he'],
  ['English device', null, ['en-US', 'he-IL'], 'en'],
  ['English UK', null, ['en-GB'], 'en'],
  ['Legacy Hebrew locale', null, ['iw-IL'], 'he'],
  ['Locale with underscore', null, ['he_IL'], 'he'],
  ['Uppercase locale', null, ['HE-il'], 'he'],
  ['Saved Hebrew wins over device', 'he', ['en-US'], 'he'],
  ['Saved English wins over device', 'en', ['he-IL'], 'en'],
  ['Invalid stored value uses device', 'fr', ['en-US'], 'en'],
  ['Empty saved value uses device', '', ['he-IL'], 'he'],
  ['First supported language', null, ['fr-FR', 'en-US', 'he-IL'], 'en'],
  ['Hebrew supported fallback', null, ['fr-FR', 'he-IL'], 'he'],
  ['Unsupported device defaults Hebrew', null, ['fr-FR'], 'he'],
  ['Missing preferences default Hebrew', null, [], 'he'],
  ['Empty locale skips to next', null, ['', 'en-US'], 'en'],
];
for (const [name, saved, preferred, expected] of cases) {
  assert.equal(exports.resolveLanguage(saved, preferred), expected, name);
}
console.log(`Passed ${cases.length} language preference scenarios.`);
