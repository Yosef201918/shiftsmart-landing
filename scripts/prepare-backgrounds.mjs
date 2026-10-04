// Pre-bakes two atmospheric variants of the brand circuit-board image
// (public/background.png) for the redesign directions: darkened, desaturated
// and with an alpha falloff, so the page needs no runtime CSS filters or blur.
// Output: public/bg/hero-a.webp, public/bg/hero-b.webp
// Usage: node scripts/prepare-backgrounds.mjs
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("public/background.png");
const OUT_DIR = path.resolve("public/bg");

await mkdir(OUT_DIR, { recursive: true });

/* Applies an SVG gradient as the alpha channel of the image */
async function withAlphaMask(pipeline, width, height, maskSvg, file) {
  const info = await pipeline
    .ensureAlpha()
    .composite([{ input: Buffer.from(maskSvg), blend: "dest-in" }])
    .webp({ quality: 82, alphaQuality: 80 })
    .toFile(file);
  console.log(path.basename(file), `${width}x${height}`, `${Math.round(info.size / 1024)}KB`);
}

/* ---- A: wide landscape band, strongest at the top, fading down and to the sides ---- */
{
  const w = 1800;
  const h = 1000;
  const mask = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity="1"/>
        <stop offset="0.55" stop-color="#fff" stop-opacity="0.55"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="h" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/>
        <stop offset="0.18" stop-color="#fff" stop-opacity="1"/>
        <stop offset="0.82" stop-color="#fff" stop-opacity="1"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
      <mask id="m"><rect width="100%" height="100%" fill="url(#h)"/></mask>
    </defs>
    <rect width="100%" height="100%" fill="url(#v)" mask="url(#m)"/>
  </svg>`;
  const pipeline = sharp(SRC)
    .extract({ left: 0, top: 380, width: 2048, height: 1138 })
    .resize(w, h, { fit: "cover" })
    .modulate({ brightness: 0.5, saturation: 0.6 });
  await withAlphaMask(pipeline, w, h, mask, path.join(OUT_DIR, "hero-a.webp"));
}

/* ---- B: square, bright core high in the frame, vignetted to nothing at the edges ---- */
{
  const s = 1600;
  const mask = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
    <defs>
      <radialGradient id="r" cx="0.5" cy="0.34" r="0.62">
        <stop offset="0" stop-color="#fff" stop-opacity="1"/>
        <stop offset="0.5" stop-color="#fff" stop-opacity="0.6"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#r)"/>
  </svg>`;
  const pipeline = sharp(SRC)
    .resize(s, s, { fit: "cover" })
    .modulate({ brightness: 0.55, saturation: 0.75 });
  await withAlphaMask(pipeline, s, s, mask, path.join(OUT_DIR, "hero-b.webp"));
}
