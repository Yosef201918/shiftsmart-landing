"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { EASE, fadeUp, staggerContainer, VIEWPORT_ONCE } from "@/lib/motion";

type QuestionItem = {
  question: string;
  answer: string;
};

const QUESTIONS: QuestionItem[] = [
  {
    question: "איך מחושבות שעות נוספות?",
    answer:
      "בכל משמרת האפליקציה משווה את סך השעות שנצברו לאורך יום העבודה שהגדרתם. כל שעה מעבר לסף מסומנת בנפרד ומחושבת לפי אחוז התוספת שקבעתם, כך שהסכום שמופיע בסיכום החודשי כבר כולל אותן ואין צורך בחישוב ידני.",
  },
  {
    question: "מה קורה אם שכחתי להחתים כניסה או יציאה?",
    answer:
      "אפשר להוסיף או לתקן משמרת ידנית בכל רגע. נכנסים ליומן, בוחרים את התאריך הרלוונטי ומזינים את שעות ההתחלה והסיום. הסיכום החודשי וסך ההכנסות מתעדכנים מיד, בלי לפגוע בשאר המשמרות.",
  },
  {
    question: "אפשר לנהל כמה מקומות עבודה במקביל?",
    answer:
      "כן. מגדירים לכל מקום עבודה תעריף שעתי ואורך משמרת משלו, וכל משמרת משויכת למקום שבו עבדתם בפועל. הדוח החודשי מציג פילוח נפרד לכל מקום עבודה וגם סיכום כולל של כל השעות וההכנסות יחד.",
  },
];

export default function Faq() {
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
            FAQ
          </motion.p>
          <motion.h2
            className="mt-4 font-display text-3xl leading-snug text-chalk sm:text-4xl"
            variants={fadeUp}
          >
            שאלות <span className="text-neon">ותשובות</span>
          </motion.h2>
          <motion.p
            className="mt-5 text-lg leading-relaxed text-mist"
            variants={fadeUp}
          >
            כל מה שנשאלנו הכי הרבה על חישוב שעות וניהול משמרות. לא מצאתם תשובה?
            אנחנו זמינים במייל.
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
          {QUESTIONS.map(({ question, answer }, index) => {
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
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-right sm:px-7"
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

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="rule-hair mx-6 sm:mx-7" />
                      <p className="px-6 pb-6 pt-5 text-base leading-relaxed text-mist sm:px-7">
                        {answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
