"use client";

import { motion } from "framer-motion";
import { Download, Rocket, UserPlus, type LucideIcon } from "lucide-react";

import { BETA_GROUP_URL, EXTERNAL_LINK_PROPS, PLAY_STORE_URL } from "@/lib/links";
import { fadeUp, staggerContainer, VIEWPORT_ONCE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/*
 * המבנה החזותי של כל שלב (אייקון, קישור) הוא קבוע ואינו תלוי שפה — רק
 * הכותרת והתיאור מגיעים מהמילון, לפי אותו סדר אינדקסים ב-t.betaSteps.steps.
 */
type StepMeta = {
  icon: LucideIcon;
  href?: string;
};

const STEP_META: [StepMeta, StepMeta, StepMeta] = [
  { icon: UserPlus, href: BETA_GROUP_URL },
  { icon: Download, href: PLAY_STORE_URL },
  { icon: Rocket },
];

const HOVER_LIFT = {
  y: -4,
  transition: { duration: 0.25, ease: "easeOut" },
} as const;

/*
 * גרסה קומפקטית של מדריך שלושת השלבים. בשלב 16 המדריך הועבר ממקטע נפרד
 * (עם כרטיסי Bento גבוהים ומספרי רקע ענקיים) לתוך ה-Hero עצמו, מיד מתחת
 * לכפתורי הפעולה — כך שהמשתמש רואה את הדרך להצטרפות בלי לגלול. לשם כך
 * הכרטיסים כאן אופקיים וצפופים (אייקון + כותרת + תיאור קצר בשורה אחת עד
 * שתיים) במקום כרטיסים אנכיים גבוהים עם ריפוד גדול.
 */
export default function BetaSteps() {
  const { t } = useLanguage();

  return (
    <motion.div
      className="mt-6 lg:mt-10"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
    >
      <motion.p
        className="font-mono text-xs tracking-[0.3em] text-neon-deep"
        variants={fadeUp}
      >
        {t.betaSteps.kicker}
      </motion.p>
      <motion.h2
        className="mt-2 font-display text-xl text-chalk sm:text-2xl"
        variants={fadeUp}
      >
        {t.betaSteps.titlePrefix}
        <span className="text-neon">{t.betaSteps.titleHighlight}</span>
        {t.betaSteps.titleSuffix}
      </motion.h2>

      <motion.div
        className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3"
        variants={staggerContainer}
      >
        {STEP_META.map(({ icon: Icon, href }, index) => {
          const { title, description } = t.betaSteps.steps[index];
          const number = String(index + 1).padStart(2, "0");

          const cardClass =
            "panel panel-rail edge-lit group flex items-center gap-3 rounded-xl p-3.5 transition-colors duration-500 hover:border-hair-lit sm:p-4";

          const content = (
            <>
              <span className="relative flex size-11 shrink-0 items-center justify-center rounded-xl border border-hair bg-abyss/60 transition duration-500 group-hover:border-neon-deep">
                <Icon className="size-5 text-neon" strokeWidth={1.6} />
              </span>

              <span className="min-w-0">
                <span className="flex items-center gap-1.5">
                  <span dir="ltr" className="font-mono text-[0.65rem] text-neon-deep">
                    {number}
                  </span>
                  <span className="truncate font-display text-sm text-chalk sm:text-base">
                    {title}
                  </span>
                </span>
                <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-mist">
                  {description}
                </span>
              </span>
            </>
          );

          return href ? (
            <motion.a
              key={number}
              href={href}
              {...EXTERNAL_LINK_PROPS}
              variants={fadeUp}
              whileHover={HOVER_LIFT}
              className={cardClass}
            >
              {content}
            </motion.a>
          ) : (
            <motion.div
              key={number}
              variants={fadeUp}
              whileHover={HOVER_LIFT}
              className={cardClass}
            >
              {content}
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
