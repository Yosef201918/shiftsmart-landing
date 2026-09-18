import type { Metadata } from "next";

import TermsOfServiceContent from "@/components/TermsOfServiceContent";
import { dictionaries } from "@/lib/i18n/dictionaries";

/* אותה סיבה בדיוק כמו ב-app/layout.tsx: metadata סטטית תמיד בעברית, ראו ההסבר המפורט שם */
const defaultDictionary = dictionaries.he;

export const metadata: Metadata = {
  title: defaultDictionary.terms.metaTitle,
  description: defaultDictionary.terms.metaDescription,
};

/*
 * דף תנאי שימוש עצמאי — אותו מבנה בדיוק כמו app/privacy/page.tsx: Server
 * Component שרק מייצא metadata ומרנדר את התוכן בפועל, שעבר ל-
 * TermsOfServiceContent (רכיב לקוח) כדי שיוכל להגיב למתג השפה דרך
 * useLanguage().
 */
export default function TermsOfServicePage() {
  return <TermsOfServiceContent />;
}
