import type { Metadata } from "next";
import { Assistant, Frank_Ruhl_Libre } from "next/font/google";

/*
 * כיוון B — "הסמל". זוג גופנים בניגוד מכוון: Frank Ruhl Libre, גופן עם
 * סריפים וחתך עברי קלאסי, בשקלי כבד ככותרת — משדר סמכות ואמינות, בדיוק מה
 * שמחפש מאבטח או עובד משמרות שמפקיד את השעות והשכר שלו באפליקציה. לצידו
 * Assistant, סנס נקי וקריא, לגוף הטקסט והתוויות. הגופנים נטענים רק במסלול
 * הזה ולכן אינם משפיעים על שאר האתר.
 */
const frankRuhl = Frank_Ruhl_Libre({
  variable: "--nf-db-display",
  subsets: ["hebrew", "latin"],
  weight: ["500", "700", "900"],
  display: "swap",
});

const assistant = Assistant({
  variable: "--nf-db-sans",
  subsets: ["hebrew", "latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

/* תצוגה מקדימה זמנית — לא לאנדקס */
export const metadata: Metadata = {
  title: "Shift Smart — Design B (preview)",
  robots: { index: false, follow: false },
};

export default function DesignBLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${frankRuhl.variable} ${assistant.variable} min-h-screen bg-db-bg font-db-sans text-db-ivory`}
    >
      {children}
    </div>
  );
}
