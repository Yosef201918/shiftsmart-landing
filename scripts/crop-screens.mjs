// Cuts the raw app screens out of the marketing composites in public/ so the
// redesign can present them inside its own device frame. Output: public/screens/*.webp
// Usage: node scripts/crop-screens.mjs
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = path.resolve("public");
const OUT_DIR = path.join(PUBLIC_DIR, "screens");

/* left/top/width/height are in the pixel space of each source image */
const EN_BOX = { left: 188, top: 436, width: 566, height: 1160 };

const CROPS = [
  { out: "he-home", src: "mockup-v2.jpg", box: { left: 184, top: 430, width: 402, height: 848 } },
  { out: "he-calendar", src: "Screenshot 5.jpg", box: { left: 152, top: 348, width: 466, height: 940 } },
  { out: "he-summary", src: "Screenshot 6.jpg", box: { left: 176, top: 384, width: 418, height: 766 } },
  { out: "en-home", src: "English screenshot1.png", box: EN_BOX },
  { out: "en-summary", src: "English screenshot4.png", box: EN_BOX },
  { out: "en-calendar", src: "English screenshot5.png", box: EN_BOX },
];

await mkdir(OUT_DIR, { recursive: true });

for (const { out, src, box } of CROPS) {
  const file = path.join(OUT_DIR, `${out}.webp`);
  const info = await sharp(path.join(PUBLIC_DIR, src))
    .extract(box)
    .webp({ quality: 90 })
    .toFile(file);
  console.log(out, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)}KB`);
}
