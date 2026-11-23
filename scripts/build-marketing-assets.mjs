import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const root = process.cwd();
const sourceRoot = path.join(root, 'assets/marketing-concepts');
const manifest = JSON.parse(await fs.readFile(path.join(sourceRoot, 'set-v1/manifest.json'), 'utf8'));
let inputBytes=0, outputBytes=0;
for(const item of manifest){
 const source=path.join(sourceRoot,item.file);
 const folder=path.join(root,'public/marketing/v1',item.lang);
 await fs.mkdir(folder,{recursive:true});
 const output=path.join(folder,`${item.id}.webp`);
 await sharp(source).webp({lossless:true,effort:5}).toFile(output);
 inputBytes+=(await fs.stat(source)).size; outputBytes+=(await fs.stat(output)).size;
}
console.log({images:manifest.length,inputBytes,outputBytes,savedPercent:Math.round(100*(1-outputBytes/inputBytes))});
