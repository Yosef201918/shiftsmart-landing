import type { Metadata, Viewport } from "next";
import { Heebo, JetBrains_Mono, Secular_One } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import HtmlAttributesSync from "@/components/HtmlAttributesSync";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { dictionaries } from "@/lib/i18n/dictionaries";

/* גופן גוף — Heebo תומך בעברית ובעל טווח משקלים מלא */
const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  display: "swap",
});

/* גופן כותרות — Secular One, גיאומטרי ובעל אופי */
const secularOne = Secular_One({
  variable: "--font-secular-one",
  subsets: ["hebrew", "latin"],
  weight: "400",
  display: "swap",
});

/* גופן מונוספייס — לתוויות ולמספרים הטכניים בלוח הנתונים */
const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

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

export const metadata: Metadata = {
  title: defaultDictionary.meta.title,
  description: defaultDictionary.meta.description,
  keywords: defaultDictionary.meta.keywords,
  openGraph: {
    title: defaultDictionary.meta.title,
    description: defaultDictionary.meta.ogDescription,
    locale: "he_IL",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#03060b",
  colorScheme: "dark",
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
      className={`${heebo.variable} ${secularOne.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      {/*
        תמונת הרקע עברה לשכבה ייעודית ב-<Backdrop/> במקום background-attachment: fixed.
        הסיבה: Safari ב-iOS לא תומך ב-fixed ושובר את הגלילה. אלמנט position:fixed
        משיג את אותו אפקט "רקע נעוץ" בכל הדפדפנים, וגם מאפשר אופטימיזציה של התמונה.
      */}
      <body className="bg-void min-h-full flex flex-col">
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
        </LanguageProvider>

        {/* Vercel Web Analytics — נטען רק בפרודקשן ואינו מרנדר DOM */}
        <Analytics />
      </body>
    </html>
  );
}
