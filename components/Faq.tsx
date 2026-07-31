"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { fadeUp, staggerContainer, VIEWPORT_ONCE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Faq() {
  const { t } = useLanguage();

  /* הפריט הראשון פתוח כברירת מחדל כדי שיהיה ברור שהרכיב אינטראקטיבי */
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative scroll-mt-16 px-5 pb-28 sm:px-8 lg:px-12 lg:pb-36"
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
            {t.faq.kicker}
          </motion.p>
          <motion.h2
            className="mt-4 font-display text-3xl leading-snug text-chalk sm:text-4xl"
            variants={fadeUp}
          >
            {t.faq.titlePrefix}
            <span className="text-neon">{t.faq.titleHighlight}</span>
          </motion.h2>
          <motion.p
            className="mt-5 text-lg leading-relaxed text-mist"
            variants={fadeUp}
          >
            {t.faq.subtitle}
          </motion.p>
        </motion.div>

        {/* ---------- אקורדיון ---------- */}
        <motion.div
          className="mt-12 flex flex-col gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          {t.faq.items.map(({ question, answer }, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const triggerId = `faq-trigger-${index}`;

            return (
              <motion.div
                key={question}
                variants={fadeUp}
                className="panel panel-rail brackets overflow-hidden rounded-2xl transition-colors duration-500 hover:border-hair-lit"
              >
                <h3>
                  <button
                    type="button"
                    id={triggerId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start sm:px-7"
                  >
                    <span
                      className={`font-display text-lg transition-colors duration-300 sm:text-xl ${
                        isOpen ? "text-neon" : "text-chalk"
                      }`}
                    >
                      {question}
                    </span>

                    <motion.span
                      aria-hidden="true"
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full border border-hair bg-abyss/60"
                    >
                      <ChevronDown
                        className={`size-4 transition-colors duration-300 ${
                          isOpen ? "text-neon" : "text-mist"
                        }`}
                        strokeWidth={2}
                      />
                    </motion.span>
                  </button>
                </h3>

                {/*
                  הפאנל תמיד קיים ב-DOM ולעולם לא ממתגים בו height בפועל:
                  height הוא תכונת פריסה שכל שינוי בה מכריח reflow בכל פריים
                  של האנימציה — בדיוק סוג הגמגום שנאסר עלינו בשלב הזה.
                  התחליף: grid-template-rows בין 0fr ל-1fr, טריק CSS טהור
                  (ללא framer-motion, ללא מדידת גובה ב-JS) שמאפשר "לחשוף"
                  תוכן בגובה לא ידוע מראש בלי לגעת ב-height עצמה. ה-opacity
                  נע יחד איתו כדי שהתוכן לא "יקפוץ" גלוי ברגע שהשורה נפתחת.
                */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  aria-hidden={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out will-change-[grid-template-rows] ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="rule-hair mx-6 sm:mx-7" />
                    <p className="px-6 pb-6 pt-5 text-base leading-relaxed text-mist sm:px-7">
                      {answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
