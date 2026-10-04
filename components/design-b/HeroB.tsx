"use client";

import Image from "next/image";
import { Check, Download, Share2, TriangleAlert } from "lucide-react";

import PhoneB from "@/components/design-b/PhoneB";
import StepsB from "@/components/design-b/StepsB";
import TopBarB from "@/components/design-b/TopBarB";
import { HERO_SCREENS } from "@/lib/designAssets";
import { EXTERNAL_LINK_PROPS, PLAY_STORE_URL } from "@/lib/links";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useShare } from "@/lib/useShare";

/*
 * כיוון B — "הסמל". הטענה: האפליקציה הזאת היא כלי של אמון — מי שמקליד בה את
 * השעות והשכר שלו מצפה לדייקנות. לכן הפתיחה היא הסמל עצמו (מגן + שעון עצר),
 * כותרת בסריף כבד וממורכזת כמו כותרת ראשית בעיתון, ומתחתיה שלושה מכשירים
 * אמיתיים — המרכזי גדול ובהיר, שני הצדדיים מוחשכים ומסתתרים מאחוריו — שנבלעים
 * בתחתית ברקע, בעוד כרטיס הנוכחות בצבע שנהב "עולה" מעליהם.
 */
export default function HeroB() {
  const { lang, t } = useLanguage();
  const screens = HERO_SCREENS[lang];
  const { copied, share, label } = useShare();

  return (
    <section className="relative isolate overflow-hidden pb-20 lg:pb-28">
      {/* אטמוספרה: לוח המעגלים של המותג בחיתוך מוכן מראש, מואר במרכז ונבלע בקצוות */}
      <Image
        src="/bg/hero-b.webp"
        alt=""
        aria-hidden="true"
        width={1600}
        height={1600}
        priority
        sizes="100vw"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-auto w-[max(100%,64rem)] max-w-none -translate-x-1/2 opacity-65"
      />

      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
        <TopBarB />

        {/* ---------- במה: סמל, כותרת ופעולה ---------- */}
        <div className="mx-auto max-w-4xl pt-8 text-center sm:pt-10 lg:pt-14">
          <div className="relative mx-auto size-[6.5rem] sm:size-36">
            {/* הילה ירוקה שקטה מאחורי הסמל — גרדיאנט סטטי, בלי טשטוש */}
            <div
              aria-hidden="true"
              className="absolute -inset-10 bg-[radial-gradient(closest-side,rgb(63_217_122/0.22),transparent)]"
            />
            <Image
              src="/icon-512.png"
              alt=""
              width={512}
              height={512}
              priority
              className="relative size-full rounded-[26%] ring-1 ring-db-accent/35"
            />
          </div>

          <p className="mt-7 text-base font-semibold text-db-accent sm:text-lg">
            {t.hero.kicker}
          </p>

          <h1 className="mt-3 text-balance font-db-display text-[clamp(2.4rem,1.5rem+5.2vw,5.25rem)] leading-[1.03] tracking-[-0.02em]">
            <span className="block font-medium">{t.hero.titleLine1}</span>
            <span className="mt-1 block font-black text-db-accent">
              {t.hero.titleLine2}
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-db-soft sm:text-xl">
            {t.hero.subtitle}
          </p>

          <a
            href={PLAY_STORE_URL}
            {...EXTERNAL_LINK_PROPS}
            className="mt-8 inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-db-accent px-10 text-base font-bold text-db-on-accent transition-[filter] duration-200 hover:brightness-110 sm:w-auto"
          >
            <Download className="size-5 shrink-0" strokeWidth={2.4} aria-hidden="true" />
            {t.hero.downloadCta}
          </a>
        </div>

        {/* ---------- שלושה מכשירים: מרכזי בהיר, צדדיים מוחשכים מאחוריו ---------- */}
        <div className="relative mx-auto mt-12 flex h-[31rem] max-w-[58rem] items-end justify-center overflow-hidden sm:mt-16 sm:h-[41rem] lg:h-[47rem] [mask-image:linear-gradient(to_bottom,#000_58%,transparent_95%)]">
          <PhoneB
            asset={screens.calendar}
            dim
            className="z-0 w-[10.5rem] translate-y-8 -me-10 sm:w-[14rem] sm:translate-y-12 sm:-me-14 lg:w-[16rem]"
          />
          <PhoneB
            asset={screens.home}
            priority
            className="z-10 w-[13.5rem] sm:w-[18rem] lg:w-[20rem]"
          />
          <PhoneB
            asset={screens.summary}
            dim
            className="z-0 w-[10.5rem] translate-y-8 -ms-10 sm:w-[14rem] sm:translate-y-12 sm:-ms-14 lg:w-[16rem]"
          />
        </div>

        {/* ---------- כרטיס נוכחות: מדריך שלושת השלבים ---------- */}
        <StepsB />

        {/* ---------- אמון, שיתוף ואזהרה ---------- */}
        <div className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-6 text-center">
          <p className="text-lg leading-relaxed text-db-soft">{t.hero.audience}</p>

          <button
            type="button"
            onClick={share}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-db-ivory/30 px-6 text-sm font-semibold transition-colors duration-200 hover:bg-db-ivory/10"
          >
            {copied ? (
              <Check className="size-4 text-db-accent" strokeWidth={2.4} aria-hidden="true" />
            ) : (
              <Share2 className="size-4" strokeWidth={2} aria-hidden="true" />
            )}
            {label}
          </button>

          <div className="flex items-start gap-3 rounded-2xl border border-db-amber/30 bg-db-amber/[0.06] px-5 py-3.5 text-start">
            <TriangleAlert
              className="mt-0.5 size-5 shrink-0 text-db-amber"
              strokeWidth={1.9}
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed text-db-amber">{t.hero.betaWarning}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
