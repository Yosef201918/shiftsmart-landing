"use client";

import { motion } from "framer-motion";
import {
  CalendarRange,
  Check,
  DatabaseBackup,
  Download,
  FileSpreadsheet,
  type LucideIcon,
} from "lucide-react";

import DirectionalArrow from "@/components/DirectionalArrow";
import { EXTERNAL_LINK_PROPS, PLAY_STORE_URL } from "@/lib/links";
import { fadeUp, staggerContainer, VIEWPORT_ONCE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/** האייקון בלבד הוא מבנה קבוע — הכותרת והתיאור מגיעים מהמילון לפי אינדקס */
const PRO_ICONS: [LucideIcon, LucideIcon, LucideIcon] = [
  DatabaseBackup,
  FileSpreadsheet,
  CalendarRange,
];

/*
 * מקטע Pro: שלושה כרטיסי יכולת, פאנל "נשאר חינם" (כדי ש-Pro לא ייראה כמי
 * שלוקח תכונות קיימות), הערת שחזור רכישה, הערה כנה על תכונות עתידיות, וקריאה
 * לפעולה ל-Google Play. המחיר מכוון לא מופיע — הוא מוצג בחנות.
 * מונפשים opacity ו-transform בלבד; MotionProvider מכבד prefers-reduced-motion.
 */
export default function Pro() {
  const { t } = useLanguage();
  const { pro } = t;

  return (
    <section
      id="pro"
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
            className="font-mono text-xs tracking-[0.3em] text-neon/60"
            variants={fadeUp}
          >
            {pro.kicker}
          </motion.p>
          <motion.h2
            className="mt-4 text-3xl font-extralight leading-tight text-chalk sm:text-4xl"
            variants={fadeUp}
          >
            {pro.titlePrefix}
            <span className="font-display font-normal text-neon">
              {pro.titleHighlight}
            </span>
          </motion.h2>
          <motion.p
            className="mt-5 text-lg leading-relaxed text-mist"
            variants={fadeUp}
          >
            {pro.subtitle}
          </motion.p>
        </motion.div>

        {/* ---------- שלוש יכולות ה-Pro ---------- */}
        <motion.ul
          className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          {PRO_ICONS.map((Icon, index) => {
            const { title, description } = pro.items[index];

            return (
              <motion.li
                key={title}
                variants={fadeUp}
                className="panel panel-rail edge-lit group flex flex-col rounded-2xl border-neon-deep/70 p-7 transition-colors duration-500 hover:border-hair-lit"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-neon-deep bg-neon/[0.08]">
                  <Icon className="size-5 text-neon" strokeWidth={1.6} />
                </span>
                <h3 className="mt-5 text-lg font-bold leading-snug text-chalk">
                  {title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-mist">
                  {description}
                </p>
              </motion.li>
            );
          })}
        </motion.ul>

        {/* ---------- נשאר חינם + הערות + CTA ---------- */}
        <motion.div
          className="panel edge-lit mt-5 rounded-2xl p-7 sm:p-8 lg:mt-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          <motion.h3
            className="font-display text-xl text-chalk"
            variants={fadeUp}
          >
            {pro.freeTitle}
          </motion.h3>
          <motion.p
            className="mt-3 text-base leading-relaxed text-mist"
            variants={fadeUp}
          >
            {pro.freeLead}
          </motion.p>
          <motion.ul
            className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-8"
            variants={fadeUp}
          >
            {pro.freeItems.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-chalk">
                <Check
                  className="size-4 shrink-0 text-neon"
                  strokeWidth={2.25}
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </motion.ul>

          <motion.p
            className="mt-6 max-w-3xl text-sm leading-relaxed text-mist"
            variants={fadeUp}
          >
            {pro.restoreNote}
          </motion.p>
          <motion.p
            className="mt-2 max-w-3xl text-sm leading-relaxed text-mist"
            variants={fadeUp}
          >
            {pro.futureNote}
          </motion.p>

          <motion.div className="mt-7" variants={fadeUp}>
            <a
              href={PLAY_STORE_URL}
              {...EXTERNAL_LINK_PROPS}
              className="group inline-flex h-14 w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-xl bg-neon px-7 font-display text-base text-[#021309] shadow-neon transition duration-300 hover:-translate-y-0.5 hover:bg-neon-soft hover:shadow-[0_0_40px_-4px_rgb(92_255_157/0.6)] sm:w-auto"
            >
              <Download className="size-5 shrink-0" strokeWidth={2.25} />
              {pro.ctaLabel}
              <DirectionalArrow
                strokeWidth={2.25}
                className="size-5 shrink-0 transition-transform duration-300 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
