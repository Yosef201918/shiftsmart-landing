import type { Metadata } from "next";

import PrivacyPolicyContent from "@/components/PrivacyPolicyContent";
import { dictionaries } from "@/lib/i18n/dictionaries";

/* אותה סיבה בדיוק כמו ב-app/layout.tsx: metadata סטטית תמיד בעברית, ראו ההסבר המפורט שם */
const defaultDictionary = dictionaries.he;

export const metadata: Metadata = {
  title: defaultDictionary.privacy.metaTitle,
  description: defaultDictionary.privacy.metaDescription,
};

/*
 * דף מדיניות פרטיות עצמאי — נדרש לקישור ישיר מתוך חנות Google Play
 * (למשל /privacy). הדף יורש את app/layout.tsx (גופנים, רקע כהה, dir=rtl),
 * ולכן לא צריך לשכפל כאן שום עטיפת html/body. זהו Server Component רגיל
 * (בלי "use client") כי הוא רק מייצא metadata ומרנדר את התוכן בפועל,
 * שעבר ל-PrivacyPolicyContent (רכיב לקוח) כדי שיוכל להגיב למתג השפה דרך
 * useLanguage() — "use client" ו-export const metadata לא יכולים לחיות
 * באותו קובץ ב-Next.js.
 */
export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />;
}
