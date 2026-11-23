/** מגבלות אורך קבועות לשדות הטקסט בטפסי האתר (ביקורות והצעות פיצ'ר) */
export const FORM_LIMITS = {
  name: 60,
  review: 500,
  feature: 1000,
} as const;

// רווחים, תווי בקרה ותווי כיווניות לבדם אינם שם או תוכן.
// הבדיקה אינה מסירה תווי כיווניות מתוך טקסט תקין בעברית ובשפות אחרות.
export function isValidFormText(value: string, maxLength: number): boolean {
  const text = value.trim();
  return text.length <= maxLength && text.replace(
    /[\u0000-\u0020\u007f-\u00a0\u00ad\u034f\u061c\u1680\u180e\u2000-\u200f\u2028-\u202f\u205f\u2060-\u206f\u3000\ufeff]/gu,
    "",
  ).length > 0;
}

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
