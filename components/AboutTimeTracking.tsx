"use client";

import { motion } from "framer-motion";

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
    <section id="time-tracking" className="relative scroll-mt-12 px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28">
      <motion.div
        className="mx-auto grid w-full max-w-6xl gap-5 border-t border-hair-lit/50 pt-8 md:grid-cols-2 md:gap-x-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
      >
        <motion.p
          className="font-mono text-xs tracking-[0.3em] text-neon/60 md:col-span-2"
          variants={fadeUp}
        >
          {t.aboutTimeTracking.kicker}
        </motion.p>

        <motion.h2
          className="max-w-md text-3xl font-light leading-tight text-chalk sm:text-4xl"
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
