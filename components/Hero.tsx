"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock4,
  Download,
  Sparkles,
  Star,
  TriangleAlert,
  Users,
} from "lucide-react";

import {
  BETA_GROUP_URL,
  EXTERNAL_LINK_PROPS,
  PLAY_STORE_URL,
} from "@/lib/links";
import {
  fadeScale,
  fadeUp,
  staggerContainer,
  VIEWPORT_ONCE,
} from "@/lib/motion";

const STARS = [0, 1, 2, 3, 4];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative px-5 pb-24 pt-8 sm:px-8 lg:px-12 lg:pb-32"
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
              Shift Smart
            </span>
          </div>

          <span className="flex items-center gap-2 rounded-full border border-hair bg-abyss/70 px-3.5 py-1.5 text-xs text-mist backdrop-blur-md">
            <span className="beacon size-1.5 rounded-full bg-neon" />
            בטא סגורה
          </span>
        </motion.header>

        {/*
          פריסה א-סימטרית: עמודת הטקסט רחבה יותר ומוסטת כלפי מעלה,
          והמכשיר יושב נמוך יותר ובזווית. במובייל המרווח בין הטקסט למכשיר
          גדול במיוחד כדי שהבלוקים לא ייראו דבוקים זה לזה.
        */}
        <div className="mt-14 grid gap-24 sm:gap-28 lg:mt-20 lg:grid-cols-12 lg:items-start lg:gap-8">
          {/* ---------- עמודת הטקסט ---------- */}
          <motion.div
            className="lg:col-span-7 lg:pt-6"
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
              Shift Smart - ניהול משמרות ברמה אחרת!
            </motion.p>

            {/*
              שתי השורות באותו גודל בדיוק — ההיררכיה נוצרת ממשקל, מגופן ומצבע.
              במובייל הגודל הוא 1.75rem ולא text-3xl: ב-text-3xl השורה הראשונה
              נמדדה 324px בתוך מיכל של 335px, כלומר נשברה בכל מסך צר יותר.
              text-balance מחלק את השורות באופן שווה אם בכל זאת נדרשת שבירה.
            */}
            <motion.h1 className="mt-6 text-balance" variants={fadeUp}>
              <span className="block text-[1.75rem] font-extralight leading-tight tracking-tight text-chalk sm:text-4xl lg:text-5xl">
                קורעים את התחת במשמרות?
              </span>
              <span className="neon-glow mt-1.5 block font-display text-[1.75rem] leading-tight text-neon sm:text-4xl lg:text-5xl">
                מצאתי לכם את הפתרון!
              </span>
            </motion.h1>

            <motion.p
              className="mt-6 max-w-xl text-lg font-light leading-relaxed text-chalk/90 sm:text-xl"
              variants={fadeUp}
            >
              שעון הנוכחות שיעשה לכם סדר בשעות ובשכר.
            </motion.p>

            {/* קהל היעד — רצועה עם מבטא ניאון בקצה הפנימי */}
            <motion.p
              className="mt-6 max-w-lg border-s-2 border-neon-deep bg-abyss/40 py-3 ps-5 text-base leading-relaxed text-mist"
              variants={fadeUp}
            >
              מושלם למאבטחים סדרנים, מסעדות וכל מי שחי על משמרות.
            </motion.p>

            {/*
              ---------- קבוצת הפעולות ----------
              במובייל שני הכפתורים ברוחב מלא וזהה, כך שהם נקראים כזוג מאוזן.
              המשני מקבל רקע זכוכית ומסגרת כדי שייראה ככפתור ולא כטקסט.
            */}
            <motion.div
              className="mt-9 flex flex-col items-stretch gap-3.5 sm:flex-row sm:items-center sm:gap-4"
              variants={fadeUp}
            >
              <a
                href={PLAY_STORE_URL}
                {...EXTERNAL_LINK_PROPS}
                className="group inline-flex h-14 w-full shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-xl bg-neon px-7 font-display text-base text-[#021309] shadow-neon transition duration-300 hover:-translate-y-0.5 hover:bg-neon-soft hover:shadow-[0_0_40px_-4px_rgb(92_255_157/0.6)] sm:w-auto"
              >
                <Download className="size-5 shrink-0" strokeWidth={2.25} />
                הורדה מ-Google Play
                <ArrowLeft
                  className="size-5 shrink-0 transition-transform duration-300 group-hover:-translate-x-1"
                  strokeWidth={2.25}
                />
              </a>

              <a
                href={BETA_GROUP_URL}
                {...EXTERNAL_LINK_PROPS}
                className="panel inline-flex h-14 w-full shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-xl px-7 font-display text-base text-chalk transition duration-300 hover:-translate-y-0.5 hover:border-neon-deep hover:text-neon sm:w-auto"
              >
                <Users className="size-5 shrink-0 text-neon" strokeWidth={1.75} />
                הצטרפו לבטא הסגורה
              </a>
            </motion.div>

            {/* ---------- הוכחה חברתית ---------- */}
            <motion.div
              className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3.5"
              variants={fadeUp}
            >
              <span
                className="flex shrink-0 items-center gap-1"
                role="img"
                aria-label="חמישה כוכבים"
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
                הצטרפו למאבטחים, סדרנים ומנהלי משמרות שכבר מנהלים את הזמן שלהם
                חכם.
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
                שימו לב: זמין למכשירי אנדרואיד בלבד. אנחנו בגרסת בטא (Beta) –
                משתפרים כל הזמן!
              </p>
            </motion.div>
          </motion.div>

          {/* ---------- מוקאפ הטלפון ---------- */}
          <motion.div
            className="lg:col-span-5 lg:pt-16"
            variants={fadeScale}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
          >
            {/*
              הטיה קלה שמתיישרת במעבר עכבר. ההטיה יושבת על אלמנט פנימי ולא על
              אלמנט ה-motion, כדי ששני ה-transform לא ידרסו זה את זה.
            */}
            <div className="relative mx-auto w-fit transition-transform duration-700 ease-out lg:-rotate-3 lg:hover:rotate-0">
              {/* הילת ניאון שמרימה את המכשיר מהרקע */}
              <div
                aria-hidden="true"
                className="absolute -inset-12 rounded-full bg-[radial-gradient(circle,rgba(92,255,157,0.2),transparent_62%)] blur-3xl"
              />

              {/* שלדת המכשיר */}
              <div className="relative w-[264px] rounded-[2.6rem] border border-hair-lit/60 bg-gradient-to-b from-[#1a2532] via-[#0b121c] to-[#070c14] p-[10px] shadow-device sm:w-[288px]">
                {/* כפתורי צד */}
                <span
                  aria-hidden="true"
                  className="absolute -left-[3px] top-[112px] h-14 w-[3px] rounded-s-full bg-hair-lit"
                />
                <span
                  aria-hidden="true"
                  className="absolute -left-[3px] top-[178px] h-9 w-[3px] rounded-s-full bg-hair-lit"
                />
                <span
                  aria-hidden="true"
                  className="absolute -right-[3px] top-[140px] h-20 w-[3px] rounded-e-full bg-hair-lit"
                />

                {/* המסך — נשאר נקי לגמרי, בלי אלמנטים צפים מעליו */}
                <div className="relative overflow-hidden rounded-[2.05rem] bg-void">
                  <Image
                    src="/mockup-v2.png"
                    alt="מסך שעון הנוכחות באפליקציית Shift Smart: משמרת פעילה עם טיימר רץ, תעריף לשעה וצבירה מצטברת במשמרת"
                    width={380}
                    height={757}
                    priority
                    sizes="(min-width: 640px) 268px, 244px"
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
