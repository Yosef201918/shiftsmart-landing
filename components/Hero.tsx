"use client";

import { motion } from "framer-motion";
import {
  Clock4,
  Download,
  Sparkles,
  Star,
  TriangleAlert,
  Users,
} from "lucide-react";

import BetaSteps from "@/components/BetaSteps";
import DirectionalArrow from "@/components/DirectionalArrow";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  BETA_GROUP_URL,
  EXTERNAL_LINK_PROPS,
  PLAY_STORE_URL,
} from "@/lib/links";
import { fadeUp, staggerContainer, VIEWPORT_ONCE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const STARS = [0, 1, 2, 3, 4];

/*
 * שלב 16 — מדריך שלושת השלבים (BetaSteps) עבר לתוך ה-Hero עצמו, מיד מתחת
 * לכפתורי הפעולה: כותרת → פעולות → מדריך → אמון/אזהרה. כך המשתמש רואה את
 * הדרך להצטרפות בלי לגלול, במקום שהמדריך יישאר קבור במקטע נפרד למטה.
 * BetaSteps מוצג ברוחב מלא (מחוץ ל-max-w-3xl של טור הטקסט) כדי שהגריד בן
 * שלוש העמודות שלו יקבל את כל רוחב ה-Hero. מוקאפ הטלפון (PhoneShowcase)
 * ממשיך לשבת אחרי המדריך בסדר הדף הכללי — כלומר עדיין "מתחת למדריך".
 */
export default function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="hero"
      className="relative px-5 pb-20 pt-6 sm:px-8 lg:px-12 lg:pb-28"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* ---------- סרגל מותג ---------- */}
        <motion.header
          className="flex items-center justify-between gap-4"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-3">
            <span className="panel brackets flex size-11 items-center justify-center rounded-xl">
              <Clock4 className="size-5 text-neon" strokeWidth={1.75} />
            </span>
            <span className="font-display text-lg tracking-wide text-chalk">
              {t.brand.name}
            </span>
          </div>

          {/*
            קבוצת מתג השפה ותווית הבטא, יחד בקצה הנגדי למותג. במובייל
            תווית הבטא מציגה רק את הנקודה הירוקה כדי לפנות מקום למתג השפה —
            שלושת האלמנטים יחד היו נדחסים אל מתחת לרוחב 375px.
          */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <span className="flex items-center gap-2 rounded-full border border-hair bg-abyss/70 px-3 py-1.5 text-xs text-mist backdrop-blur-md sm:px-3.5">
              <span className="beacon size-1.5 rounded-full bg-neon" />
              <span className="hidden sm:inline">{t.brand.betaBadge}</span>
            </span>
          </div>
        </motion.header>

        {/* ---------- תוכן ההירו: כותרת ופעולות ---------- */}
        <motion.div
          className="mt-8 max-w-3xl lg:mt-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          <motion.p
            className="flex items-center gap-2.5 text-sm text-neon-soft"
            variants={fadeUp}
          >
            <Sparkles className="size-4 shrink-0" strokeWidth={1.75} />
            {t.hero.kicker}
          </motion.p>

          {/*
            שתי השורות באותו גודל בדיוק — ההיררכיה נוצרת ממשקל, מגופן ומצבע.
            במובייל הגודל הוא 1.75rem ולא text-3xl: ב-text-3xl השורה הראשונה
            נמדדה 324px בתוך מיכל של 335px, כלומר נשברה בכל מסך צר יותר.
            text-balance מחלק את השורות באופן שווה אם בכל זאת נדרשת שבירה.
          */}
          <motion.h1 className="mt-4 text-balance" variants={fadeUp}>
            <span className="block text-[1.75rem] font-extralight leading-tight tracking-tight text-chalk sm:text-4xl lg:text-5xl">
              {t.hero.titleLine1}
            </span>
            <span className="neon-glow mt-1.5 block font-display text-[1.75rem] leading-tight text-neon sm:text-4xl lg:text-5xl">
              {t.hero.titleLine2}
            </span>
          </motion.h1>

          <motion.p
            className="mt-4 max-w-xl text-lg font-light leading-relaxed text-chalk/90 sm:text-xl"
            variants={fadeUp}
          >
            {t.hero.subtitle}
          </motion.p>

          {/*
            ---------- קבוצת הפעולות ----------
            במובייל שני הכפתורים ברוחב מלא וזהה, כך שהם נקראים כזוג מאוזן.
            המשני מקבל רקע זכוכית ומסגרת כדי שייראה ככפתור ולא כטקסט.
          */}
          <motion.div
            className="mt-6 flex flex-col items-stretch gap-3.5 sm:flex-row sm:items-center sm:gap-4"
            variants={fadeUp}
          >
            <a
              href={PLAY_STORE_URL}
              {...EXTERNAL_LINK_PROPS}
              className="group inline-flex h-14 w-full shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-xl bg-neon px-7 font-display text-base text-[#021309] shadow-neon transition duration-300 hover:-translate-y-0.5 hover:bg-neon-soft hover:shadow-[0_0_40px_-4px_rgb(92_255_157/0.6)] sm:w-auto"
            >
              <Download className="size-5 shrink-0" strokeWidth={2.25} />
              {t.hero.downloadCta}
              <DirectionalArrow
                strokeWidth={2.25}
                className="size-5 shrink-0 transition-transform duration-300 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              />
            </a>

            <a
              href={BETA_GROUP_URL}
              {...EXTERNAL_LINK_PROPS}
              className="panel inline-flex h-14 w-full shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-xl px-7 font-display text-base text-chalk transition duration-300 hover:-translate-y-0.5 hover:border-neon-deep hover:text-neon sm:w-auto"
            >
              <Users className="size-5 shrink-0 text-neon" strokeWidth={1.75} />
              {t.hero.joinBetaCta}
            </a>
          </motion.div>
        </motion.div>

        {/* ---------- מדריך שלושת השלבים — מיד מתחת לכפתורים, ברוחב מלא ---------- */}
        <BetaSteps />

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

          {/* ---------- הוכחה חברתית ---------- */}
          <motion.div
            className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3.5"
            variants={fadeUp}
          >
            <span
              className="flex shrink-0 items-center gap-1"
              role="img"
              aria-label={t.hero.starsAriaLabel}
            >
              {STARS.map((star) => (
                <Star
                  key={star}
                  className="size-4 fill-amber text-amber"
                  strokeWidth={1.5}
                />
              ))}
            </span>
            <p className="max-w-lg text-sm leading-relaxed text-mist">
              {t.hero.socialProof}
            </p>
          </motion.div>

          {/* ---------- אזהרת פלטפורמה ובטא ---------- */}
          <motion.div
            className="mt-6 flex max-w-xl items-start gap-3 rounded-xl border border-amber-deep bg-amber/[0.06] px-5 py-4"
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
