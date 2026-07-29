import { ArrowRight } from "lucide-react";

type DirectionalArrowProps = {
  className?: string;
  strokeWidth?: number;
};

/**
 * חץ "קדימה" שמתהפך אוטומטית לפי כיוון הדף, בלי לוגיקת JS.
 *
 * הבסיס הוא ArrowRight (מצביע ימינה — "קדימה" בכיוון LTR). המחלקה
 * `rtl:rotate-180` מגיעה מ-Tailwind ומתבססת על התכונה `dir` (ו-`lang`) של
 * אלמנט אב — היא הופכת את החץ שמאלה כש-<html dir="rtl">, בדיוק "קדימה"
 * בכיוון קריאה מימין לשמאל. משתמשים בקומפוננטה הזו בכל מקום שהיה בעבר
 * ArrowLeft קבוע (Hero, BetaSteps, StickyCta) כדי שהאייקון יתאים אוטומטית
 * גם לעברית וגם לאנגלית.
 */
export default function DirectionalArrow({
  className = "",
  strokeWidth = 2,
}: DirectionalArrowProps) {
  return (
    <ArrowRight
      strokeWidth={strokeWidth}
      className={`rtl:rotate-180 ${className}`}
    />
  );
}
