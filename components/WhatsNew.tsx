"use client";

import { motion } from "framer-motion";
import { LayoutGrid, Vibrate, Workflow, type LucideIcon } from "lucide-react";

import { fadeUp, staggerContainer, VIEWPORT_ONCE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/** האייקון בלבד הוא מבנה קבוע — הכותרת והתיאור מגיעים מהמילון לפי אינדקס */
const UPDATE_ICONS: [LucideIcon, LucideIcon, LucideIcon] = [
  LayoutGrid,
  Workflow,
  Vibrate,
];

export default function WhatsNew() {
  const { t } = useLanguage();

  return (
    <section
      id="whats-new"
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
            {t.whatsNew.kicker}
          </motion.p>
          <motion.h2
            className="mt-4 text-3xl font-extralight leading-tight text-chalk sm:text-4xl"
            variants={fadeUp}
          >
            {t.whatsNew.titlePrefix}
            <span className="font-display font-normal text-neon">
              {t.whatsNew.titleHighlight}
            </span>
          </motion.h2>
          <motion.p
            className="mt-5 text-lg leading-relaxed text-mist"
            variants={fadeUp}
          >
            {t.whatsNew.subtitle}
          </motion.p>
        </motion.div>

        {/* ---------- כרטיסי העדכונים ---------- */}
        <motion.div
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          {UPDATE_ICONS.map((Icon, index) => {
            const { title, description } = t.whatsNew.items[index];

            return (
              <motion.article
                key={title}
                variants={fadeUp}
                /*
                 * ההרמה ב-hover מנוהלת ע"י framer-motion (transform בלבד),
                 * בדיוק כמו בכרטיסי Features — אין כאן width/height/top/left
                 * מונפשים, רק transform ו-opacity שרצים על ה-GPU.
                 */
                whileHover={{
                  y: -6,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                className="panel panel-rail edge-lit group relative flex flex-col rounded-2xl p-7 transition-colors duration-500 hover:border-hair-lit"
              >
                {/* תג "חדש" — פינה עליונה, מתהפך אוטומטית לפי RTL/LTR */}
                <span className="absolute end-6 top-6 rounded-full border border-neon-deep/70 bg-neon/[0.1] px-2.5 py-1 font-mono text-[0.65rem] tracking-[0.2em] text-neon">
                  {t.whatsNew.badgeLabel}
                </span>

                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-hair bg-abyss/60 transition duration-500 group-hover:border-neon-deep">
                  <Icon className="size-5 text-neon" strokeWidth={1.6} />
                </span>

                <h3 className="mt-6 pe-12 font-display text-xl text-chalk sm:text-2xl">
                  {title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-mist">
                  {description}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
