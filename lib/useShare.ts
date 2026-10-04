"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { SITE_URL } from "@/lib/links";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/* נתיב תמונת השיתוף הייעודית ב-public/ (יש רווח בשם הקובץ, לכן %20 בנתיב ה-fetch) */
const SHARE_IMAGE_PATH = "/Sharing%20image.png";
/* שם קובץ אמיתי לתמונה המשותפת — נדרש כדי שאפליקציות היעד (וואטסאפ וכו') יזהו אותה כתמונה תקינה */
const SHARE_IMAGE_FILENAME = "shiftsmart.png";
/* כמה זמן מוצג אישור ההעתקה לפני שהכפתור חוזר למצבו הרגיל */
const COPIED_RESET_MS = 2500;

/*
 * לוגיקת השיתוף, מופרדת מהמראה כדי שכל כפתור שיתוף באתר (ושני כיווני העיצוב
 * החדשים) ישתמשו באותה התנהגות בדיוק. במובייל (רוב הדפדפנים התומכים ב-Web
 * Share API) נפתח דיאלוג השיתוף המקורי של המערכת עם הטקסט המוכן מראש; בדסקטופ,
 * שבו navigator.share כמעט אף פעם לא קיים, מעתיקים את אותו טקסט ללוח ומחזירים
 * copied=true לזמן קצר — בלי שום התראת דפדפן חוסמת.
 *
 * שלב 41: מנסים לצרף גם תמונה ייעודית כקובץ אמיתי, לא רק טקסט.
 * navigator.canShare({ files }) חייב להיבדק במפורש לפני שמעבירים files —
 * דפדפן שתומך ב-navigator.share אך לא ביכולת קבצים עדיין יעבוד, רק בלי הקובץ.
 */
export function useShare() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* מניעת עדכון state אחרי שהרכיב הוסר */
  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  // שלב 24: כתובת האתר עצמה חייבת להופיע בטקסט כדי שוואטסאפ ימשוך את תמונת ה-OG
  const shareText = t.share.buildText(SITE_URL);

  /*
   * מביא את תמונת ה-OG הקיימת מהשרת עצמו (fetch יחסי) וממיר אותה ל-File.
   * מוחזר null בכל כשל כדי שהקורא ייפול חזרה לשיתוף טקסט בלבד בלי לזרוק שגיאה.
   */
  const getShareImageFile = async (): Promise<File | null> => {
    try {
      const response = await fetch(SHARE_IMAGE_PATH);
      if (!response.ok) return null;

      const blob = await response.blob();
      if (blob.size === 0) return null;

      return new File([blob], SHARE_IMAGE_FILENAME, { type: "image/png" });
    } catch {
      return null;
    }
  };

  const share = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      const imageFile = await getShareImageFile();
      const canShareWithImage =
        imageFile !== null &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [imageFile] });

      try {
        await navigator.share(
          canShareWithImage
            ? { title: t.share.title, text: shareText, files: [imageFile as File] }
            : { title: t.share.title, text: shareText },
        );
      } catch {
        // המשתמש סגר את דיאלוג השיתוף המקורי — לא כשל אמיתי, אין מה לטפל
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {
      // כשל בהעתקה (הרשאות/דפדפן ישן) — נכשל בשקט, אין ל-API הזה fallback נוסף
    }
    // getShareImageFile יציב (אינו תלוי state), לכן אינו נדרש כתלות
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareText, t.share.title]);

  return {
    copied,
    share,
    label: copied ? t.share.copiedLabel : t.share.buttonLabel,
  };
}
