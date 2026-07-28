"use client";

import { motion } from "framer-motion";
import {
  BatteryCharging,
  Briefcase,
  Calculator,
  CalendarSync,
  Crown,
  DatabaseBackup,
  FingerprintPattern,
  MapPinned,
  Volume2,
  type LucideIcon,
} from "lucide-react";

import { fadeUp, staggerContainer, VIEWPORT_ONCE } from "@/lib/motion";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  /** מיקום בגריד בן 6 העמודות (דסקטופ) */
  area: string;
  /** צורת הכרטיס — משפיעה על סידור פנימי, גודל אייקון וטיפוגרפיה */
  shape: "tall" | "wide" | "standard";
  /** מבטא צבעוני — שמור לשני כרטיסים בלבד כדי שיישאר משמעותי */
  accent?: "neon" | "amber";
};

/*
 * פריסת Bento על גריד בן 6 עמודות. הריצוף מדויק ומלא — אין חורים,
 * וכל כרטיס מיושר לקווי הגריד. ההיררכיה נוצרת מהפרשי גודל (כרטיס גבוה
 * בגובה כפול, כרטיס רחב בשתי שליש רוחב) ולא מהיסטים אקראיים.
 *
 * סדר הפריטים חשוב: מיקום אוטומטי של CSS Grid ממלא לפי הסדר הזה בדיוק,
 *   שורה 1:  A(2 רחב, 2 גבוה) | B(4)
 *   שורה 2:  A ממשיך          | C(2) | D(2)
 *   שורה 3:  E(2 רחב, 2 גבוה) | F(2) | G(2)
 *   שורה 4:  E ממשיך          | H(2) | I(2)
 */
const FEATURES: Feature[] = [
  {
    icon: FingerprintPattern,
    title: "החתמה בטביעת אצבע",
    description: "כניסה ויציאה קלה ומאובטחת.",
    area: "lg:col-span-2 lg:row-span-2",
    shape: "tall",
  },
  {
    icon: Calculator,
    title: "מחשבון שכר וטיפים",
    description: "שעות נוספות, שבתות וחגים – הכל אוטומטי.",
    area: "lg:col-span-4",
    shape: "wide",
    accent: "neon",
  },
  {
    icon: CalendarSync,
    title: "יומן משמרות חכם",
    description:
      "יומן ייעודי בתוך האפליקציה פלוס סנכרון אוטומטי ליומן Google.",
    area: "lg:col-span-2",
    shape: "standard",
  },
  {
    icon: Volume2,
    title: "חיווי קולי",
    description: 'צליל "ביפ" בכל החתמה.',
    area: "lg:col-span-2",
    shape: "standard",
  },
  {
    icon: DatabaseBackup,
    title: "דוחות וגיבוי",
    description: "סיכום חודשי מפורט, ייצוא לוואטסאפ/PDF, ומערכת גיבוי.",
    area: "lg:col-span-2 lg:row-span-2",
    shape: "tall",
  },
  {
    icon: MapPinned,
    title: "וידוא מיקום חכם",
    description: "שמירה מדויקת של תחילת המשמרת.",
    area: "lg:col-span-2",
    shape: "standard",
  },
  {
    icon: BatteryCharging,
    title: "חיסכון בסוללה ופרטיות",
    description: "עיצוב כהה, נתונים נשארים אך ורק במכשיר שלכם.",
    area: "lg:col-span-2",
    shape: "standard",
  },
  {
    icon: Briefcase,
    title: "ניהול משרות",
    description:
      "תמיכה במספר מקומות עבודה, כולל הגדרת משמרות בוקר/צהריים/ערב/לילה.",
    area: "lg:col-span-2",
    shape: "standard",
  },
  {
    icon: Crown,
    title: "תכונות פרימיום",
    description: "חינם למשתמשי בטא כמו ייצוא ל-PDF ועוד...",
    area: "lg:col-span-2",
    shape: "standard",
    accent: "amber",
  },
];

/** מיפוי צורה → סידור פנימי, ריווח, מידות אייקון וטיפוגרפיה */
const SHAPE_STYLES = {
  tall: {
    card: "flex-col p-8",
    iconBox: "size-16 rounded-2xl",
    icon: "size-7",
    /* mt-auto דוחף את הטקסט לתחתית הכרטיס הגבוה — מראה Bento קלאסי */
    body: "mt-auto pt-8",
    title: "font-display text-2xl",
    description: "mt-3 text-base",
  },
  wide: {
    card: "flex-col p-8 lg:flex-row lg:items-center lg:gap-7",
    iconBox: "size-14 rounded-2xl",
    icon: "size-6",
    body: "lg:flex-1",
    title: "font-display text-2xl",
    description: "mt-3 text-base",
  },
  standard: {
    card: "flex-col p-7",
    iconBox: "size-12 rounded-xl",
    icon: "size-5",
    body: "mt-5",
    title: "text-lg font-bold",
    description: "mt-2.5 text-sm",
  },
} as const;

/** מיפוי מבטא → צבעי מסגרת, קופסת אייקון וכותרת */
const ACCENT_STYLES = {
  neon: {
    card: "border-neon-deep/70",
    iconBox: "border-neon-deep bg-neon/[0.08]",
    icon: "text-neon",
    title: "text-neon",
  },
  amber: {
    card: "border-amber-deep",
    iconBox: "border-amber-deep bg-amber/[0.08]",
    icon: "text-amber",
    title: "text-amber",
  },
  none: {
    card: "",
    iconBox: "border-hair bg-abyss/60 group-hover:border-neon-deep",
    icon: "text-neon",
    title: "text-chalk",
  },
} as const;

export default function Features() {
  return (
    <section
      id="features"
      className="relative scroll-mt-16 px-5 pb-28 sm:px-8 lg:px-12 lg:pb-40"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* ---------- כותרת המקטע ---------- */}
        <motion.div
          className="max-w-2xl"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          <motion.p
            className="font-mono text-xs tracking-[0.3em] text-neon-deep"
            variants={fadeUp}
          >
            01 — 09
          </motion.p>
          <motion.h2
            className="mt-4 text-3xl font-extralight leading-tight text-chalk sm:text-4xl"
            variants={fadeUp}
          >
            כל מה שיש{" "}
            <span className="font-display font-normal text-neon">בפנים</span>
          </motion.h2>
        </motion.div>

        {/* ---------- Bento ---------- */}
        <motion.div
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6 lg:auto-rows-[minmax(13.5rem,auto)] lg:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          {FEATURES.map(
            ({ icon: Icon, title, description, area, shape, accent }) => {
              const form = SHAPE_STYLES[shape];
              const tone = ACCENT_STYLES[accent ?? "none"];

              return (
                <motion.article
                  key={title}
                  variants={fadeUp}
                  /*
                   * ההרמה ב-hover מנוהלת ע"י framer-motion ולא ע"י Tailwind:
                   * framer-motion כותב transform ישירות ל-style, ולכן מחלקת
                   * hover:-translate-y של Tailwind הייתה נדרסת ולא עובדת.
                   */
                  whileHover={{
                    y: -6,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                  /* edge-lit תופסת ::before ו-panel-rail תופסת ::after — אין התנגשות */
                  className={`panel panel-rail edge-lit group flex rounded-2xl transition-colors duration-500 hover:border-hair-lit ${form.card} ${area} ${tone.card}`}
                >
                  <span
                    className={`flex shrink-0 items-center justify-center border transition duration-500 ${form.iconBox} ${tone.iconBox}`}
                  >
                    <Icon
                      className={`${form.icon} ${tone.icon}`}
                      strokeWidth={1.6}
                    />
                  </span>

                  <div className={form.body}>
                    <h3 className={`leading-snug ${form.title} ${tone.title}`}>
                      {title}
                    </h3>
                    <p
                      className={`leading-relaxed text-mist ${form.description}`}
                    >
                      {description}
                    </p>
                  </div>
                </motion.article>
              );
            },
          )}
        </motion.div>
      </div>
    </section>
  );
}
