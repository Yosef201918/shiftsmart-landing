import type { RichTextSegment } from "@/lib/i18n/dictionaries";

type RichTextProps = {
  segments: RichTextSegment[];
};

/**
 * מרנדר פסקה שמורכבת מכמה קטעי טקסט, חלקם עם הדגשה (מודגש/קוד) — משמש
 * בדפי מדיניות הפרטיות ותנאי השימוש כדי לתרגם פסקאות עם הדגשות מוטמעות
 * בלי לשכפל JSX נפרד לכל שפה (ראו RichTextSegment ב-lib/i18n/dictionaries.ts).
 */
export default function RichText({ segments }: RichTextProps) {
  return (
    <>
      {segments.map((segment, index) => {
        if (segment.format === "bold") {
          return (
            <strong key={index} className="text-chalk">
              {segment.text}
            </strong>
          );
        }

        if (segment.format === "code") {
          return (
            <code
              key={index}
              className="rounded bg-abyss/60 px-1.5 py-0.5 text-sm text-neon"
              dir="ltr"
            >
              {segment.text}
            </code>
          );
        }

        return <span key={index}>{segment.text}</span>;
      })}
    </>
  );
}
