// Rebuilds public/og-image.png (1600x1600, the link-preview image used in the OG/Twitter metadata)
// from the brand poster, so it carries no outdated wording. The poster is centered on a dark
// canvas with the brand circuit-board image behind it at low strength.
// Usage: node scripts/build-og-image.mjs
import path from "node:path";
import sharp from "sharp";

const SIZE = 1600;
const PUBLIC_DIR = path.resolve("public");

const background = await sharp(path.join(PUBLIC_DIR, "background.png"))
  .resize(SIZE, SIZE, { fit: "cover" })
  .modulate({ brightness: 0.35, saturation: 0.7 })
  .toBuffer();

const poster = await sharp(path.join(PUBLIC_DIR, "Sharing image.png"))
  .resize({ height: SIZE })
  .toBuffer({ resolveWithObject: true });

const info = await sharp(background)
  .composite([
    {
      input: poster.data,
      left: Math.round((SIZE - poster.info.width) / 2),
      top: 0,
    },
  ])
  .png({ compressionLevel: 9, palette: true, quality: 85 })
  .toFile(path.join(PUBLIC_DIR, "og-image.png"));

console.log("og-image.png", `${info.width}x${info.height}`, `${Math.round(info.size / 1024)}KB`);
