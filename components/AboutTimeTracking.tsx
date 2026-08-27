"use client";

import { motion } from "framer-motion";
import { Clock4 } from "lucide-react";

import { fadeUp, staggerContainer, VIEWPORT_ONCE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/*
 * מקטע תוכן קצר ואמיתי (לא כרטיסים) שמסביר מהו שעון נוכחות דיגיטלי ולמה
 * זה חשוב לעובדי משמרות — עומק תוכן לצורכי SEO, לא רק עותק שיווקי. ממוקם
 * בין Features ל-Reviews (ראו app/page.tsx), רחוק מה-Hero ולכן לא נוגע
 * באילוץ אי-הגלילה במובייל שמתועד עבור אזור ה-Hero ב-PROJECT_MEMORY.md.
 */
export default function AboutTimeTracking() {
  const { t } = useLanguage();

  return (
    <section className="relative px-5 pb-28 sm:px-8 lg:px-12 lg:pb-40">
      <motion.div
        className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
      >
        <motion.span
          className="panel brackets flex size-12 shrink-0 items-center justify-center rounded-xl"
          variants={fadeUp}
        >
          <Clock4 className="size-5 text-neon" strokeWidth={1.75} />
        </motion.span>

        <motion.p
          className="font-mono text-xs tracking-[0.3em] text-neon-deep"
          variants={fadeUp}
        >
          {t.aboutTimeTracking.kicker}
        </motion.p>

        <motion.h2
          className="font-display text-3xl leading-tight text-chalk sm:text-4xl"
          variants={fadeUp}
        >
          {t.aboutTimeTracking.titlePrefix}
          <span className="text-neon">{t.aboutTimeTracking.titleHighlight}</span>
        </motion.h2>

        <motion.p
          className="max-w-2xl text-lg leading-relaxed text-mist"
          variants={fadeUp}
        >
          {t.aboutTimeTracking.body}
        </motion.p>
      </motion.div>
    </section>
  );
}
