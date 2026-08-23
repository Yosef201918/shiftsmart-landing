"use client";

import DirectionalArrow from "@/components/DirectionalArrow";
import { BETA_GROUP_URL, EXTERNAL_LINK_PROPS } from "@/lib/links";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/**
 * רצועת הכרזה דקה מעל ה-Hero: "בטא פתוחה בקרוב". תוכן נפרד מ-t.brand.betaBadge
 * ו-t.hero.betaWarning (המצב הנוכחי — בטא סגורה) — זו הודעה תוספתית על מה
 * שמגיע בעתיד, לא תחליף להם.
 *
 * ממוקמת מחוץ ל-<section id="hero"> ב-app/page.tsx, לא בתוכו: כך היא לא
 * נספרת בתוך גובה ה-Hero שנמדד בקפידה כדי ש-BetaSteps יישאר גלוי בלי גלילה
 * במובייל 375×812 (ראו PROJECT_MEMORY.md) — כל שורה אחת בגובה קבוע ולא
 * מונפשת, כדי לצמצם למינימום את התוספת לגובה הדף.
 */
export default function OpenBetaBanner() {
  const { t } = useLanguage();

  return (
    <div className="relative z-20 border-b border-hair bg-abyss/80 backdrop-blur-md">
      <a
        href={BETA_GROUP_URL}
        {...EXTERNAL_LINK_PROPS}
        className="group mx-auto flex w-full max-w-6xl items-center justify-center gap-2 px-5 py-1 text-center text-[0.7rem] text-mist transition duration-300 hover:text-neon sm:gap-2.5 sm:px-8 sm:py-2 sm:text-xs lg:px-12"
      >
        <span className="beacon size-1.5 shrink-0 rounded-full bg-neon" />
        <span className="truncate">{t.openBetaBanner.message}</span>
        <span className="inline-flex shrink-0 items-center gap-1 font-display text-neon">
          {t.openBetaBanner.ctaLabel}
          <DirectionalArrow
            strokeWidth={2.25}
            className="size-3.5 shrink-0 transition-transform duration-300 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
          />
        </span>
      </a>
    </div>
  );
}
