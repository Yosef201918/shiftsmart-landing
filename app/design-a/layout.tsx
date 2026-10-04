import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans_Hebrew } from "next/font/google";

/*
 * כיוון A — "חדר בקרה". זוג גופנים אחד משפחה: IBM Plex Sans Hebrew לכותרות
 * ולגוף (אותיות עבריות מרובעות ומהונדסות, שמהדהדות את הספרות הדיגיטליות של
 * טיימר המשמרת באפליקציה) ו-IBM Plex Mono לנתונים בלבד: ספרות, שעות וסכומים.
 * הגופנים נטענים רק במסלול הזה ולכן אינם משפיעים על שאר האתר.
 */
const plexSans = IBM_Plex_Sans_Hebrew({
  variable: "--nf-da-sans",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--nf-da-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/* תצוגה מקדימה זמנית — לא לאנדקס */
export const metadata: Metadata = {
  title: "Shift Smart — Design A (preview)",
  robots: { index: false, follow: false },
};

export default function DesignALayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${plexSans.variable} ${plexMono.variable} min-h-screen bg-da-bg font-da-sans text-da-text`}
    >
      {children}
    </div>
  );
}
