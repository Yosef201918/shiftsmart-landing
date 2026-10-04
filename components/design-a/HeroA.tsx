"use client";

import Image from "next/image";
import { Download, Share2, Check, TriangleAlert } from "lucide-react";

import PhoneA from "@/components/design-a/PhoneA";
import StepsA from "@/components/design-a/StepsA";
import TopBarA from "@/components/design-a/TopBarA";
import { HERO_SCREENS } from "@/lib/designAssets";
import { EXTERNAL_LINK_PROPS, PLAY_STORE_URL } from "@/lib/links";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useShare } from "@/lib/useShare";

/*
 * כיוון A — "חדר בקרה". הטענה: אפליקציה שמראה לך את המשמרת שלך כמו מכשיר
 * מדידה — שעה, צבירה, יעד — ולכן הפתיחה היא המוצר עצמו: מסך הטיימר האמיתי
 * במכשיר גדול, וכרטיס הרווחות האמיתי מהמסך השני כווידג'ט שתוחם אותו.
 *
 * עמוד השדרה: פריסה אסימטרית (7/5) — טקסט בצד ההתחלה, שלב הצגה בצד הסיום.
 * שלב ההצגה הוא לוח עמוק מרובד עם תמונת לוח המעגלים של המותג בחיתוך מוגבר,
 * והמכשיר "שובר" את המסגרת התחתונה שלו. הכל בלוגיקה פיזית-לוגית (start/end),
 * ולכן הפריסה מתהפכת נכון בין עברית לאנגלית.
 */
export default function HeroA() {
  const { lang, t } = useLanguage();
  const screens = HERO_SCREENS[lang];
  const { copied, share, label } = useShare();

  return (
    <section className="relative isolate overflow-hidden">
      {/* אטמוספרה: לוח המעגלים של המותג, בחיתוך מוכן מראש (ללא פילטרים בזמן ריצה) */}
      <Image
        src="/bg/hero-a.webp"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-top opacity-45"
      />

      <div className="mx-auto w-full max-w-[80rem] px-5 sm:px-8 lg:px-12">
        <TopBarA />

        <div className="grid items-center gap-12 pt-10 lg:grid-cols-12 lg:gap-8 lg:pt-20">
          {/* ---------- טקסט ופעולה ---------- */}
          <div className="lg:col-span-7">
            <p className="text-sm font-medium text-da-accent sm:text-base">
              {t.hero.kicker}
            </p>

            <h1 className="mt-4 text-balance text-[clamp(2.1rem,1.2rem+4.4vw,4.5rem)] leading-[1.04] tracking-[-0.025em]">
              <span className="block font-light">{t.hero.titleLine1}</span>
              <span className="mt-1 block font-bold text-da-accent">
                {t.hero.titleLine2}
              </span>
            </h1>

            <p className="mt-5 max-w-[34rem] text-lg leading-relaxed text-da-muted sm:text-xl">
              {t.hero.subtitle}
            </p>

            <a
              href={PLAY_STORE_URL}
              {...EXTERNAL_LINK_PROPS}
              className="mt-8 inline-flex h-14 w-full items-center justify-center gap-3 rounded-[0.7rem] bg-da-accent px-8 text-base font-semibold text-da-on-accent transition-[filter] duration-200 hover:brightness-110 sm:w-auto"
            >
              <Download className="size-5 shrink-0" strokeWidth={2.25} aria-hidden="true" />
              {t.hero.downloadCta}
            </a>
          </div>

          {/* ---------- שלב ההצגה ---------- */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto h-[29rem] w-full max-w-[26rem] sm:h-[34rem] sm:max-w-[30rem] lg:h-[40rem] lg:max-w-none">
              {/* לוח אחורי: משטח עמוק + לוח המעגלים בחיתוך מוגבר + הילה ירוקה שקטה */}
              <div className="absolute inset-x-0 bottom-10 top-0 overflow-hidden rounded-[1.75rem] border border-da-line bg-gradient-to-b from-da-surface-2 to-da-surface sm:bottom-12">
                <Image
                  src="/bg/hero-a.webp"
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(min-width: 1024px) 34rem, 100vw"
                  className="object-cover object-center opacity-70"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_42%,rgb(114_230_166/0.14),transparent_70%)]"
                />
              </div>

              {/* המכשיר: יושב במרכז הלוח ושובר את הקצה התחתון שלו */}
              <PhoneA
                asset={screens.home}
                priority
                className="absolute bottom-0 left-1/2 w-[15.5rem] -translate-x-1/2 sm:w-[18rem] lg:w-[19.5rem]"
              />

              {/* ווידג'ט הרווחות: חיתוך אמיתי ממסך הסיכום, תלוי על קצה ההתחלה של הלוח */}
              <div
                className="absolute -start-4 bottom-24 w-[9.75rem] overflow-hidden rounded-2xl border border-da-line-strong bg-da-surface shadow-[0_26px_44px_-20px_rgb(0_0_0/0.9)] sm:-start-10 sm:bottom-28 sm:w-[13rem] lg:-start-32 lg:bottom-28 lg:w-[15.5rem]"
                style={{ aspectRatio: screens.summaryTile.aspect }}
              >
                <Image
                  src={screens.summary.src}
                  alt={screens.summary.alt}
                  width={screens.summary.width}
                  height={screens.summary.height}
                  sizes="(min-width: 1024px) 15.5rem, 14rem"
                  className="h-auto w-full"
                  style={{ transform: `translateY(-${screens.summaryTile.offsetPct}%)` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ---------- מדריך שלושת השלבים ---------- */}
        <StepsA />

        {/* ---------- אמון, שיתוף ואזהרה ---------- */}
        <div className="mt-16 grid gap-8 pb-20 lg:mt-20 lg:grid-cols-12 lg:items-start lg:gap-10 lg:pb-28">
          <p className="border-s border-da-line-strong ps-5 text-lg leading-relaxed text-da-text/85 lg:col-span-5">
            {t.hero.audience}
          </p>

          <div className="lg:col-span-3">
            <button
              type="button"
              onClick={share}
              className="inline-flex h-11 items-center gap-2 rounded-[0.6rem] border border-da-line-strong px-5 text-sm font-medium transition-colors duration-200 hover:bg-da-surface-2"
            >
              {copied ? (
                <Check className="size-4 text-da-accent" strokeWidth={2.25} aria-hidden="true" />
              ) : (
                <Share2 className="size-4 text-da-muted" strokeWidth={1.9} aria-hidden="true" />
              )}
              {label}
            </button>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-da-amber/30 bg-da-amber/[0.06] px-4 py-3.5 lg:col-span-4">
            <TriangleAlert
              className="mt-0.5 size-5 shrink-0 text-da-amber"
              strokeWidth={1.9}
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed text-da-amber">{t.hero.betaWarning}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
