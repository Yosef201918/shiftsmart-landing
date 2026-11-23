"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Download, Sparkles, Smartphone } from "lucide-react";

import QuickStartSteps from "@/components/QuickStartSteps";
import DirectionalArrow from "@/components/DirectionalArrow";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ShareButton from "@/components/ShareButton";
import { EXTERNAL_LINK_PROPS, PLAY_STORE_URL } from "@/lib/links";
import { fadeUp, staggerContainer, VIEWPORT_ONCE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/*
 * שלב 16 — מדריך שלושת השלבים (QuickStartSteps) עבר לתוך ה-Hero עצמו, מיד מתחת
 * לכפתורי הפעולה: כותרת → פעולות → מדריך → אמון/אזהרה. כך המשתמש רואה את
 * הדרך להצטרפות בלי לגלול, במקום שהמדריך יישאר קבור במקטע נפרד למטה.
 * QuickStartSteps מוצג ברוחב מלא (מחוץ ל-max-w-3xl של טור הטקסט) כדי שהגריד בן
 * שלוש העמודות שלו יקבל את כל רוחב ה-Hero. מוקאפ הטלפון (PhoneShowcase)
 * ממשיך לשבת אחרי המדריך בסדר הדף הכללי — כלומר עדיין "מתחת למדריך".
 */
export default function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="hero"
      className="relative px-5 pb-20 pt-1 sm:px-8 sm:pt-4 lg:px-12 lg:pb-28 lg:pt-6"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* ---------- סרגל מותג ---------- */}
        <motion.header
          className="flex items-center justify-between gap-2 sm:gap-4"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <Image src="/icon-192.png" alt="" width={48} height={48} className="brand-app-icon size-10 rounded-[14px] sm:size-12" />
            <span className="whitespace-nowrap font-display text-sm tracking-wide text-chalk sm:text-lg">
              {t.brand.name}
            </span>
          </div>

          {/*
            במובייל חיווי הזמינות מופיע בפס העליון בלבד, כדי להשאיר מקום
            לשם האפליקציה ולמתג השפה גם ברוחב 320px.
          */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {/* חיווי נוסף בדסקטופ בלבד. */}
            <span className="hidden items-center gap-2 rounded-full border border-hair bg-abyss/70 px-3 py-1.5 text-xs text-mist sm:flex sm:px-3.5 sm:backdrop-blur-md">
              <span className="beacon size-1.5 rounded-full bg-neon" />
              <span className="hidden sm:inline">{t.brand.launchBadge}</span>
            </span>
          </div>
        </motion.header>

        {/* ---------- תוכן ההירו: כותרת ופעולות ---------- */}
        <div
          className="mt-4 max-w-3xl lg:mt-14"
        >
          <p
            className="flex items-center gap-2.5 text-sm text-neon-soft"
          >
            <Sparkles className="size-4 shrink-0" strokeWidth={1.75} />
            {t.hero.kicker}
          </p>

          {/* גודל כותרת קריא גם במובייל; השורות יכולות להישבר לפי רוחב המסך. */}
          <h1 id="main-content" tabIndex={-1} className="mt-4 scroll-mt-6 text-balance">
            <span className="block text-3xl font-extralight leading-tight tracking-tight text-chalk sm:text-4xl lg:text-5xl">
              {t.hero.titleLine1}
            </span>
            <span className="mt-1.5 block font-display text-3xl leading-tight text-neon sm:text-4xl lg:text-5xl">
              {t.hero.titleLine2}
            </span>
          </h1>

          <p
            className="mt-3 max-w-xl text-lg font-light leading-relaxed text-chalk/90 sm:text-xl"
          >
            {t.hero.subtitle}
          </p>

          {/*
            ---------- קבוצת הפעולות ----------
            כפתור יחיד של הורדה ישירה מ-Google Play, ברוחב מלא במובייל וברוחב תוכן בדסקטופ
            (בלי flex-row מיותר לילד בודד) — הזוהר והגודל שלו (h-14, shadow-
            neon) מספיקים כדי שלא "ייראה בודד" גם עם מרחב פנוי לצידו.
          */}
          <div className="mt-5">
            <a
              href={PLAY_STORE_URL}
              data-download-placement="hero"
              {...EXTERNAL_LINK_PROPS}
              className="group inline-flex h-14 w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-xl bg-neon px-7 font-display text-base text-[#021309] shadow-neon transition duration-300 hover:-translate-y-0.5 hover:bg-neon-soft hover:shadow-[0_0_40px_-4px_rgb(92_255_157/0.6)] sm:w-auto"
            >
              <Download className="size-5 shrink-0" strokeWidth={2.25} />
              {t.hero.downloadCta}
              <DirectionalArrow
                strokeWidth={2.25}
                className="size-5 shrink-0 transition-transform duration-300 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              />
            </a>
          </div>
        </div>

        <p className="mt-3 text-sm text-mist"><a href="#features" className="inline-flex min-h-11 items-center underline decoration-hair-lit underline-offset-4 hover:text-neon">{t.hero.planNote}</a></p>

        {/* ---------- מדריך שלושת השלבים — מיד מתחת לכפתורים, ברוחב מלא ---------- */}
        <QuickStartSteps />

        {/* ---------- אמון ואזהרה — מתחת למדריך ---------- */}
        <motion.div
          className="mt-8 max-w-3xl"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          {/* קהל היעד — רצועה עם מבטא ניאון בקצה הפנימי */}
          <motion.p
            className="max-w-lg border-s-2 border-neon-deep bg-abyss/40 py-3 ps-5 text-base leading-relaxed text-mist"
            variants={fadeUp}
          >
            {t.hero.audience}
          </motion.p>

          {/*
            כפתור השיתוף יושב כאן, מתחת למדריך, ולא בין הכפתורים לשלבים:
            הוא פעולה משנית, ולא רצינו שיידחוף את מדריך שלושת השלבים מתחת
            לקפל במובייל — בדיוק המאמץ שנעשה בשלב 16 לשמור אותו גלוי בלי
            גלילה. כאן, אחרי המדריך, אין לו שום עלות על אותו יעד.
          */}
          <motion.div className="mt-5" variants={fadeUp}>
            <ShareButton />
          </motion.div>

          {/* ---------- הערת פלטפורמה ---------- */}
          <motion.div
            className="mt-6 flex max-w-xl items-start gap-3 rounded-xl border border-hair bg-abyss/40 px-5 py-4"
            variants={fadeUp}
          >
            <Smartphone
              className="mt-0.5 size-5 shrink-0 text-neon"
              strokeWidth={1.9}
            />
            <p className="text-sm leading-relaxed text-mist">
              {t.hero.platformNotice}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

