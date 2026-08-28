# PROJECT_MEMORY.md — Shift Smart Landing Page

עדכון אחרון: 2026-08-17 (אחרי commit `4ca36bf`)

## 1. סקירת הפרויקט וה-Stack הטכני

**מה זה:** דף נחיתה שיווקי לאפליקציית "Shift Smart" — אפליקציית שעון נוכחות וניהול משמרות/שכר לאנדרואיד, כרגע בבטא **פתוחה** דרך Google Play (עודכן משלב 43 — בעבר הייתה בטא סגורה עם קבוצת בודקים; הזרימה הזו הוסרה לגמרי מהאתר). הדף מיועד להוריד את האפליקציה ישירות, בזמן שהאפליקציה עצמה (offline-first, בלי שרת) נמצאת בפרויקט נפרד ולא כאן.

**Stack:**
- Next.js 16.2.12 (App Router, Turbopack) + TypeScript + React 19
- Tailwind CSS v4 (קונפיגורציה ב-`app/globals.css` דרך `@theme`, לא `tailwind.config`)
- Framer Motion — כל אנימציות הגלילה/מודאלים/טוסטים באתר (ראו כלל ביצועים למטה)
- Supabase (`@supabase/supabase-js`) — Backend לביקורות ולהצעות פיצ'רים
- `embla-carousel-react` — קרוסלת הגלריה
- `lucide-react` v1 — כל האייקונים (כולל אייקוני מותגים מותאמים ידנית ל-Facebook/Instagram/TikTok כי v1 הסירה אותם — ראו `components/SocialIcons.tsx`)
- `@vercel/analytics`
- דיפלוי: Vercel, אוטומטי בכל push ל-`main` ב-GitHub (`Yosef201918/shiftsmart-landing`), אתר חי ב-`https://shiftsmart-landing.vercel.app`

**ארכיטקטורת i18n:** בלי ניתוב אמיתי (אין `/en`) — הכל state בצד לקוח דרך `lib/i18n/LanguageContext.tsx` + מילון יחיד `lib/i18n/dictionaries.ts` (עברית=ברירת מחדל/RTL, אנגלית=LTR). המשמעות: metadata סטטי לבוטים (וואטסאפ/פייסבוק) תמיד בעברית — זה מגבלה ידועה ומתועדת ב-`app/layout.tsx`.

**עיצוב:** "לוח מכשירים" כהה עם זכוכית מטושטשת (glassmorphism) וניאון ירוק. Design tokens ב-`app/globals.css` (`--color-void`, `--color-neon` וכו').

## 2. מצב נוכחי — מה בנוי ופועל

כל הפיצ'רים הבאים **בנויים, נבדקו בדפדפן חי, ו-pushed ל-main**:

- **`app/layout.tsx`** — metadata מלא: title/description דו-לשוני, OG+Twitter images (`/og-image.png`, דורש `metadataBase`!), Google Site Verification tag, `viewport`.
- **`components/Hero.tsx`** — כותרת → כפתור פעולה יחיד (הורדה מ-Google Play; כפתור "הצטרפות לבטא הסגורה" הוסר בשלב 43 יחד עם `BETA_GROUP_URL`) → `<BetaSteps/>` (מדריך 3 שלבים קומפקטי, **חייב** להישאר גלוי בלי גלילה במובייל 375×812 — זה נבדק ונשמר בקפידה כמה פעמים, אל תוסיפו תוכן בין הכפתורים למדריך בלי למדוד מחדש!) → אמון/אזהרה.
- **`components/AppPoster.tsx`** — פוסטר מותג (`/ICON.jpg`) מיד אחרי ה-Hero, בלי מסגרת/panel — רק rounded+shadow.
- **`components/WhatsNew.tsx`**, **`Features.tsx`** (12 כרטיסי Bento), **`PhoneShowcase.tsx`**, **`AppCarousel.tsx`** (גלריית 6 צילומים), **`Roadmap.tsx`**, **`Faq.tsx`** (6 שאלות, אקורדיון `grid-template-rows` ללא framer-motion לגובה).
- **`components/Reviews.tsx`** — מחובר ל-Supabase אמיתי: שולף ביקורות `status='approved'` בלבד, **Realtime subscription** (`postgres_changes`) עם ניקוי (`removeChannel`) ב-unmount, מודאל כתיבת ביקורת עם דירוג כוכבים אינטראקטיבי שמכניס שורה חדשה (`status` ברירת מחדל `pending` מהטבלה עצמה).
- **`components/FeatureRequest.tsx`** — מחובר ל-Supabase (טבלת `feature_requests`, עמודות `name`+`feature_text`).
- **`components/ShareButton.tsx`** — Web Share API + fallback להעתקה ללוח; טקסט השיתוף כולל את `SITE_URL` (כדי שוואטסאפ ימשוך OG image).
- **`components/Footer.tsx`** — קישורי Play Store/מייל/**מדיניות פרטיות** (`/privacy`)/**תנאי שימוש** (`/terms`), רשתות חברתיות (Facebook/Instagram/TikTok — כולן פעילות עם URLs אמיתיים). קישור קבוצת הבודקים הוסר בשלב 43.
- **`components/StickyCta.tsx`** — כפתור צף, נעלם כשהפוטר בתצוגה (IntersectionObserver כפול).
- **`app/privacy/page.tsx`** — דף מדיניות פרטיות עצמאי, Server Component, יורש את ה-layout הראשי.
- **`lib/supabase.ts`** — קליינט יחיד; **לא זורק חריגה** אם משתני סביבה חסרים (במקום זאת `console.error` + placeholder URL תחבירי) כדי לא להפיל את כל האתר.

**אין FAB לפידבק פרטי** — הוסר בשלב 17, הוחלף במקטע Reviews הציבורי.

## 3. משימות פתוחות / דברים לזכור

- **RLS ב-Supabase**: מדיניות ה-INSERT/SELECT על `reviews` ו-`feature_requests` כבר הוגדרו ועובדות (אומת ישירות מול ה-API). אם ביקורת/הצעה חדשה נכשלת בעתיד — זה כמעט תמיד RLS, לא קוד. תמיד לבדוק עם `curl`/`fetch` ישיר ל-REST API לפני שמניחים שהבאג בקוד.
- **משתני סביבה ב-Vercel**: `.env.local` מקומי תקין (`NEXT_PUBLIC_SUPABASE_URL` בלי `/rest/v1/` בסוף — זו הייתה טעות אמיתית שתוקנה בעבר, לבדוק שלא חוזרת). לא ידוע בוודאות אם אותם ערכים מוגדרים נכון גם ב-Vercel Dashboard — לא לי גישה לבדוק שם.
- **תמונת OG לאנגלית**: אין נכס ייעודי — `mockupSrc`/`phoneShowcase` לאנגלית משתמשים בצילום מסך ראשון כתחליף. `ICON.jpg` גם הוא טקסט עברי בלבד (אין גרסת פוסטר אנגלית).
- **Webhook Vercel**: היה בעבר חשד לבעיית webhook בין GitHub ל-Vercel (commit ריק נשלח כדי "לעורר" דיפלוי) — נראה שנפתר, אך אם דיפלוי לא מתעדכן שוב, זו הכתובת הראשונה לבדוק (לא בעיית git — `git ls-remote` תמיד אימת שה-push הגיע בפועל ל-GitHub).
- **לא נדרש שינוי קוד** לאנימציות גלילה — framer-motion כבר בשימוש בכל מקום, מוגבל ל-`transform`/`opacity` בלבד מאז שלב 13. אל תתקינו ספריית אנימציה נוספת.
- אין כרגע משימה פתוחה/באג ידוע שלא טופל — כל 28 השלבים עד כה הסתיימו ונדחפו בהצלחה.

## 4. כללי פיתוח מחייבים (CRITICAL)

- **לעולם לא placeholders** (כמו `// rest of the code here`) — תמיד קוד מלא, שלם, מוכן להדבקה, מההתחלה ועד הסוף.
- **להיצמד ל-100% למבנה ולהיגיון הקיימים** — לא לאלתר, לא "להמציא", לא להוסיף ספריות חיצוניות אלא אם באמת הכרחי. אם חסר מידע — לעצור ולשאול.
- **קוד נקי, ביצועים קיצוניים** — בלי לולאות כבדות, בלי דליפות זיכרון (תמיד לנקות `useEffect`/subscriptions/observers).
- **בדיבוג**: קודם להסביר בשורה-שתיים את הסיבה השורשית לתקלה, ורק אז לתת את התיקון — כדי שהמשתמש ילמד מזה.
- **בעדכון קבצים קיימים**: להוסיף הערות רק ליד השורות שהשתנו, כדי שקל יהיה לזהות את ההבדל.
- תקשורת ישירה עם המשתמש — עברית בלבד (CLAUDE.md).
- לפני `npm run build`/commit — לוודא build נקי ולבדוק בדפדפן חי (לא רק להניח).
