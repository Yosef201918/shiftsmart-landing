/** מגבלות אורך קבועות לשדות הטקסט בטפסי האתר (ביקורות והצעות פיצ'ר) */
export const FORM_LIMITS = {
  name: 60,
  review: 500,
  feature: 1000,
} as const;

/* זמן המתנה מינימלי בין שתי שליחות מאותו טופס באותו דפדפן */
const COOLDOWN_MS = 30_000;

/*
 * הגנה בצד הלקוח בלבד מפני שליחות חוזרות מהירות: תאריך השליחה האחרונה נשמר
 * ב-sessionStorage לפי מפתח לכל טופס, כך שרענון דף לא מאפס את ההמתנה.
 * אחסון חסום (מצב פרטי) לא חוסם את המשתמש — במקרה כזה פשוט אין המתנה.
 */
export function isCoolingDown(key: string): boolean {
  try {
    const last = Number(window.sessionStorage.getItem(key));
    return Number.isFinite(last) && Date.now() - last < COOLDOWN_MS;
  } catch {
    return false;
  }
}

export function markSubmitted(key: string): void {
  try {
    window.sessionStorage.setItem(key, String(Date.now()));
  } catch {
    /* אחסון חסום — ממשיכים בלי המתנה */
  }
}
