"use client";

import { motion } from "framer-motion";
import { Briefcase, Download, Wallet, type LucideIcon } from "lucide-react";

import { EXTERNAL_LINK_PROPS, PLAY_STORE_URL } from "@/lib/links";
import { fadeUp, staggerContainer, VIEWPORT_ONCE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/*
 * המבנה החזותי של כל שלב (אייקון, קישור) הוא קבוע ואינו תלוי שפה — רק
 * הכותרת והתיאור מגיעים מהמילון, לפי אותו סדר אינדקסים ב-t.betaSteps.steps.
 *
 * שלב 43: הבטא עברה מסגורה לפתוחה — שלב 1 כבר לא "הצטרפות לקבוצת בודקים"
 * (UserPlus) אלא הורדה ישירה מ-Google Play, ולכן href עבר לשם ואייקון
 * Download תפס את מקומו של UserPlus.
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

/*
 * מדריך שלושת השלבים. עיצוב מחדש: במקום שלושה כרטיסי זכוכית צפים, מיכל אחד
 * עם מסגרת דקה ושלוש שורות (במובייל) או שלושה טורים (מ-sm) המופרדים בקו
 * בעובי פיקסל. הצפיפות במובייל נשמרה — המדריך חייב להישאר גלוי בלי גלילה
 * ב-375×812 (ראו PROJECT_MEMORY.md). התיאורים מוצגים במלואם, בלי קיצוץ שורות.
 */
export default function BetaSteps() {
  const { t } = useLanguage();

  return (
    <motion.div
      className="mt-6 sm:mt-8 lg:mt-14"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
    >
      <motion.p className="eyebrow" variants={fadeUp}>
        {t.betaSteps.kicker}
      </motion.p>
      <motion.h2 className="section-title mt-2" variants={fadeUp}>
        {t.betaSteps.titlePrefix}
        <span className="text-neon">{t.betaSteps.titleHighlight}</span>
        {t.betaSteps.titleSuffix}
      </motion.h2>

      <motion.div
        className="panel mt-4 grid sm:mt-5 grid-cols-1 divide-y divide-hair overflow-hidden rounded-card sm:grid-cols-3 sm:divide-x sm:divide-y-0"
        variants={fadeUp}
      >
        {STEP_META.map(({ icon: Icon, href }, index) => {
          const { title, description } = t.betaSteps.steps[index];
          const number = String(index + 1).padStart(2, "0");

          const rowClass =
            "flex items-start gap-3.5 p-3.5 transition-colors duration-200 -outline-offset-2 sm:p-5";

          const content = (
            <>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-control border border-hair bg-raised">
                <Icon className="size-[1.125rem] text-neon" strokeWidth={1.6} />
              </span>

              <span className="min-w-0">
                <span className="flex items-baseline gap-2">
                  <span dir="ltr" className="text-xs tabular-nums text-mist">
                    {number}
                  </span>
                  <span className="text-[0.9375rem] font-medium text-chalk sm:text-base">
                    {title}
                  </span>
                </span>
                <span className="mt-0.5 block text-[0.8125rem] leading-snug text-mist sm:text-sm">
                  {description}
                </span>
              </span>
            </>
          );

          return href ? (
            <a
              key={number}
              href={href}
              {...EXTERNAL_LINK_PROPS}
              className={`${rowClass} hover:bg-raised/60`}
            >
              {content}
            </a>
          ) : (
            <div key={number} className={rowClass}>
              {content}
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
