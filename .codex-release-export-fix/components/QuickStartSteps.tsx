"use client";

import { motion } from "framer-motion";
import { Briefcase, Download, Wallet, type LucideIcon } from "lucide-react";

import { EXTERNAL_LINK_PROPS, PLAY_STORE_URL } from "@/lib/links";
import { fadeUp, staggerContainer, VIEWPORT_ONCE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/*
 * המבנה החזותי של כל שלב (אייקון, קישור) הוא קבוע ואינו תלוי שפה — רק
 * הכותרת והתיאור מגיעים מהמילון, לפי אותו סדר אינדקסים ב-t.quickStart.steps.
 *
 * שלב 1 הוא הורדה ישירה מ-Google Play, ולכן ה-href מצביע לשם והאייקון הוא
 * Download.
 */
type StepMeta = {
  icon: LucideIcon;
  href?: string;
};

const STEP_META: [StepMeta, StepMeta, StepMeta] = [
  { icon: Download, href: PLAY_STORE_URL },
  { icon: Briefcase },
  { icon: Wallet },
];

const HOVER_LIFT = {
  y: -1,
  transition: { duration: 0.25, ease: "easeOut" },
} as const;

/*
 * גרסה קומפקטית של מדריך שלושת השלבים. בשלב 16 המדריך הועבר ממקטע נפרד
 * (עם כרטיסי Bento גבוהים ומספרי רקע ענקיים) לתוך ה-Hero עצמו, מיד מתחת
 * לכפתורי הפעולה — כך שהמשתמש רואה את הדרך להצטרפות בלי לגלול. לשם כך
 * הכרטיסים כאן אופקיים וצפופים (אייקון + כותרת + תיאור קצר בשורה אחת עד
 * שתיים) במקום כרטיסים אנכיים גבוהים עם ריפוד גדול.
 */
export default function QuickStartSteps() {
  const { t } = useLanguage();

  return (
    <motion.div
      className="mt-4 lg:mt-10"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
    >
      <motion.p
        className="font-mono text-xs tracking-[0.3em] text-neon/60"
        variants={fadeUp}
      >
        {t.quickStart.kicker}
      </motion.p>
      <motion.h2
        className="mt-2 font-display text-xl text-chalk sm:text-2xl"
        variants={fadeUp}
      >
        {t.quickStart.titlePrefix}
        <span className="text-neon">{t.quickStart.titleHighlight}</span>
        {t.quickStart.titleSuffix}
      </motion.h2>

      <motion.div
        className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3"
        variants={staggerContainer}
      >
        {STEP_META.map(({ icon: Icon, href }, index) => {
          const { title, description } = t.quickStart.steps[index];
          const number = String(index + 1).padStart(2, "0");

          const cardClass =
            "quick-start-step group flex items-center gap-3 rounded-lg p-3.5 transition-colors duration-200 sm:p-4";

          const content = (
            <>
              <span className="relative flex size-11 shrink-0 items-center justify-center rounded-lg bg-neon/[0.05]">
                <Icon className="size-5 text-neon" strokeWidth={1.6} />
              </span>

              <span className="min-w-0">
                <span className="flex items-start gap-1.5">
                  <span dir="ltr" className="font-mono text-[0.65rem] text-neon/60">
                    {number}
                  </span>
                  <span className="font-display text-sm leading-snug text-chalk sm:text-base">
                    {title}
                  </span>
                </span>
                <span className="mt-1 block text-xs leading-snug text-mist">
                  {description}
                </span>
              </span>
            </>
          );

          return href ? (
            <motion.a
              key={number}
              href={href}
              data-download-placement="quick_start"
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
