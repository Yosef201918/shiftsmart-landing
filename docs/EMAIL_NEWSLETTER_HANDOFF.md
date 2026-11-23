# העברה לצ׳אט ייעודי — Sender, דומיין המייל והניוזלטר

המשתמש ביקש ב-3.11.2026 להעביר את הטיפול בנושא הזה לצ׳אט חדש באותו פרויקט, כדי שהצ׳אט המקורי יישאר לעבודת האתר הכללית. הטיפול הטכני בסקר האייפון עצמו אינו מועבר לצ׳אט המייל.

## מצב מאומת

- פרויקט מקומי: `C:\Users\USER\Desktop\shiftsmart-landing`. יש שינויים לא מחויבים רבים ומאושרים; אין לאפס/לדרוס/לבצע push או commit גורף.
- Sender: המשתמש התחבר בעצמו, ודף הבית מציג ירוק את Complete registration ואת Verify email address. Account settings מציגים **Account is under review** ומבטיחים עדכון בתוך שעה. אין לבקש/להעתיק סיסמה. החשבון מציג Professional trial לעוד13ימים ואז Free Forever; אין כרטיס. אין לבחור שדרוג/כרטיס/Keep Pro.
- המשתמש מצא את הודעת אימות הדומיין ואימת אותה. Sender מציג בעלות מאומתת בירוק ל-`shift-smartapp.com`; Authentication עדיין שלוש בדיקות אדומות.
- Sender סיפק DKIM CNAME `sender._domainkey` → `dkim.sendersrv.com`, SPF TXT root `v=spf1 include:spf.improvmx.com include:sendersrv.com ~all`, ו-DMARC TXT `_dmarc` → `v=DMARC1; p=none;`. Vercel readback ב-scope `shiftsmart-landing` הראה רק SPF הקיים `v=spf1 include:spf.improvmx.com ~all`, ללא DKIM/DMARC. עדיין לא שונתה אף רשומת Sender: יש לקבל מהמשתמש אישור ממוקד לשדרוג SPF הקיים ולהוספת שתי הרשומות.
- נוצרה קבוצה ריקה `Shift Smart — עדכוני גרסאות`, ID `egG763`. קבוצת הבדיקה והמנוי היחיד בה לא נגעו.
- נוצר טופס Embedded כטיוטה `Shift Smart — הרשמה לעדכוני גרסאות`, ID `dBBk5J`: עברית ו-RTL, אימייל בלבד, הסכמה נפרדת לא מסומנת, ושיוך לקבוצה. לא פורסם ולא הוטמע. בהגדרות Publishing, DOI כבוי ולא זמין: “Double opt-in is only available on verified accounts.” מייל/דומיין אומתו אך החשבון עדיין בבדיקה ולכן DOI חסום. כפתור וטקסט פרטיות באנגלית.
- קוד ההטמעה שנקרא מהחשבון: account ID `22dff9d6a44209`; `https://cdn.sender.net/accounts_resources/universal.js` ואז `sender('22dff9d6a44209')`; mount `<div style="text-align: left" class="sender-form-field" data-sender-form-id="dBBk5J"></div>`. לא להטמיע עד DOI פעיל ובדיקה מוצלחת.
- לא אומתה הגעת מייל בפועל ל-alias. ב-Gmail נמצא מייל הפעלת החשבון של Sender; לא נלחץ קישור ההפעלה. בקשת אימות הדומיין נשלחה בנפרד ל-alias.
- Brevo ננטש עקב קושי בהרשמה. אין לחזור אליו או לפתוח חשבון נוסף שם.
- ImprovMX: המשתמש השלים הרשמה בעצמו, והחשבון אומת בדפדפן כ-`yoseffstor@gmail.com`. הוסף הדומיין `shift-smartapp.com`. הכתובת היחידה היא `updates@shift-smartapp.com` → `yoseffstor@gmail.com`; כלל catch-all אוטומטי שונה ל-updates לפני הפעלת DNS. אחרי טעינה מחדש אומת alias אחד מתוך25, ללאcatch-all.
- ImprovMX Free מציג Forwarding ירוק ושלוש בדיקותDNSירוקות. לא נבדקה בפועל הגעת מייל לתיבת Gmail. לא נשלח מייל בדיקה או ניוזלטר.
- המשתמש אישר במפורש את הכתובת, היעד, ספק ההעברה והוספת רשומות המייל ב-Vercel. ההגדרה הזו כבר בוצעה; אין לשכפל או לבקש עליה אישור מחדש.

## DNS שבוצע ואומת

Vercel scope `shiftsmart-landing`, דומיין `shift-smartapp.com`. רשומות חדשות בלבד, שםריק/root, TTL60:

| ID | סוג | ערך | עדיפות |
|---|---|---|---|
| rec_2f2704ec1ad624eafc30e7c3 | MX | mx1.improvmx.com. | 10 |
| rec_9f8fd0f6a063510757e1734a | MX | mx2.improvmx.com. | 20 |
| rec_bd85306d1998e6839a457590 | TXT | v=spf1 include:spf.improvmx.com ~all | — |

ה-readback ב-Vercel החזיר9רשומות, ללאדףנוסף: שלושחדשותוששהמקוריותללאשינוי (Google-verificationTXT,3CAAמערכתיים,root/wildcardALIAS). DNSציבוריMXאימתאתשניהשרתים; www.shift-smartapp.com השיבHTTP200. איןלשנותnameservers/רשומותאתר/אימותGoogle. SPFנוסףעבורSenderצריךלהתמזגבאותהרשומהאםנדרש, לאליצורמדיניותSPFשנייה. SenderDKIM/DMARCטרםנקראו/נוצרו; השתמשרקבערכיםשהחשבוןיספק.

## קוד הניוזלטר

- `components/NewsletterSignup.tsx` משולבב-`components/Footer.tsx`: עברית/אנגלית, מייל, הסכמהנפרדתלאמסומנת, הסרהואישורבמייל. העיצובתואםלסגנוןהאתר.
- `app/api/newsletter/route.ts`: מסלולBrevoהוסר. GETמחזירenabled=false; POSTשומרבדיקותקלט/מקור/גוףעד2KBומחזיר503sender_not_connected. זו הכנהכבויה, לאחיבורפעיל.
- `app/newsletter-confirmed/page.tsx`: עמודnoindexאינפורמטיביעםנוסחמותנהבהגעהמקישורהאישור, ולאהוכחתהרשמהמעצםפתיחתו.
- `lib/i18n/dictionaries.ts`: פרטיותהאתרכוללתסקרוניוזלטרותאריך03.11.2026. ניסוחניהוזלטרעברמ-Brevoל-Senderמקומית. האפליקציהעצמהלאשונתה.
- ESLintממוקדו-tscעברולאחרהמעבר. בתצוגהמקומיתאומתSenderוטופסמושבת. נדרשאימותמחדשלאחרחיבוראמיתי, לאלשחזרבדיקותעברבלי שינוי.
- Preview `https://shiftsmart-landing-5cjz4020z-shiftsmart-landing.vercel.app` / `dpl_GG8MM4yFoTT2k77GWGiWePZad52v` READY אךקודםלמעברל-SenderועדייןמציגBrevoכבוי. מוגןVercelAuthentication; אינוקישורלהפצהציבורית. איןאישורפרסוםחי לשינויי3.11.

## המשך נדרש

1. לקרוא `docs/DOMAIN_EMAIL_SETUP.md`, `docs/SENDER_NEWSLETTER_SETUP.md`, ואתמצבהקודכיום. מסמךBREVOהוא היסטורי בלבד.
2. לבקש מהמשתמש אישור ממוקד לשינוי DNS המדויק: לעדכן את SPF הקיים `rec_bd85306d1998e6839a457590` לערך Sender שמיזג ImprovMX+Sender, להוסיף DKIM CNAME וליצור DMARC TXT. רק לאחר אישור, לבצע ולבדוק באמצעות Vercel scope `shiftsmart-landing`.
3. לבדוק סטטוס Professional trial (13 ימים שנותרו) והמעבר המתוכנן ל-Free Forever. אין כרטיס; לא לרכוש או לשדרג.
4. לפתור את חסימת Sender ל-DOI שמציינת שהשירות זמין רק לחשבונות מאומתים. כל עוד DOI לא ניתן להפעלה, אין לחבר/לפרסם טופס או להבטיח אישור במייל.
5. להמשיך מטיוטת הקבוצה והטופס הקיימים (`egG763`, `dBBk5J`), לא ליצור כפילויות. להשתמש רק בקוד ההטמעה האמיתי שתועד, ב-Preview ולא ב-Production. אין קמפיין, אוטומציה, ייבוא או שליחה לרשימה.
5. לעצב/להטמיעבהתאםלהאתרולבדוקב-Preview (נמעןמאושר, מיילאישור, לחיצהואישור, הסרהוכפילויות). ישלשמוררשימותiPhone-onlyוניווזלטרכללינפרדות; איןלייבאמייליסקרהאייפוןלניוזלטרללאהסכמהנפרדת.
6. איןטריגראוטומטילמשלוחבעקבותכלdeployשלתצוגה. היעדעדכוןרקכשגרסתאפליקציהאמיתיתיוצאת. איןקמפיין/שליחהלהרשימהבלי הוראהמפורשתלמשלוחהקונקרטי.
7. המשתמששקללמצטרפיםקוד/הנחתProאבללאנקבעהאחוזאומנגנון. לאלהבטיחהטבהבאתרולאלשנותPlayConsole.
8. לעדכן מסמכי readiness ומפת דרכים MD+HTML בסיום. מפת הדרכים הראשית היא עבודה מקבילה של צ׳אט האתר; לתאם מול המשתמש לפני עריכתה.

## גבולות

איןאמולטור/ADB/ARTEMIS; המשתמשאסרכיהואבשימושאחר. איןמשאביםבתשלום/שדרוג/כרטיס/שינויישירותDB/הגבלתקצב. איןהעברתסודותלצ׳אט/לוגיםאוNEXT_PUBLIC. איןפרסוםחי, GitpushאושינויGooglePlay. דומייןהאתרהחי `https://www.shift-smartapp.com`; production2.11 `dpl_CG3csB2hoeKsTST6LLKcdWsaiDiS`; rollbackישן `dpl_EC9szi2kgGUa171C7uzB9omegb2K`. שמורעלסלוגניםותמונותמאושרים.

סקרהאייפוןוהטבלההפרטיתשלונשאריםבטיפולצ׳אטהאתר; בקשתאישורנפרדתלרשומתQAומחיקתהעדייןממתינה. איןלפרשפתיחתצ׳אטחדשאוהרשמהלספקכאישורלבדיקההזו.

הצ׳אט הייעודי נוצר בהצלחה: Shift Smart — מייל הדומיין וניוזלטר Sender. threadId: 01a1a1e2-dc5b-7be3-b13b-209e6d974a14. host: local. מכאן ממשיכים את נושא המייל בצ׳אט זה בלבד.
