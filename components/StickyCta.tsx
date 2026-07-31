"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Users } from "lucide-react";

import DirectionalArrow from "@/components/DirectionalArrow";
import { BETA_GROUP_URL, EXTERNAL_LINK_PROPS } from "@/lib/links";
import { EASE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/**
 * כפתור צף שמופיע רק אחרי שההירו יצא לגמרי מהמסך, ונעלם שוב ברגע שהפוטר
 * מגיע לתצוגה.
 *
 * באג שתוקן כאן: הכפתור היה position:fixed בתחתית המסך כל עוד ההירו לא
 * בתצוגה — כלומר גם כשמגיעים לסוף הדף. בגלילה מלאה כלפי מטה הוא צף בדיוק
 * מעל שורת הזכויות בפוטר ומכסה חלק מהטקסט ("...האפליקציה נמצאת בשלב בטא
 * סגורה..."). זו לא הייתה בעיית flex/grid בין אחים באותו מכולה — הכפתור
 * וטקסט הפוטר כלל לא נמצאים באותו הקשר פריסה — אלא חפיפה של שכבה קבועה
 * (fixed) מעל תוכן רגיל שממשיך לזרום מתחתיה. הפתרון: IntersectionObserver
 * שני שעוקב אחרי הפוטר, ומסתיר את הכפתור ברגע שהוא נכנס לתצוגה.
 */
export default function StickyCta() {
  const { t } = useLanguage();
  const [heroPassed, setHeroPassed] = useState(false);
  const [footerReached, setFooterReached] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const footer = document.getElementById("site-footer");
    if (!hero || !footer) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => setHeroPassed(!entry.isIntersecting),
      { threshold: 0 },
    );
    // מפעילים מוקדם קצת (rootMargin שלילי) כדי שהכפתור יתפנה עוד לפני
    // שהפוטר ממש נוגע בתחתית המסך, ולא רק ברגע שהחפיפה כבר קיימת.
    const footerObserver = new IntersectionObserver(
      ([entry]) => setFooterReached(entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );

    heroObserver.observe(hero);
    footerObserver.observe(footer);
    return () => {
      heroObserver.disconnect();
      footerObserver.disconnect();
    };
  }, []);

  const visible = heroPassed && !footerReached;

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
