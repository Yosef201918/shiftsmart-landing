"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useLanguage } from "@/lib/i18n/LanguageContext";

/**
 * מסנכרן גם את `document.title` לשפה הנוכחית (ה-metadata הסטטי תמיד בעברית).
 * מסנכרן את `lang` ו-`dir` על אלמנט ה-<html> עם השפה הנוכחית.
 *
 * ה-<html> נמצא בקומפוננטת שרת (app/layout.tsx) ולכן לא יכול לקרוא ל-hook
 * הזה ישירות. קומפוננטת לקוח נפרדת, בלי פלט ויזואלי משלה, היא הדרך הסטנדרטית
 * להשפיע על תגית שנמצאת מחוץ לעץ שה-Provider עוטף.
 */
export default function HtmlAttributesSync() {
  const { lang, dir, t } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    // בלי זה קורא מסך ולשונית הדפדפן מציגים כותרת בעברית גם בדף באנגלית
    document.title =
      pathname === "/privacy"
        ? t.privacy.metaTitle
        : pathname === "/terms"
          ? t.terms.metaTitle
          : t.meta.title;
  }, [lang, dir, pathname, t]);

  return null;
}
