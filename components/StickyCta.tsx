"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Users } from "lucide-react";

import DirectionalArrow from "@/components/DirectionalArrow";
import { BETA_GROUP_URL, EXTERNAL_LINK_PROPS } from "@/lib/links";
import { EASE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/**
 * כפתור צף שמופיע רק אחרי שההירו יצא לגמרי מהמסך.
 *
 * המימוש נשען על IntersectionObserver ולא על מאזין scroll: המעקב נעשה
 * מחוץ ל-main thread, בלי חישוב מיקום בכל פריים גלילה ובלי צורך ב-throttle.
 */
export default function StickyCta() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 28 }}
          transition={{ duration: 0.35, ease: EASE }}
          /* pointer-events-none על העוטף כדי שהרצועה השקופה לא תחסום קליקים */
          className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
        >
          <a
            href={BETA_GROUP_URL}
            {...EXTERNAL_LINK_PROPS}
            className="panel edge-lit pointer-events-auto inline-flex h-14 items-center justify-center gap-2.5 rounded-full px-7 text-base text-chalk shadow-neon transition duration-300 hover:border-neon-deep hover:text-neon"
          >
            <Users className="size-5 shrink-0 text-neon" strokeWidth={1.75} />
            {t.stickyCta.label}
            <DirectionalArrow
              strokeWidth={2}
              className="size-4 shrink-0 transition-transform duration-300"
            />
          </a>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
