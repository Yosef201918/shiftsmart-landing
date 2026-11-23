import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const session=process.env.PLAY_CAPTURE_SESSION??'play-183-light';
if(!['play-183-light','play-183-dark'].includes(session))throw new Error('סשן לא מוכר');
const captures=path.join(root,'assets/app-captures',session);
const names=['01-clock-idle','02-active-shift','03-monthly-summary','04-workplaces','05-history','06-calendar','06b-calendar-details','07-preferences'];
const rows=[];
for(const lang of ['he','en']){
 const tiles=[];
 for(let i=0;i<names.length;i++){
  const file=path.join(captures,lang,names[i]+'.png');
  const bytes=await fs.readFile(file),meta=await sharp(bytes).metadata();
  if(meta.width!==1080||meta.height!==2400||meta.format!=='png')throw new Error('ממדים שגויים: '+file);
  rows.push({file:`${lang}/${names[i]}.png`,width:meta.width,height:meta.height,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),capture:'ADB screencap original, no retouching',theme:session.endsWith('dark')?'dark':'light',demoData:true,targetAppVersion:'1.8.3',nativeBinaryVersion:'1.8.2/40',runtime:'Current local Metro JS; polished Jobs/Settings and monthly comparison visually verified'});
  tiles.push({input:await sharp(bytes).resize(270,600).toBuffer(),left:(i%4)*270,top:Math.floor(i/4)*600});
 }
 await sharp({create:{width:1080,height:1200,channels:3,background:'#061017'}}).composite(tiles).png().toFile(path.join(captures,`contact-sheet-${lang}.png`));
}
await fs.writeFile(path.join(captures,'manifest.json'),JSON.stringify(rows,null,2)+'\n');
console.log('אומתו 16 צילומי PNG מקוריים ברזולוציית 1080×2400; נוצרו מניפסט ותצוגות מרוכזות.');
