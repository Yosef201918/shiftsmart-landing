/**
 * מקור אמת יחיד לכל הקישורים החיצוניים של הדף.
 * שינוי כאן מתעדכן אוטומטית גם ב-Hero וגם ב-Footer.
 */

export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.yosefgabaydev.shiftsmart";

export const BETA_GROUP_URL = "https://groups.google.com/g/shiftsmart-testers";

export const CONTACT_EMAIL = "yoseffstor@gmail.com";

export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

export const INSTAGRAM_URL = "https://www.instagram.com/shiftsmart.app/";

export const TIKTOK_URL = "https://www.tiktok.com/@shiftsmart.app";

/** מאפייני אבטחה קבועים לכל קישור שנפתח בלשונית חדשה */
export const EXTERNAL_LINK_PROPS = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
