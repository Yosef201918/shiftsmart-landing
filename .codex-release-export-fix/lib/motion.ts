import type { Variants } from "framer-motion";

/**
 * הגדרות אנימציה משותפות לכל המקטעים.
 *
 * עיקרון: מונפשים אך ורק opacity ו-transform. שתי התכונות האלה רצות על ה-GPU
 * ואינן גורמות ל-reflow, ולכן אין קפיצות פריסה (CLS) ואין ירידת ביצועים —
 * האלמנט תופס את מקומו המלא כבר ברינדור הראשוני וגם כשהוא שקוף.
 */

/** עקומת האטה רכה — טיפוס מפורש כדי לספק את החתימה של framer-motion */
export const EASE: [number, number, number, number] = [0.16, 0.84, 0.28, 1];

/** האנימציה מופעלת פעם אחת בלבד, מעט לפני שהאלמנט נכנס לתצוגה במלואו */
export const VIEWPORT_ONCE = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -80px 0px",
} as const;

/** הופעה עדינה מלמטה — אבן הבניין הבסיסית */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

/** הופעה עם קנה מידה קל — למוקאפ ולכרטיסים הבולטים */
export const fadeScale: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE },
  },
};

/**
 * מכולה שמדרגת את הופעת הילדים. התזמור נעשה ברמת ההורה בלבד,
 * כך שיש observer אחד למקטע במקום אחד לכל אלמנט.
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};
