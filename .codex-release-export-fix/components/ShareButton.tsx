"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Share2 } from "lucide-react";

import { SITE_URL } from "@/lib/links";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type ShareButtonProps = {
  className?: string;
};

/* שם קובץ אמיתי לתמונה המשותפת — נדרש כדי שאפליקציות היעד (וואטסאפ וכו') יזהו אותה כתמונה תקינה */
const SHARE_IMAGE_FILENAME = "shiftsmart.png";

/*
 * שלב 21 — כפתור שיתוף חכם. במובייל (רוב הדפדפנים התומכים ב-Web Share
 * API) נפתח דיאלוג השיתוף המקורי של המערכת עם הטקסט המוכן מראש; בדסקטופ,
 * שבו navigator.share כמעט אף פעם לא קיים, מעתיקים את אותו טקסט ללוח
 * ומראים אישור זמני על גבי הכפתור עצמו — בלי שום התראת דפדפן חוסמת.
 *
 * שלב 41: מנסים לצרף גם תמונה ייעודית לשיתוף (public/Sharing image.png)
 * כקובץ אמיתי, לא רק טקסט. navigator.share תומך בכך רק חלקית ורק במובייל,
 * ולכן navigator.canShare({ files }) חייב להיבדק במפורש לפני שמעבירים
 * files — דפדפן שתומך ב-navigator.share אך לא ביכולת קבצים (או שהקובץ
 * מסוג לא נתמך) עדיין יעבוד, רק בלי הקובץ המצורף.
 */
export default function ShareButton({ className = "" }: ShareButtonProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [manualCopy, setManualCopy] = useState(false);
  const sharingLock = useRef(false);
  const imageRef = useRef<{ path: string; file: File } | null>(null);
  const imagePath = encodeURI(t.appPoster.imageSrc);

  // שלב 24: כתובת האתר עצמה חייבת להופיע בטקסט כדי שוואטסאפ ימשוך את תמונת ה-OG
  const shareText = t.share.buildText(SITE_URL);

  // מכינים את התמונה מראש: המתנה לרשת בלחיצה עלולה לבטל את הרשאת השיתוף הזמנית.
  useEffect(() => {
    imageRef.current = null;
    if (typeof navigator.share !== "function") return;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    void (async () => {
      try {
        const response = await fetch(imagePath, { signal: controller.signal });
        if (!response.ok) return;
        const blob = await response.blob();
        if (!controller.signal.aborted && blob.size > 0) {
          imageRef.current = { path: imagePath, file: new File([blob], SHARE_IMAGE_FILENAME, { type: "image/png" }) };
        }
      } catch {
        // תמונה חסרה אינה חוסמת שיתוף של הקישור והטקסט.
      } finally {
        clearTimeout(timeout);
      }
    })();
    return () => { controller.abort(); clearTimeout(timeout); };
  }, [imagePath]);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(timeout);
  }, [copied]);

  const copyShareText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setManualCopy(false);
    } catch {
      // חסימת הלוח מוצגת למשתמש עם טקסט שאפשר להעתיק ידנית.
      setManualCopy(true);
    }
  };

  const handleShare = async () => {
    if (sharingLock.current) return;
    sharingLock.current = true;
    setIsSharing(true);
    setManualCopy(false);
    try {
      if (typeof navigator.share === "function") {
        const imageFile = imageRef.current?.path === imagePath ? imageRef.current.file : null;
        const canShareWithImage = imageFile !== null && typeof navigator.canShare === "function" && navigator.canShare({ files: [imageFile] });
        // הקריאה מתבצעת בתוך פעולת המשתמש, ללא await שקודם לה.
        await navigator.share(canShareWithImage
          ? { title: t.share.title, text: shareText, files: [imageFile] }
          : { title: t.share.title, text: shareText });
      } else {
        await copyShareText();
      }
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError")) await copyShareText();
    } finally {
      sharingLock.current = false;
      setIsSharing(false);
    }
  };

  return (
    <div className="flex max-w-xl flex-col items-start gap-3">
    <button
      type="button"
      onClick={handleShare}
      disabled={isSharing}
      aria-busy={isSharing}
      className={`panel inline-flex h-11 w-fit shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-sm text-chalk transition duration-300 hover:-translate-y-0.5 hover:border-neon-deep hover:text-neon disabled:cursor-wait disabled:opacity-60 ${className}`}
    >
      {copied ? (
        <Check className="size-4 shrink-0 text-neon" strokeWidth={2} />
      ) : (
        <Share2 className="size-4 shrink-0 text-neon" strokeWidth={1.9} />
      )}
      {copied ? t.share.copiedLabel : t.share.buttonLabel}
    </button>
    <span role="status" className="sr-only">{copied ? t.share.copiedLabel : ""}</span>
    {manualCopy ? (
      <label className="flex w-full flex-col gap-2 text-sm text-mist">
        <span role="status">{t.share.manualCopyLabel}</span>
        <textarea readOnly value={shareText} rows={5} onFocus={(event) => event.currentTarget.select()} className="w-full rounded-xl border border-hair bg-abyss px-4 py-3 text-base text-chalk" />
      </label>
    ) : null}
    </div>
  );
}
