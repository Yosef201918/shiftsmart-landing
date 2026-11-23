const fs=require('fs');
let s=fs.readFileSync('lib/i18n/dictionaries.ts','utf8');
let n=0;s=s.replace(/^  plans: \{[\s\S]*?(?=^  whatsNew:)/gm,()=>{n++;return ''});if(n!==3)throw Error('plans '+n);
const pairs=[
['מתחילים בחינם · שדרוג Pro לבחירה','גלו מה אפשר לעשות באפליקציה'],
['Start free · Optional Pro upgrade','Explore the app’s features'],
['צופים בסיכום החודשי ומשתפים דוחות. ב-Pro: ייצוא Excel חודשי, דוח שנתי וגיבוי ל-Drive.','צופים בסיכום החודשי, עוברים על המשמרות ומשתפים דוחות מתוך האפליקציה.'],
['View monthly summaries and share reports. Pro adds monthly Excel export, a yearly report, and Drive backup.','View your monthly summary, review your shifts, and share reports from the app.'],
['כן. ההורדה, שעון הנוכחות וחישובי הבסיס זמינים בחינם. שדרוג Pro בתשלום חד-פעמי מוסיף גיבוי ושחזור ל-Google Drive (עד 10 גרסאות), ייצוא Excel חודשי וסיכום משמרות שנתי לקראת עונת המס. המחיר מוצג באפליקציה לפני הרכישה. תכונות חדשות בעתיד עשויות להיות מוצעות בנפרד, גם במנוי; פרטי התשלום יוצגו מראש.','כן. אפשר להוריד את האפליקציה ולהשתמש בשעון הנוכחות ובחישובי הבסיס בחינם.'],
['Yes. Downloading the app, using the time clock, and core calculations are free. An optional one-time Pro purchase adds Google Drive backup and restore (up to 10 versions), monthly Excel export, and a yearly shift summary for tax season. The price appears in the app before purchase. Future features may be sold separately, including by subscription; payment details will be shown in advance.','Yes. You can download the app and use the time clock and core calculations for free.'],
['איך מגבים את המשמרות?','אפשר לסנכרן משמרות ליומן?'],
['ב-Pro אפשר ליצור גיבוי ידני ב-Google Drive ולשחזר ממנו. הגיבוי אינו אוטומטי כרגע, לכן כדאי לבצע אותו לפני מעבר למכשיר אחר או התקנה מחדש.','כן. אפשר לסנכרן את המשמרות ליומן המכשיר, כולל יומן Google, לפי היומן שבחרתם.'],
['How do I back up my shifts?','Can I sync shifts to my calendar?'],
['Pro lets you create a manual Google Drive backup and restore it. Backups are not automatic yet, so make one before switching devices or reinstalling the app.','Yes. You can sync shifts to your selected device calendar, including Google Calendar.'],
['האפליקציה זמינה לאנדרואיד, עם שימוש בסיסי בחינם ושדרוג Pro לבחירה.','האפליקציה זמינה לאנדרואיד.'],
['It’s available for Android, with free core features and an optional Pro upgrade.','It’s available for Android.'],
['    milestones: [TitledItem, TitledItem];','    milestones: [TitledItem];']
];
for(const [a,b]of pairs){if(!s.includes(a))throw Error('missing '+a);s=s.replaceAll(a,b)}
for(const title of ['גיבוי אוטומטי וסנכרון ל-Google Drive','Automatic Google Drive backup & sync']){const start=s.indexOf('      {\n        title: "'+title+'",');if(start<0)throw Error(title);const end=s.indexOf('      },',start)+9;s=s.slice(0,start)+s.slice(end)}
fs.writeFileSync('lib/i18n/dictionaries.ts',s);
function edit(p,fn){fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')))}
edit('app/page.tsx',s=>s.replace('import Plans from "@/components/Plans";\n','').replace('          <Plans />\n',''));
edit('components/Hero.tsx',s=>s.replace('href="#plans"','href="#features"'));
edit('components/AppCarousel.tsx',s=>s.replace('containScroll: false,','containScroll: "keepSnaps",'));
edit('app/globals.css',s=>s.replace(/\.plan-surface \{[^}]*\}\s*\.plan-surface-pro \{[^}]*\}/,''));
