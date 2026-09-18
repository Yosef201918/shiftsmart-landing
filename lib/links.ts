/**
 * מקור אמת יחיד לכל הקישורים החיצוניים של הדף.
 * שינוי כאן מתעדכן אוטומטית גם ב-Hero וגם ב-Footer.
 */

/* כתובת האתר עצמו — נדרשת בטקסט השיתוף כדי שוואטסאפ יוכל למשוך את תמונת ה-OG */
export const SITE_URL = "https://www.shift-smartapp.com";

export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.yosefgabaydev.shiftsmart";

export const CONTACT_EMAIL = "yoseffstor@gmail.com";

export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

export const FACEBOOK_URL =
  "https://www.facebook.com/profile.php?id=61593217317936";

export const INSTAGRAM_URL = "https://www.instagram.com/shiftsmart.app/";

export const TIKTOK_URL = "https://www.tiktok.com/@shiftsmart.app";

/** מאפייני אבטחה קבועים לכל קישור שנפתח בלשונית חדשה */
export const EXTERNAL_LINK_PROPS = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

/* Google tag (gtag.js) Measurement ID — נטען רק אחרי הסכמת עוגיות, ראו components/GoogleTag.tsx */
export const GA_MEASUREMENT_ID = "G-Q1YX92N0LQ";
