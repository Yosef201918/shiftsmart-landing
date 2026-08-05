"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

import { BETA_GROUP_URL, PLAY_STORE_URL, SITE_URL } from "@/lib/links";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type ShareButtonProps = {
  className?: string;
};

/*
 * שלב 21 — כפתור שיתוף חכם. במובייל (רוב הדפדפנים התומכים ב-Web Share
 * API) נפתח דיאלוג השיתוף המקורי של המערכת עם הטקסט המוכן מראש; בדסקטופ,
 * שבו navigator.share כמעט אף פעם לא קיים, מעתיקים את אותו טקסט ללוח
 * ומראים אישור זמני על גבי הכפתור עצמו — בלי שום התראת דפדפן חוסמת.
 */
export default function ShareButton({ className = "" }: ShareButtonProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  // שלב 24: כתובת האתר עצמה חייבת להופיע בטקסט כדי שוואטסאפ ימשוך את תמונת ה-OG
  const shareText = t.share.buildText(SITE_URL, BETA_GROUP_URL, PLAY_STORE_URL);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: t.share.title, text: shareText });
      } catch {
        // המשתמש סגר את דיאלוג השיתוף המקורי — לא כשל אמיתי, אין מה לטפל
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      // חוזרים למצב הרגיל אחרי 2.5 שניות כדי שהכפתור יהיה שמיש שוב
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // כשל בהעתקה (הרשאות/דפדפן ישן) — נכשל בשקט, אין ל-API הזה fallback נוסף
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`panel inline-flex h-11 w-fit shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-sm text-chalk transition duration-300 hover:-translate-y-0.5 hover:border-neon-deep hover:text-neon ${className}`}
    >
      {copied ? (
        <Check className="size-4 shrink-0 text-neon" strokeWidth={2} />
      ) : (
        <Share2 className="size-4 shrink-0 text-neon" strokeWidth={1.9} />
      )}
      {copied ? t.share.copiedLabel : t.share.buttonLabel}
    </button>
  );
}
