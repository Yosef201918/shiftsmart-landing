import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'assets/play-store/183-review');
const captures=path.join(root,'assets/app-captures/play-183-light');
await fs.mkdir(out,{recursive:true});
const choices=[
 {id:'A',name:'זוהר ושעונים',desc:'ההמלצה לסגנון שביקשת: ירוק עשיר, טבעות שעון ברקע ומסגרת דקה סביב צילום בהיר.',x:203,y:350,w:675,h:1500,base:'#030e14',size:82},
 {id:'B',name:'הממשק במרכז',desc:'חלופה ממוקדת קריאות: צילום גדול יותר, כותרת קצרה ושחור־ירוק נקי. פחות פרטים מסביב, יותר קריאות.',x:180,y:280,w:720,h:1600,base:'#061515',size:78},
 {id:'C',name:'מסגרת של מותג',desc:'רקע כהה עם קשת ירוקה רחבה, כותרת מודגשת ולוח גרפיט. תחושה של סדרת קמפיין נפרדת מהאתר.',x:216,y:390,w:648,h:1440,base:'#070e17',size:86},
];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const source=await fs.readFile(path.join(captures,'he/01-clock-idle.png'));
const manifest=[];
for(const c of choices){
 const decor=c.id==='A'?`<g fill="none" stroke="#00ed98"><circle cx="-90" cy="940" r="510" stroke-width="3" opacity=".3"/><circle cx="-90" cy="940" r="465" stroke-width="22" opacity=".10"/><circle cx="1120" cy="1490" r="410" stroke-width="3" opacity=".3"/><circle cx="1120" cy="1490" r="370" stroke-width="2" opacity=".15"/><path d="M0 600H95V810M1080 520H980V710M20 1550H100V1380" opacity=".4" stroke-width="3"/></g>`:c.id==='B'?`<path d="M0 620H82V1430H0M1080 620H998V1430H1080" fill="none" stroke="#00e997" stroke-width="2" opacity=".4"/><rect x="0" y="0" width="1080" height="8" fill="#00e997"/>`:`<circle cx="540" cy="1120" r="800" fill="none" stroke="#00ed98" stroke-width="110" opacity=".12"/><circle cx="540" cy="1120" r="865" fill="none" stroke="#00ed98" stroke-width="2" opacity=".4"/>`;
 const plate=c.id==='B'?'':`<rect x="${c.x-13}" y="${c.y-13}" width="${c.w+26}" height="${c.h+26}" rx="22" fill="#202d30" stroke="#6a9d87" stroke-width="2"/><rect x="${c.x-4}" y="${c.y-4}" width="${c.w+8}" height="${c.h+8}" fill="#050b0d"/>`;
 const top=c.id==='B'?116:155;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920"><defs><radialGradient id="glow"><stop stop-color="#00b775" stop-opacity=".36"/><stop offset="1" stop-color="${c.base}" stop-opacity="0"/></radialGradient></defs><rect width="1080" height="1920" fill="${c.base}"/><ellipse cx="540" cy="1320" rx="800" ry="950" fill="url(#glow)"/>${decor}<g font-family="Segoe UI" font-weight="750" font-size="${c.size}" text-anchor="middle" direction="rtl"><text x="540" y="${top}" fill="#f4faf7">מתחילים משמרת.</text><text x="540" y="${top+96}" fill="#00ef9b">בלחיצה אחת.</text></g>${plate}<text x="540" y="1908" text-anchor="middle" direction="rtl" font-family="Segoe UI" font-size="22" fill="#acccbd">המסך מציג נתוני הדגמה</text></svg>`;
 const screen=await sharp(source).resize(c.w,c.h).removeAlpha().png().toBuffer();
 const file=`concept-${c.id}.png`;
 await sharp(Buffer.from(svg)).composite([{input:screen,left:c.x,top:c.y}]).removeAlpha().png().toFile(path.join(out,file));
 const actual=await sharp(path.join(out,file)).extract({left:c.x,top:c.y,width:c.w,height:c.h}).raw().toBuffer();
 if(!actual.equals(await sharp(screen).raw().toBuffer()))throw new Error('אי התאמה לצילום המקור');
 manifest.push({...c,file,source:'../../app-captures/play-183-light/he/01-clock-idle.png',sourceSha256:sha(source),interfaceVerification:'התאמה מלאה לפלט הקטנה אחידה של המקור',status:'הצעת עיצוב לבחירה בלבד'});
}
await fs.writeFile(path.join(out,'concepts.json'),JSON.stringify(manifest,null,2));
const composite=await Promise.all(choices.map(async(c,i)=>({input:await sharp(path.join(out,`concept-${c.id}.png`)).resize(360,640).toBuffer(),left:i*360,top:0})));
await sharp({create:{width:1080,height:640,channels:3,background:'#051019'}}).composite(composite).png().toFile(path.join(out,'concepts-comparison.png'));
const topics=[['01-clock-idle','התחלת משמרת'],['02-active-shift','במהלך משמרת'],['03-monthly-summary','סיכום חודשי'],['04-workplaces','עבודות'],['05-history','פרטי משמרת'],['06-calendar','יומן'],['06b-calendar-details','תכנון משמרת'],['07-preferences','החתמה ואבטחה']];
const sections=[];
for(const lang of ['he','en']){
 const rows=[];
 for(const [id,title]of topics){const file=path.join(captures,lang,id+'.png');try{await fs.access(file);}catch{continue;}rows.push(`<article><a href="../../app-captures/play-183-light/${lang}/${id}.png" target="_blank"><img loading="lazy" src="../../app-captures/play-183-light/${lang}/${id}.png" alt="${title} ${lang}" width="1080" height="2400"></a><p>${title}</p></article>`);}
 sections.push(`<section id="${lang}"><h2>${lang==='he'?'צילומי מקור · עברית':'צילומי מקור · English'}</h2><div class="captures">${rows.join('')}</div></section>`);
}
await fs.writeFile(path.join(out,'GALLERY.html'),`<!doctype html><html lang="he" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Shift Smart · צילומים עדכניים וכיווני עיצוב לחנות</title><style>*{box-sizing:border-box}body{margin:0;background:#061017;color:#f1f8f4;font-family:"Segoe UI",sans-serif}main{max-width:1400px;margin:auto;padding:48px 28px}small{color:#00e899;letter-spacing:2px}h1{font-size:clamp(32px,5vw,58px);margin-bottom:12px}header p{max-width:850px;color:#b5c8bf;line-height:1.9}nav{display:flex;gap:12px;flex-wrap:wrap;margin:28px 0}a{color:#8ef2c3}nav a{padding:12px 20px;border:1px solid #2a4a3d;border-radius:28px;text-decoration:none}.concepts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:26px;direction:ltr}.concepts article{direction:rtl}.concepts h2{font-size:23px}.concepts p{font-size:14px;color:#afc9bc;line-height:1.8;min-height:76px}img{display:block;width:100%;height:auto;border:1px solid #345548}section{border-top:1px solid #294337;margin-top:60px;padding-top:25px}.captures{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:24px}.captures p{font-size:14px;color:#c1d8cc}article{min-width:0}.notice{padding:18px;border-right:3px solid #00e899;background:#0c211d;line-height:1.9;color:#c5dfd2}a:focus-visible{outline:3px solid #00e899;outline-offset:5px}@media(max-width:680px){.concepts{grid-template-columns:1fr}.concepts p{min-height:0}.captures{grid-template-columns:repeat(2,minmax(0,1fr))}}</style><main><header><small>SHIFT SMART / GOOGLE PLAY / 1.8.3</small><h1>אותה שפה. פרק חדש בחנות.</h1><p>צילומי האפליקציה העדכנית בעברית ובאנגלית, במצב בהיר ועם נתוני הדגמה. שלוש ההצעות שומרות על השחור והירוק מהאתר, ומשלבות צילום אמיתי ושלם. אין ציור מחדש של הממשק.</p><div class="notice">לבחירת כיוון בלבד. עדיין אין סט שיווקי סופי לחנות ואין פרסום. ההמלצה היא A לשמירה על הסגנון שאהבת; B נותן לממשק יותר שטח ו־C מציע שפה גרפית נפרדת. לחיצה פותחת כל תמונה בגודל מלא.</div><nav><a href="#concepts">שלושה כיוונים</a><a href="#he">מקורות בעברית</a><a href="#en">מקורות באנגלית</a></nav></header><section id="concepts"><h2>איזה כיוון מתאים לחנות?</h2><div class="concepts">${choices.map(c=>`<article><h2><b dir="ltr">${c.id}</b> · ${c.name}</h2><p>${c.desc}</p><a href="concept-${c.id}.png" target="_blank"><img src="concept-${c.id}.png" alt="הצעה ${c.id}: ${c.name}" width="1080" height="1920"></a></article>`).join('')}</div></section>${sections.join('')}</main></html>`);
console.log('נוצרו שלוש הצעות עיצוב וגלריית המקורות.');

