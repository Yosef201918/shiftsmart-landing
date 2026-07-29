"use client";

import { motion } from "framer-motion";
import {
  BellRing,
  ReceiptText,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

import { fadeUp, staggerContainer, VIEWPORT_ONCE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/** האייקון בלבד הוא מבנה קבוע — הכותרת והתיאור מגיעים מהמילון לפי אינדקס */
const MILESTONE_ICONS: [LucideIcon, LucideIcon, LucideIcon] = [
  Smartphone,
  BellRing,
  ReceiptText,
];

export default function Roadmap() {
  const { t } = useLanguage();

  return (
    <section
      id="roadmap"
      className="relative scroll-mt-16 px-5 pb-28 sm:px-8 lg:px-12 lg:pb-40"
    >
      <div className="mx-auto w-full max-w-3xl">
        {/* ---------- כותרת המקטע ---------- */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          <motion.p
            className="font-mono text-xs tracking-[0.3em] text-neon-deep"
            variants={fadeUp}
          >
            {t.roadmap.kicker}
          </motion.p>
          <motion.h2
            className="mt-4 text-3xl font-extralight leading-tight text-chalk sm:text-4xl"
            variants={fadeUp}
          >
            {t.roadmap.titlePrefix}
            <span className="font-display font-normal text-neon">
              {t.roadmap.titleHighlight}
            </span>
          </motion.h2>
          <motion.p
            className="mt-5 text-lg leading-relaxed text-mist"
            variants={fadeUp}
          >
            {t.roadmap.subtitle}
          </motion.p>
        </motion.div>

        {/*
          ציר זמן אנכי. כל פריט הוא גריד של שתי עמודות — סמן וכרטיס — כך
          שהקו והנקודות מתהפכים אוטומטית לפי כיוון הדף (RTL/LTR) בלי מיקום
          אבסולוטי ידני: CSS Grid הופך את סדר העמודות בהתאם ל-dir.
        */}
        <motion.ol
          className="mt-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          {MILESTONE_ICONS.map((Icon, index) => {
            const { title, description } = t.roadmap.milestones[index];
            const isLast = index === MILESTONE_ICONS.length - 1;

            return (
              <motion.li
                key={title}
                className={`grid grid-cols-[auto_1fr] gap-5 sm:gap-7 ${
                  isLast ? "" : "pb-6"
                }`}
                variants={fadeUp}
              >
                {/* סמן הציר: עיגול ואחריו קו מחבר שממלא את שארית הגובה */}
                <div className="flex flex-col items-center">
                  <span className="panel flex size-12 shrink-0 items-center justify-center rounded-full border-neon-deep/70">
                    <Icon className="size-5 text-neon" strokeWidth={1.7} />
                  </span>
                  {isLast ? null : (
                    <span
                      aria-hidden="true"
                      className="mt-3 w-px flex-1 bg-gradient-to-b from-neon-deep via-hair to-transparent"
                    />
                  )}
                </div>

                {/* הכרטיס */}
                <div className="panel edge-lit rounded-2xl p-6 transition-colors duration-500 hover:border-hair-lit sm:p-7">
                  <h3 className="font-display text-xl text-chalk sm:text-2xl">
                    {title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-mist">
                    {description}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}
