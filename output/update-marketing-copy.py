from pathlib import Path
import re
p=Path('lib/i18n/dictionaries.ts'); s=p.read_text(encoding='utf-8')
s,n=re.subn(r'^  plans: \{.*?(?=^  whatsNew:)', '', s, flags=re.M|re.S); assert n==3,n
replacements={
'מתחילים בחינם · שדרוג Pro לבחירה':'גלו מה אפשר לעשות באפליקציה',
'Start free · Optional Pro upgrade':'Explore the app’s features',
'צופים בסיכום החודשי ומשתפים דוחות. ב-Pro: ייצוא Excel חודשי, דוח שנתי וגיבוי ל-Drive.':'צופים בסיכום החודשי, עוברים על המשמרות ומשתפים דוחות מתוך האפליקציה.',
'View monthly summaries and share reports. Pro adds monthly Excel export, a yearly report, and Drive backup.':'View your monthly summary, review your shifts, and share reports from the app.',
'כן. ההורדה, שעון הנוכחות וחישובי הבסיס זמינים בחינם. שדרוג Pro בתשלום חד-פעמי מוסיף גיבוי ושחזור ל-Google Drive (עד 10 גרסאות), ייצוא Excel חודשי וסיכום משמרות שנתי לקראת עונת המס. המחיר מוצג באפליקציה לפני הרכישה. תכונות חדשות בעתיד עשויות להיות מוצעות בנפרד, גם במנוי; פרטי התשלום יוצגו מראש.':'כן. אפשר להוריד את האפליקציה ולהשתמש בשעון הנוכחות ובחישובי הבסיס בחינם.',
'Yes. Downloading the app, using the time clock, and core calculations are free. An optional one-time Pro purchase adds Google Drive backup and restore (up to 10 versions), monthly Excel export, and a yearly shift summary for tax season. The price appears in the app before purchase. Future features may be sold separately, including by subscription; payment details will be shown in advance.':'Yes. You can download the app and use the time clock and core calculations for free.',
'איך מגבים את המשמרות?':'אפשר לסנכרן משמרות ליומן?',
'ב-Pro אפשר ליצור גיבוי ידני ב-Google Drive ולשחזר ממנו. הגיבוי אינו אוטומטי כרגע, לכן כדאי לבצע אותו לפני מעבר למכשיר אחר או התקנה מחדש.':'כן. אפשר לסנכרן את המשמרות ליומן המכשיר, כולל יומן Google, לפי היומן שבחרתם.',
'How do I back up my shifts?':'Can I sync shifts to my calendar?',
'Pro lets you create a manual Google Drive backup and restore it. Backups are not automatic yet, so make one before switching devices or reinstalling the app.':'Yes. You can sync shifts to your selected device calendar, including Google Calendar.',
'האפליקציה זמינה לאנדרואיד, עם שימוש בסיסי בחינם ושדרוג Pro לבחירה.':'האפליקציה זמינה לאנדרואיד.',
'It’s available for Android, with free core features and an optional Pro upgrade.':'It’s available for Android.',
'    milestones: [TitledItem, TitledItem];':'    milestones: [TitledItem];',
}
for a,b in replacements.items():
 assert a in s,a
 s=s.replace(a,b)
s,n=re.subn(r'      \{\s*title: "גיבוי אוטומטי וסנכרון ל-Google Drive",.*?      \},\n','',s,flags=re.S); assert n==1,n
s,n=re.subn(r'      \{\s*title: "Automatic Google Drive backup & sync",.*?      \},\n','',s,flags=re.S); assert n==1,n
p.write_text(s,encoding='utf-8')
p=Path('app/page.tsx'); s=p.read_text(encoding='utf-8').replace('import Plans from "@/components/Plans";\n','').replace('          <Plans />\n',''); p.write_text(s,encoding='utf-8')
p=Path('components/Hero.tsx');s=p.read_text(encoding='utf-8').replace('href="#plans"','href="#features"');p.write_text(s,encoding='utf-8')
p=Path('components/AppCarousel.tsx');s=p.read_text(encoding='utf-8').replace('containScroll: false,','containScroll: "keepSnaps",');p.write_text(s,encoding='utf-8')
p=Path('app/globals.css');s=p.read_text(encoding='utf-8');s=re.sub(r'\.plan-surface \{[^}]*\}\s*\.plan-surface-pro \{[^}]*\}', '',s);p.write_text(s,encoding='utf-8')
