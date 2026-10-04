"use client";

import { motion } from "framer-motion";
import { Clock4, Download, TriangleAlert } from "lucide-react";

import BetaSteps from "@/components/BetaSteps";
import DirectionalArrow from "@/components/DirectionalArrow";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ShareButton from "@/components/ShareButton";
import { EXTERNAL_LINK_PROPS, PLAY_STORE_URL } from "@/lib/links";
import { fadeUp, staggerContainer, VIEWPORT_ONCE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/*
 * שלב 16 — מדריך שלושת השלבים (BetaSteps) עבר לתוך ה-Hero עצמו, מיד מתחת
 * לכפתור הפעולה: כותרת → פעולה → מדריך → אמון/אזהרה. כך המשתמש רואה את
 * הדרך להצטרפות בלי לגלול. BetaSteps מוצג ברוחב מלא (מחוץ ל-max-w-3xl של טור
 * הטקסט) כדי שהמדריך יקבל את כל רוחב ה-Hero. מוקאפ הטלפון (PhoneShowcase)
 * ממשיך לשבת אחרי המדריך בסדר הדף הכללי.
 *
 * עיצוב מחדש: היררכיה טיפוגרפית נקייה (שורה ראשונה דקה, שנייה במבטא), כפתור
 * ראשי יחיד כמשטח ירוק מלא, ושאר האלמנטים בקווי מתאר ובגוני אפור בלבד.
 * הסדר, הטקסטים והגובה במובייל 375×812 נשמרו — המדריך נשאר גלוי בלי גלילה.
 */
export default function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="hero"
      className="relative px-5 pb-16 pt-1 sm:px-8 sm:pt-4 lg:px-12 lg:pb-24 lg:pt-6"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* ---------- סרגל מותג ---------- */}
        <motion.header
          className="flex items-center justify-between gap-4 py-1 sm:py-2"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-control border border-hair bg-panel">
              <Clock4 className="size-5 text-neon" strokeWidth={1.75} />
            </span>
            <span className="whitespace-nowrap text-lg font-semibold tracking-tight text-chalk">
              {t.brand.name}
            </span>
          </div>

          {/*
            קבוצת מתג השפה ותווית ההשקה, יחד בקצה הנגדי למותג. במובייל
            התווית מציגה רק את הנקודה הירוקה כדי לפנות מקום למתג השפה —
            שלושת האלמנטים יחד היו נדחסים אל מתחת לרוחב 375px.
          */}
          <div className="flex items-center gap-2.5">
            <LanguageSwitcher />
            <span className="badge">
              <span className="beacon size-1.5 rounded-full bg-neon" />
              {/* t.brand.betaBadge שונה ל-t.brand.launchBadge: "בטא פתוחה" הוחלף ב"ההשקה בקרוב" לבקשת המוצר */}
              <span className="hidden sm:inline">{t.brand.launchBadge}</span>
            </span>
          </div>
        </motion.header>

        {/* ---------- תוכן ההירו: כותרת ופעולה ---------- */}
        <motion.div
          className="mt-4 max-w-3xl sm:mt-6 lg:mt-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          <motion.p className="eyebrow" variants={fadeUp}>
            {t.hero.kicker}
          </motion.p>

          {/*
            היררכיה נבנית ממשקל וצבע, לא מגודל: שתי השורות באותו גודל
            (text-display, סקאלה רספונסיבית מ-globals.css) — הראשונה דקה
            וניטרלית, השנייה במשקל מלא ובצבע המבטא. text-balance (דרך כלל
            ה-h1 הבסיסי) מחלק שורות שנשברות באופן שווה.
          */}
          <motion.h1 className="mt-3 text-display sm:mt-4" variants={fadeUp}>
            <span className="block font-light text-chalk">
              {t.hero.titleLine1}
            </span>
            <span className="mt-1 block font-semibold text-neon">
              {t.hero.titleLine2}
            </span>
          </motion.h1>

          <motion.p
            className="mt-3 max-w-xl text-lead text-silver sm:mt-4"
            variants={fadeUp}
          >
            {t.hero.subtitle}
          </motion.p>

          {/*
            ---------- פעולה ראשית ----------
            שלב 43: הבטא עברה מסגורה לפתוחה, ולכן הוסר כפתור "הצטרפו לבטא
            הסגורה" המשני — אין יותר קבוצת בודקים להצטרף אליה, רק הורדה
            ישירה. כפתור יחיד, ברוחב מלא במובייל וברוחב תוכן בדסקטופ.
          */}
          <motion.div className="mt-5 sm:mt-6" variants={fadeUp}>
            <a
              href={PLAY_STORE_URL}
              {...EXTERNAL_LINK_PROPS}
              className="btn btn-primary group h-12 w-full px-6 text-base sm:h-14 sm:w-auto sm:px-8"
            >
              <Download className="size-5 shrink-0" strokeWidth={2.25} />
              {t.hero.downloadCta}
              <DirectionalArrow
                strokeWidth={2.25}
                className="size-5 shrink-0 transition-transform duration-300 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              />
            </a>
          </motion.div>
        </motion.div>

        {/* ---------- מדריך שלושת השלבים — מיד מתחת לכפתור, ברוחב מלא ---------- */}
        <BetaSteps />

        {/* ---------- אמון ואזהרה — מתחת למדריך ---------- */}
        <motion.div
          className="mt-8 max-w-3xl"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          {/* קהל היעד — קו מתאר דק בקצה הפנימי */}
          <motion.p
            className="max-w-lg border-s border-hair-lit ps-4 text-base leading-relaxed text-mist"
            variants={fadeUp}
          >
            {t.hero.audience}
          </motion.p>

          {/*
            כפתור השיתוף יושב כאן, מתחת למדריך, ולא בין הכפתור לשלבים:
            הוא פעולה משנית, ולא רצינו שיידחוף את מדריך שלושת השלבים מתחת
            לקפל במובייל — בדיוק המאמץ שנעשה בשלב 16 לשמור אותו גלוי בלי
            גלילה. כאן, אחרי המדריך, אין לו שום עלות על אותו יעד.
          */}
          <motion.div className="mt-5" variants={fadeUp}>
            <ShareButton />
          </motion.div>

          {/* ---------- אזהרת פלטפורמה ובטא ---------- */}
          <motion.div
            className="mt-6 flex max-w-xl items-start gap-3 rounded-card border border-amber/25 bg-amber/[0.05] px-4 py-3.5"
            variants={fadeUp}
          >
            <TriangleAlert
              className="mt-0.5 size-5 shrink-0 text-amber"
              strokeWidth={1.9}
            />
            <p className="text-sm leading-relaxed text-amber-soft">
              {t.hero.betaWarning}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
