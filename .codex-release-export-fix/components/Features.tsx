"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  MessageSquare,
  Briefcase,
  Calculator,
  CalendarDays,
  CalendarSync,
  DatabaseBackup,
  FingerprintPattern,
  LayoutGrid,
  MapPinned,
  Receipt,
  Volume2,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { useLanguage } from "@/lib/i18n/LanguageContext";

/*
 * מיקום, צורה ומבטא הם עיצוב קבוע שאינו תלוי שפה — רק הכותרת והתיאור
 * מגיעים מהמילון, לפי אותו סדר אינדקסים בדיוק ב-t.features.items.
 */
type FeatureMeta = {
  icon: LucideIcon;
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
 *   שורה 5:  J(2)             | K(2) | L(2)   ← שלושת התכונות החדשות (פאזה 15)
 *
 * שורה 5 נוספה בדיוק כמו שורה 2/4: שלושה כרטיסי "standard" בני 2 עמודות
 * שממלאים את ה-6 עמודות בלי שארית, כך שהריצוף נשאר מדויק ואין חורים גם
 * אחרי ההרחבה מ-9 ל-12 כרטיסים.
 */
const FEATURE_META: [
  FeatureMeta,
  FeatureMeta,
  FeatureMeta,
  FeatureMeta,
  FeatureMeta,
  FeatureMeta,
  FeatureMeta,
  FeatureMeta,
  FeatureMeta,
  FeatureMeta,
  FeatureMeta,
  FeatureMeta,
  FeatureMeta,
] = [
  { icon: FingerprintPattern, area: "lg:col-span-2 lg:row-span-2", shape: "tall" },
  { icon: Calculator, area: "lg:col-span-4", shape: "wide", accent: "neon" },
  { icon: CalendarSync, area: "lg:col-span-2", shape: "standard" },
  { icon: Volume2, area: "lg:col-span-2", shape: "standard" },
  { icon: DatabaseBackup, area: "lg:col-span-2 lg:row-span-2", shape: "tall" },
  { icon: MapPinned, area: "lg:col-span-2", shape: "standard" },
  { icon: ShieldCheck, area: "lg:col-span-2", shape: "standard" },
  { icon: Briefcase, area: "lg:col-span-2", shape: "standard" },
  { icon: Receipt, area: "lg:col-span-2", shape: "standard", accent: "amber" },
  { icon: LayoutGrid, area: "lg:col-span-2", shape: "standard" },
  { icon: Zap, area: "lg:col-span-2", shape: "standard" },
  { icon: CalendarDays, area: "lg:col-span-2", shape: "standard" },
  { icon: MessageSquare, area: "sm:col-span-2 lg:col-span-6", shape: "wide" },
];

/** מיפוי גודל → סידור פנימי, ריווח, מידות אייקון וטיפוגרפיה */
const SIZE_STYLES = {
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
  const { t } = useLanguage();

  return (
    <section
      id="features"
      className="relative scroll-mt-16 px-5 pb-28 sm:px-8 lg:px-12 lg:pb-40"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* ---------- כותרת המקטע ---------- */}
        <div
          className="max-w-2xl"
        >
          <p
            className="font-mono text-xs tracking-[0.3em] text-neon/60"
          >
            {t.features.kicker}
          </p>
          <h2
            className="mt-4 text-3xl font-extralight leading-tight text-chalk sm:text-4xl"
          >
            {t.features.titlePrefix}
            <span className="font-display font-normal text-neon">
              {t.features.titleHighlight}
            </span>
          </h2>
        </div>

        {/* ---------- Bento ---------- */}
        {/* Always visible: a tall mobile grid cannot meet a section-wide intersection threshold. */}
        <div
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6 lg:auto-rows-[minmax(13.5rem,auto)] lg:gap-6"
        >
          {FEATURE_META.map(({ icon: Icon, area, shape, accent }, index) => {
            const { title, description } = t.features.items[index];
            const form = SIZE_STYLES[shape];
            const tone = ACCENT_STYLES[accent ?? "none"];

            return (
              <motion.article
                key={index}
                /*
                 * ההרמה ב-hover מנוהלת ע"י framer-motion ולא ע"י Tailwind:
                 * framer-motion כותב transform ישירות ל-style, ולכן מחלקת
                 * hover:-translate-y של Tailwind הייתה נדרסת ולא עובדת.
                 */
                whileHover={{
                  y: -2,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                className={`feature-surface group flex rounded-2xl transition-colors duration-200 ${form.card} ${area} ${tone.card}`}
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
          })}
        </div>
      </div>
    </section>
  );
}

