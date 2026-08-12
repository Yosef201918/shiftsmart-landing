"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { fadeScale, VIEWPORT_ONCE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/*
 * שלב 25 — פוסטר המותג הרשמי (ICON.jpg): לוגו + סלוגן שכבר צרובים בתוך
 * התמונה עצמה, לכן אין כאן טקסט חופף מעליה — רק כותרת קצרה שממסגרת אותה.
 * מוצג במקטע עצמאי מיד מתחת ל-Hero (לא בתוכו) כדי לא לפגוע במאמץ שנעשה
 * בשלב 16 לשמור את מדריך שלושת השלבים גלוי בלי גלילה במובייל.
 *
 * width/height תואמים בדיוק לממדי הקובץ בפועל (768×1376) כדי ש-Next.js
 * ידע לשריין את השטח מראש ולא תהיה קפיצת פריסה (CLS) בזמן טעינת התמונה.
 */
export default function AppPoster() {
  const { t } = useLanguage();

  return (
    <section className="relative scroll-mt-16 px-5 pb-28 sm:px-8 lg:px-12 lg:pb-40">
      <motion.div
        className="mx-auto flex w-full max-w-6xl flex-col items-center text-center"
        variants={fadeScale}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
      >
        <p className="font-mono text-xs tracking-[0.3em] text-neon-deep">
          {t.appPoster.kicker}
        </p>
        <h2 className="mt-4 max-w-xl text-3xl font-extralight leading-tight text-chalk sm:text-4xl">
          {t.appPoster.titlePrefix}
          <span className="font-display font-normal text-neon">
            {t.appPoster.titleHighlight}
          </span>
        </h2>

        {/*
          שלב 27: הוסרה מסגרת הזכוכית (panel edge-lit) וההילה שעטפו את
          התמונה — נראו כמו שלדת מכשיר מזויפת. הפוסטר עצמו כבר מעוצב
          ומוכן, ולכן מוצג נקי לגמרי: רק פינות מעוגלות וצל ירוק עדין.
        */}
        <div className="mt-10 w-full max-w-[280px] sm:max-w-xs">
          <Image
            src="/ICON.jpg"
            alt={t.appPoster.imageAlt}
            width={768}
            height={1376}
            sizes="(min-width: 640px) 320px, 280px"
            className="h-auto w-full rounded-3xl shadow-2xl shadow-green-500/10"
          />
        </div>
      </motion.div>
    </section>
  );
}
