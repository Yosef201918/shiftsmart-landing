/**
 * Backdrop — שכבת הרקע של הדף.
 *
 * עיצוב מחדש: במקום תמונת לוח מעגלים, רשת טכנית, הילות מטושטשות ורעש SVG,
 * הרקע הוא משטח כהה ניטרלי עם הילה סטטית אחת, חלשה מאוד, בראש הדף שנותנת
 * עומק בלי להתחרות בתוכן. גרדיאנט CSS בלבד: בלי תמונה, בלי blur ובלי אנימציה,
 * ולכן אין עלות טעינה או ציור ברציפות — בפרט במובייל.
 *
 * המכולה position:fixed כדי שהרקע יישאר נעוץ בכל הדפדפנים, כולל Safari ב-iOS.
 */
export default function Backdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 bg-void"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-5%,rgb(111_207_155/0.07),transparent_70%)]" />
    </div>
  );
}
