const STORAGE_KEY = "shiftsmart-cookie-consent";

export type ConsentValue = "accepted" | "rejected";

/*
 * חנות הסכמת עוגיות זעירה מחוץ ל-React, באותו דפדוס useSyncExternalStore
 * בדיוק כמו lib/i18n/LanguageContext.tsx — מודול-level state + Set של
 * listeners + subscribe/getSnapshot/getServerSnapshot/commit. הוצא מתוך
 * CookieConsent.tsx (שהחזיק את זה ב-useState מקומי) כדי ש-GoogleTag.tsx
 * יוכל להאזין לאותה הסכמה בלי prop drilling ובלי context נוסף.
 */
let currentConsent: ConsentValue | null = null;
const listeners = new Set<() => void>();

function readStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "accepted" || stored === "rejected" ? stored : null;
}

/* מאותחל פעם אחת בזמן טעינת המודול בדפדפן, לפני שכל קומפוננטה מתחילה לרנדר */
if (typeof window !== "undefined") {
  currentConsent = readStoredConsent();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): ConsentValue | null {
  return currentConsent;
}

export function getServerSnapshot(): ConsentValue | null {
  return null;
}

export function commitConsent(next: ConsentValue) {
  currentConsent = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* מצב פרטי או אחסון חסום — ההסכמה עדיין מתעדכנת בזיכרון להמשך הסשן */
  }
  for (const listener of listeners) listener();
}
