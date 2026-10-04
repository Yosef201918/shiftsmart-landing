import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import CookieConsent from "@/components/CookieConsent";
import GoogleTag from "@/components/GoogleTag";
import HtmlAttributesSync from "@/components/HtmlAttributesSync";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { PLAY_STORE_URL, SITE_URL } from "@/lib/links";

/*
 * גופן יחיד לכל האתר — Heebo (פונט משתנה, משקלים 100–900, עברית ולטינית מאותה
 * משפחה). בגרסה הקודמת היו שלושה גופנים (Heebo, Secular One, JetBrains Mono);
 * איחוד לגופן אחד מייצר מראה אחיד בעברית ובאנגלית, מחליף את הכותרות הכבדות
 * והמשחקיות של Secular One בהיררכיה שנבנית ממשקל ומגודל, וחוסך שתי בקשות
 * גופן. ללא ציון weight, next/font טוען את הקובץ המשתנה פעם אחת.
 */
const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  display: "swap",
});

/*
 * תוקן: תגית ה-og:image בפרודקשן הצביעה על כתובת דיפלוי ספציפית של Vercel
 * (למשל shiftsmart-landing-guvo2o6rp-....vercel.app) במקום על shift-
 * smartapp.com. הסיבה: NEXT_PUBLIC_SITE_URL לא היה מוגדר בפועל בסביבת
 * הפרודקשן, ולכן הנפילה האחורה השתמשה ב-VERCEL_URL — משתנה שוורסל מזריק
 * אוטומטית עם הכתובת הייחודית **של אותו דיפלוי בדיוק**, לא כתובת הפרודקשן
 * היציבה. התיקון: אם NEXT_PUBLIC_SITE_URL חסר וזו כן סביבת הפרודקשן
 * (VERCEL_ENV), נופלים אחורה ל-SITE_URL הקבוע מ-lib/links.ts (מקור האמת
 * היחיד לדומיין) במקום ל-VERCEL_URL — כך הפרודקשן תמיד מצביע על הדומיין
 * הנכון גם בלי תלות בהגדרת משתנה סביבה ב-Vercel. ב-preview deployments
 * (VERCEL_ENV="preview") עדיין נשמרת הנפילה ל-VERCEL_URL כדי שכל דיפלוי
 * preview ימשיך להצביע על עצמו, ו-localhost נשאר רק לפיתוח מקומי.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_ENV === "production"
    ? SITE_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

/*
 * המטא-דאטה שהשרת מגיש בתגובה הראשונית — ולכן גם מה שכרטיסי שיתוף
 * בוואטסאפ/פייסבוק יראו, וגם כותרת הלשונית בטעינה הראשונה — היא תמיד
 * בעברית, שפת ברירת המחדל של האתר.
 *
 * זה בלתי נמנע כל עוד ה-i18n מבוסס state בצד הלקוח בלי ניתוב אמיתי לפי
 * שפה (למשל /en נפרד מ-/): בוט שיתוף לא מריץ JavaScript ולא רואה שום
 * מצב לקוח, ולכן אינו יכול "לבחור" גרסת שפה — הוא רק קורא את תגי ה-head
 * שהשרת מחזיר לכתובת אחת ויחידה. Next.js אכן מזהה במפורש בוטים כאלה
 * (facebookexternalhit, WhatsApp וכו') ומגיש להם את המטא-דאטה הסטטית
 * הזו בתוך <head>, ללא שום אפשרות לגרסה חלופית.
 *
 * ניסינו גם לעדכן document.title בצד הלקוח בזמן ריצה עם שינוי שפה
 * (רכיב MetaSync שהוסר). זה עבד בבדיקה ישירה (לחיצה על המתג באותו
 * טעינה), אבל התגלה לא אמין בטעינה טרייה עם שפה שמורה: ל-Next.js יש
 * מנגנון פנימי משלו לניהול תגי metadata שמאפס תגובה ידנית ל-
 * document.title בדיוק במסלול של תיקון הידרציה (הרגע שבו useSyncExternalStore
 * עובר מ-getServerSnapshot ל-getSnapshot) — כלומר בדיוק ברגע הכי חשוב,
 * טעינה טרייה עם העדפת שפה שמורה. תכונה שעובדת בערך ב-50% מהמקרים
 * גרועה מתכונה שלא קיימת, ולכן היא הוסרה. הפתרון האמיתי היחיד לכותרת
 * דינמית אמינה וגם לתצוגה מקדימה נכונה בוואטסאפ הוא ניתוב אמיתי לפי
 * שפה (route נפרד ל-/en עם ה-metadata שלו) — שינוי ארכיטקטוני שלא
 * נכלל כאן.
 */
const defaultDictionary = dictionaries.he;

/* תמונת ה-OG שהמשתמש מניח ב-public/og-image.png — 1600×1600 בפועל (כווצה מ-2048×2048 בשלב 40 להורדת המשקל מ-6.3MB ל-930KB) */
const OG_IMAGE = {
  url: "/og-image.png",
  width: 1600,
  height: 1600,
  alt: defaultDictionary.meta.title,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  /* חדש: canonical יחסי ל-metadataBase; דפי /privacy ו-/terms דורסים אותו בעצמם כדי לא לרשת את דף הבית */
  alternates: { canonical: "/" },
  title: defaultDictionary.meta.title,
  description: defaultDictionary.meta.description,
  keywords: defaultDictionary.meta.keywords,
  openGraph: {
    title: defaultDictionary.meta.title,
    description: defaultDictionary.meta.ogDescription,
    locale: "he_IL",
    type: "website",
    images: [OG_IMAGE],
  },
  /* כרטיס תצוגה מקדימה ב-X/Twitter — summary_large_image מציג את התמונה במלואה */
  twitter: {
    card: "summary_large_image",
    title: defaultDictionary.meta.title,
    description: defaultDictionary.meta.ogDescription,
    images: [OG_IMAGE.url],
  },
  /* אימות בעלות על הדומיין עבור Google Play Developer Console */
  verification: {
    google: "ZtSkJ8cq55M33DeeZvYB6rpZAQ-kztLt5rD0Ktcr2nw",
  },
  /* שלב 32: עודכן ל-"ICON Chrome WED V1.png" — גרסה מתוקנת שמתקנת בעיות תצוגה שנותרו במובייל. הרווחים בשם הקובץ מקודדים כ-%20 */
  /* עודכן: הקובץ המקורי (1536×1536, 2.6MB) הוחלף בגרסאות ממוזערות באותו מראה; המקור נשאר ב-public/ ללא שינוי */
  icons: {
    icon: [
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
  /* שלב 30: מניפסט PWA — מאפשר התקנת האתר כאפליקציה */
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#070908",
  colorScheme: "dark",
};

/*
 * TODO: להוסיף aggregateRating בחזרה כשיהיו נתוני דירוג אמיתיים מ-Google Play.
 * הוסר כי ביקורות שנאספות בטפסי האתר עצמו אינן מקור אמין לתוצאות עשירות
 * של דירוג (ביקורות עצמיות), וגוגל עלולה להתייחס אליהן כבלתי מאומתות.
 */
const mobileApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: defaultDictionary.brand.name,
  description: defaultDictionary.meta.description,
  operatingSystem: "Android",
  applicationCategory: "BusinessApplication",
  url: PLAY_STORE_URL,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: defaultDictionary.brand.name,
  url: siteUrl,
  logo: `${siteUrl}/ICON.jpg`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} h-full antialiased`}
    >
      {/* שכבת הרקע (גרדיאנט עדין בלבד) יושבת ב-<Backdrop/> */}
      <body className="bg-void min-h-full flex flex-col">
        {/*
          JSON-LD בתוך <body>, לא בין <html> ל-<body>: ניסיון קודם למקם את
          ה-<script> שם גרם לשגיאת hydration אמיתית ("Cannot render a sync
          or defer <script> outside the main document") — <script> חייב
          להיות ילד של <head> או <body> בתוך HTML תקין, לא ילד ישיר של
          <html>. זה בדיוק התבנית המתועדת ב-node_modules/next/dist/docs/
          .../json-ld.md. ה-`<`\` מונע הזרקת HTML/XSS דרך שדות שמגיעים
          מהמילון (למרות ששניהם כאן קבועים סטטיים, לא קלט משתמש).
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(mobileApplicationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {/*
          framer-motion מרנדר את אלמנטי הכניסה עם opacity:0 בצד השרת ומנפיש אותם
          בצד הלקוח. בלי JavaScript האנימציה לא תרוץ והתוכן יישאר בלתי נראה,
          ולכן כאן מאלצים אותו להיות גלוי מיד. הכלל חל רק כששפת התסריט מושבתת.
        */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                '[style*="opacity:0"]{opacity:1!important;transform:none!important}',
            }}
          />
        </noscript>

        <LanguageProvider>
          <HtmlAttributesSync />
          {children}
          {/* גלובלי בכל דף (כולל /privacy) — לא רק בדף הבית */}
          <CookieConsent />
        </LanguageProvider>

        {/* Vercel Web Analytics — נטען רק בפרודקשן ואינו מרנדר DOM */}
        <Analytics />
        {/* Google tag — נטען רק אחרי הסכמת עוגיות, ראו components/GoogleTag.tsx */}
        <GoogleTag />
      </body>
    </html>
  );
}
