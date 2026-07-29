"use client";

import { useEffect } from "react";

import { useLanguage } from "@/lib/i18n/LanguageContext";

/**
 * מסנכרן את `lang` ו-`dir` על אלמנט ה-<html> עם השפה הנוכחית.
 *
 * ה-<html> נמצא בקומפוננטת שרת (app/layout.tsx) ולכן לא יכול לקרוא ל-hook
 * הזה ישירות. קומפוננטת לקוח נפרדת, בלי פלט ויזואלי משלה, היא הדרך הסטנדרטית
 * להשפיע על תגית שנמצאת מחוץ לעץ שה-Provider עוטף.
 */
export default function HtmlAttributesSync() {
  const { lang, dir } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  return null;
}
