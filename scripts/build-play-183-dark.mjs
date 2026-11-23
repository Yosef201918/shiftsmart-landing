// חיבור גרפי מדויק שאושר: צילום אמיתי, כותרת וקווי רקע מאופקים בלבד.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'assets/play-store/183-dark-A');
const captures=path.join(root,'assets/app-captures/play-183-dark');
await fs.mkdir(out,{recursive:true});
const topics=[
 ['01-clock-idle',['מתחילים משמרת.','בלחיצה אחת.'],['Start your shift.','With one tap.']],
 ['02-active-shift',['עוקבים אחרי השעות.','בזמן אמת.'],['Track your hours.','As you work.']],
 ['03-monthly-summary',['רואים את החודש.','מבינים את התמונה.'],['Your month.','At a glance.']],
 ['04-workplaces',['כמה עבודות.','מקום אחד.'],['Multiple jobs.','One place.']],
 ['05-history',['כל משמרת.','עם כל הפרטים.'],['Every shift.','Every detail.']],
 ['06-calendar',['מתכננים מראש.','מגיעים מוכנים.'],['Plan ahead.','Stay organized.']],
 ['07-preferences',['מגדירים פעם אחת.','עובדים בדרך שלכם.'],['Your preferences.','Your way.']],
];
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const manifest=[];
for(const lang of ['he','en']){
 await fs.mkdir(path.join(out,lang),{recursive:true});
 for(const [id,he,en] of topics){
  // פרטי תכנון מלאים מציגים גם שעת סיום, במקום לחזור על שני צילומי יומן בסט.
  const sourceFile=id==='06-calendar'?'06b-calendar-details':id;
  const sourcePath=path.join(captures,lang,sourceFile+'.png');
  const original=await fs.readFile(sourcePath);
  const title=lang==='he'?he:en;
  const dir=lang==='he'?'rtl':'ltr';
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920"><defs><radialGradient id="glow"><stop stop-color="#00b775" stop-opacity=".18"/><stop offset="1" stop-color="#030e14" stop-opacity="0"/></radialGradient></defs><rect width="1080" height="1920" fill="#030e14"/><ellipse cx="540" cy="1270" rx="770" ry="900" fill="url(#glow)"/><g fill="none" stroke="#1a7759"><circle cx="-210" cy="920" r="520" stroke-width="2" opacity=".25"/><circle cx="-210" cy="920" r="485" stroke-width="12" opacity=".08"/><circle cx="1255" cy="1500" r="420" stroke-width="2" opacity=".22"/><circle cx="1255" cy="1500" r="385" stroke-width="2" opacity=".1"/></g><g font-family="Segoe UI" font-size="82" font-weight="700" text-anchor="middle" direction="${dir}"><text x="540" y="120" fill="#f5faf7">${esc(title[0])}</text><text x="540" y="216" fill="#00e991">${esc(title[1])}</text></g><rect x="168" y="258" width="744" height="1624" rx="19" fill="#172124" stroke="#537765" stroke-width="1.5"/><rect x="177" y="267" width="726" height="1606" fill="#050a0c"/><text x="540" y="1909" text-anchor="middle" direction="${dir}" font-family="Segoe UI" font-size="25" fill="#9ab6a8">${lang==='he'?'המסך מציג נתוני הדגמה':'Screen shows demo data'}</text></svg>`;
  const screen=await sharp(original).resize(720,1600,{kernel:'lanczos3'}).removeAlpha().png().toBuffer();
  const file=path.join(out,lang,id+'.png');
  await sharp(Buffer.from(svg)).composite([{input:screen,left:180,top:270}]).removeAlpha().png().toFile(file);
  const actual=await sharp(file).extract({left:180,top:270,width:720,height:1600}).raw().toBuffer();
  if(!actual.equals(await sharp(screen).raw().toBuffer()))throw new Error('שינוי בפיקסלי הממשק: '+file);
  const meta=await sharp(file).metadata();
  if(meta.width!==1080||meta.height!==1920||meta.channels!==3||meta.hasAlpha)throw new Error('פורמט לא מתאים לחנות');
  manifest.push({id,lang,title,source:`../../app-captures/play-183-dark/${lang}/${sourceFile}.png`,file:`${lang}/${id}.png`,sourceSha256:hash(original),outputSha256:hash(await fs.readFile(file)),width:1080,height:1920,channels:3,alpha:false,screen:{left:180,top:270,width:720,height:1600},pixelVerification:'התאמה מלאה למקור לאחר הקטנה אחידה ביחס 2/3',status:'מוכן לבדיקת משתמש; לא פורסם',method:'חיבור בקוד שאושר, ללא יצירת תמונות או ממשק ב־AI'});
 }
 const tiles=await Promise.all(topics.map(async([id],i)=>({input:await sharp(path.join(out,lang,id+'.png')).resize(270,480).toBuffer(),left:i*270,top:0})));
 await sharp({create:{width:1890,height:480,channels:3,background:'#030e14'}}).composite(tiles).png().toFile(path.join(out,`contact-sheet-${lang}.png`));
}
await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const sections=['he','en'].map(lang=>`<section id="${lang}" lang="${lang}" dir="${lang==='he'?'rtl':'ltr'}"><h2>${lang==='he'?'עברית':'English'} <span>07 / PHONE SCREENSHOTS</span></h2><div class="grid">${manifest.filter(x=>x.lang===lang).map((x,i)=>`<article><div class="label"><b>${String(i+1).padStart(2,'0')}</b><span>${esc(x.title.join(' '))}</span></div><a href="${x.file}" target="_blank" rel="noopener"><img src="${x.file}" width="1080" height="1920" alt="${esc(x.title.join(' '))}" loading="lazy"></a><div class="links"><a href="${x.file}" download>PNG מלא ↓</a><a href="${x.source}" target="_blank" rel="noopener">צילום המקור ↗</a></div></article>`).join('')}</div></section>`).join('');
await fs.writeFile(path.join(out,'GALLERY.html'),`<!doctype html><html lang="he" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Shift Smart · סט כהה לחנות · A</title><style>*{box-sizing:border-box}body{margin:0;background:#071014;color:#f4f8f5;font-family:"Segoe UI",sans-serif}main{max-width:1540px;margin:auto;padding:48px clamp(20px,4vw,60px)}.eyebrow{color:#00df91;font-size:12px;letter-spacing:3px}h1{font-size:clamp(34px,5vw,58px);letter-spacing:-1px;margin:22px 0 14px}header p{max-width:850px;line-height:1.9;color:#b6c9bf}.note{border-right:3px solid #00df91;background:#0c211a;padding:14px 20px;line-height:1.8;color:#c4dcd0}nav{display:flex;gap:12px;flex-wrap:wrap;margin:26px 0 45px}nav a{border:1px solid #31503f;border-radius:30px;padding:11px 24px;text-decoration:none}a{color:#a7e8c9}section+section{border-top:1px solid #244131;margin-top:70px;padding-top:25px}h2{display:flex;align-items:center;justify-content:space-between;font-size:29px}h2 span{font-size:11px;letter-spacing:2px;color:#86a795}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:34px 24px}.label{display:flex;align-items:center;gap:12px;min-height:54px}.label b{color:#00df91;font-size:23px}.label span{font-size:13px;color:#b9d1c3}img{display:block;width:100%;height:auto;border:1px solid #253e31}.links{display:flex;justify-content:space-between;padding:12px 0;font-size:13px}a:focus-visible{outline:3px solid #00df91;outline-offset:5px}footer{margin-top:45px;color:#91aa9b;font-size:13px;line-height:1.8}@media(min-width:1450px){.grid{grid-template-columns:repeat(4,1fr)}}@media(max-width:600px){.grid{grid-template-columns:1fr}}</style><main><header><div class="eyebrow" dir="ltr">SHIFT SMART / GOOGLE PLAY / A</div><h1>כהה. ברור. בשליטה.</h1><p>הכיוון שבחרת, עם הממשק האמיתי במצב כהה. טבעות עדינות, מסגרת דקה וזוהר ירוק מאופק; בלי דימוי מכשיר מבריק, פרספקטיבה או קישוטים צפים. שבע תמונות בכל שפה, בסדר שמתחיל בהחתמה, במשמרת פעילה ובסיכום חודשי.</p><div class="note">מוכן לבדיקה ולאישור שלך. כל המסכים צולמו מחדש מהאפליקציה עם נתוני הדגמה בלבד. לא נעשה שימוש בייצור תמונות AI; אזור הממשק בכל PNG אומת מול צילום המקור לאחר הקטנה אחידה. התמונות לא פורסמו בחנות ולא החליפו את תמונות האתר.</div><nav><a href="#he">עברית</a><a href="#en">English</a><a href="contact-sheet-he.png" target="_blank">כל הסט בעברית ↗</a><a href="contact-sheet-en.png" target="_blank">כל הסט באנגלית ↗</a></nav></header>${sections}<footer>1080×1920 · PNG RGB ללא שקיפות · צילומי מקור 1080×2400 · לחיצה על תמונה פותחת אותה בגודל מלא.<br>בתמונת היומן נבחר פריים הפרטים, שמציג את שעת הסיום והתזכורות. צילום החודש המלא נשמר במקורות.</footer></main></html>`);
console.log('נוצרו 14 תמונות בסגנון A וגלריה; כל אזורי הממשק עברו אימות פיקסלים ופורמט.');
