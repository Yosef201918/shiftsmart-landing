import type { Metadata, Viewport } from "next";
import { Heebo, JetBrains_Mono, Secular_One } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Shift Smart — ניהול משמרות ושעון נוכחות חכם",
  description:
    "Shift Smart הוא שעון נוכחות חכם שסופר עבורכם את השעות, מסדר את המשמרות ומפיק דוח מדויק בלחיצה אחת. הצטרפו לבטא הסגורה.",
  keywords: [
    "ניהול משמרות",
    "שעון נוכחות",
    "מעקב שעות עבודה",
    "דוח שעות",
    "Shift Smart",
  ],
  openGraph: {
    title: "Shift Smart — ניהול משמרות ושעון נוכחות חכם",
    description:
      "שעון נוכחות חכם שסופר עבורכם את השעות, מסדר את המשמרות ומפיק דוח מדויק בלחיצה אחת.",
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
        {children}

        {/* Vercel Web Analytics — נטען רק בפרודקשן ואינו מרנדר DOM */}
        <Analytics />
      </body>
    </html>
  );
}
