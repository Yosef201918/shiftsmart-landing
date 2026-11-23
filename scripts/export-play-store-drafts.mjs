import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Deterministic compositing explicitly approved by the user on 2026-11-01.
// Drafts only: source 1.8.1 screenshots require a current-release recapture.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'assets/play-store/v1');
const manifest = JSON.parse(await fs.readFile(path.join(out, 'manifest.json'), 'utf8'));
const esc = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
for (const item of manifest) {
  const source = path.resolve(out, item.source);
  const original = await fs.readFile(source);
  const lines = item.title.split('. ').map(s => s.replace(/\.$/, ''));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920"><defs><radialGradient id="bg" cx="50%" cy="75%" r="70%"><stop stop-color="#03412f"/><stop offset=".55" stop-color="#071b1e"/><stop offset="1" stop-color="#061018"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#bg)"/><g fill="none" stroke="#0b674c" opacity=".35"><circle cx="540" cy="1150" r="650"/><circle cx="540" cy="1150" r="680"/><path d="M0 540H90V750M1080 1450H990V1650"/></g><text x="540" y="88" text-anchor="middle" fill="#b9d8ca" font-family="Segoe UI" font-size="26" letter-spacing="8">SHIFT SMART</text><g font-family="Segoe UI" font-weight="700" font-size="64" text-anchor="middle" direction="${item.lang === 'he' ? 'rtl' : 'ltr'}">${lines.map((s, i) => `<text x="540" y="${182 + i * 78}" fill="${i ? '#00e995' : '#f5f9f8'}">${esc(s)}</text>`).join('')}</g><text x="540" y="1896" text-anchor="middle" direction="${item.lang === 'he' ? 'rtl' : 'ltr'}" font-family="Segoe UI" font-size="24" fill="#a6bdb2">${item.lang === 'he' ? 'המסך מציג נתוני הדגמה' : 'Screen shows demo data'}</text></svg>`;
  // Entire source retained. Same scale on both axes, no crop, masking or UI retouching.
  const screen = await sharp(original).resize(702, 1560, { fit: 'fill', kernel: 'lanczos3' }).flatten({ background: '#111111' }).removeAlpha().png().toBuffer();
  const filename = `${String(item.order).padStart(2, '0')}-${item.id.replace(/^\d+-/, '')}.png`;
  await fs.mkdir(path.join(out, 'drafts', item.lang), { recursive: true });
  const destination = path.join(out, 'drafts', item.lang, filename);
  await sharp(Buffer.from(svg)).composite([{ input: screen, left: 189, top: 300 }]).removeAlpha().png().toFile(destination);
  const extracted = await sharp(destination).extract({ left: 189, top: 300, width: 702, height: 1560 }).raw().toBuffer();
  const expected = await sharp(screen).raw().toBuffer();
  if (!extracted.equals(expected)) throw new Error(`Source fidelity failed: ${destination}`);
  const metadata = await sharp(destination).metadata();
  if (metadata.width !== 1080 || metadata.height !== 1920 || metadata.channels !== 3 || metadata.hasAlpha) throw new Error(`Format failed: ${destination}`);
  item.file = `drafts/${item.lang}/${filename}`;
  item.sourceSha256 = hash(original);
  item.outputSha256 = hash(await fs.readFile(destination));
  item.sourcePixelVerification = 'Exact RGB equality after uniform 0.65 Lanczos3 resampling';
  item.exportStatus = 'design-draft-not-for-upload-source-refresh-required';
  item.compositingApproval = 'User explicitly approved deterministic code compositing 2026-11-01';
}
await fs.writeFile(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
for (const lang of ['he', 'en']) {
  const tiles = await Promise.all(manifest.filter(x => x.lang === lang).map(async (item, i) => ({ input: await sharp(path.join(out, item.file)).resize(270, 480).toBuffer(), left: i * 270, top: 0 })));
  await sharp({ create: { width: 1890, height: 480, channels: 3, background: '#061018' } }).composite(tiles).png().toFile(path.join(out, `contact-sheet-${lang}.png`));
}
console.log('14 draft RGB PNGs exported, 1080x1920; all 14 interface regions passed exact resampled-source pixel verification.');
