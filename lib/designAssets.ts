import type { Lang } from "@/lib/i18n/dictionaries";

/*
 * נכסי המוצר לתצוגות הפתיחה של כיווני העיצוב. מסכי האפליקציה האמיתיים נחתכו
 * מתוך תמונות השיווק ב-public/ באמצעות scripts/crop-screens.mjs ונשמרים ב-
 * public/screens/. כל מסך מוצג בשפה שלו, ומוצג בתוך שלדת מכשיר שנבנית ב-CSS.
 *
 * summaryTile מגדיר "חלון" שחותך ממסך הסיכום את כרטיס סך הרווחות בלבד
 * (הסכום הגדול, השעות והמשמרות) ומציג אותו כווידג'ט עצמאי: aspect הוא יחס
 * החלון (רוחב / גובה) ו-offsetPct הוא כמה מגובה התמונה נחתך מלמעלה.
 */
export type ScreenAsset = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

type LanguageScreens = {
  home: ScreenAsset;
  summary: ScreenAsset;
  calendar: ScreenAsset;
  summaryTile: { aspect: string; offsetPct: number };
};

export const HERO_SCREENS: Record<Lang, LanguageScreens> = {
  he: {
    home: {
      src: "/screens/he-home.webp",
      width: 402,
      height: 848,
      alt: "מסך שעון הנוכחות באפליקציה: משמרת פעילה עם טיימר רץ, צבירה במשמרת ותעריף לשעה",
    },
    summary: {
      src: "/screens/he-summary.webp",
      width: 418,
      height: 766,
      alt: "מסך הסיכום החודשי באפליקציה: סך הרווחות, שעות העבודה והיעד החודשי",
    },
    calendar: {
      src: "/screens/he-calendar.webp",
      width: 466,
      height: 940,
      alt: "מסך היומן באפליקציה: תכנון משמרות לפי ימים בחודש",
    },
    summaryTile: { aspect: "418 / 224", offsetPct: 20.9 },
  },
  en: {
    home: {
      src: "/screens/en-home.webp",
      width: 566,
      height: 1160,
      alt: "The Time Clock screen: an active shift with a running timer, shift earnings and hourly rate",
    },
    summary: {
      src: "/screens/en-summary.webp",
      width: 566,
      height: 1160,
      alt: "The Monthly Summary screen: total earnings, hours worked and the monthly goal",
    },
    calendar: {
      src: "/screens/en-calendar.webp",
      width: 566,
      height: 1160,
      alt: "The Calendar screen: planned shifts across the month",
    },
    summaryTile: { aspect: "566 / 290", offsetPct: 16 },
  },
};
