"use client";

import Image from "next/image";

import { useLanguage } from "@/lib/i18n/LanguageContext";

const TOGGLE_BASE =
  "h-11 px-2.5 text-sm transition-colors duration-200 underline-offset-[7px] decoration-2 outline-da-accent focus-visible:outline-2 focus-visible:outline-offset-2";
const TOGGLE_ACTIVE = "font-medium text-da-text underline decoration-da-accent";
const TOGGLE_IDLE = "text-da-muted hover:text-da-text";

/*
 * הסרגל העליון של כיוון A: סמל האפליקציה האמיתי (לא אייקון גנרי), שם המותג,
 * מתג שפה כטקסט בלבד (הפעיל מסומן בקו תחתון ירוק) ותגית ההשקה. קו דק מפריד
 * אותו מהתוכן. במובייל התגית מציגה רק את הנקודה כדי לפנות מקום.
 */
export default function TopBarA() {
  const { lang, t, setLang } = useLanguage();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-da-line py-3.5">
      <div className="flex items-center gap-3">
        <Image
          src="/icon-192.png"
          alt=""
          width={36}
          height={36}
          priority
          className="size-9 rounded-[0.6rem]"
        />
        <span className="whitespace-nowrap text-lg font-semibold tracking-tight">
          {t.brand.name}
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div
          role="group"
          aria-label={t.languageSwitcher.groupAriaLabel}
          className="flex items-center"
        >
          <button
            type="button"
            onClick={() => setLang("he")}
            aria-pressed={lang === "he"}
            className={`${TOGGLE_BASE} ${lang === "he" ? TOGGLE_ACTIVE : TOGGLE_IDLE}`}
          >
            {t.languageSwitcher.hebrewLabel}
          </button>
          <span aria-hidden="true" className="px-0.5 text-da-line-strong">
            /
          </span>
          <button
            type="button"
            onClick={() => setLang("en")}
            aria-pressed={lang === "en"}
            className={`${TOGGLE_BASE} ${lang === "en" ? TOGGLE_ACTIVE : TOGGLE_IDLE}`}
          >
            {t.languageSwitcher.englishLabel}
          </button>
        </div>

        <span className="flex items-center gap-2 rounded-full border border-da-line px-3 py-1.5 text-xs text-da-muted">
          <span className="size-1.5 rounded-full bg-da-accent" />
          <span className="sr-only sm:not-sr-only">{t.brand.launchBadge}</span>
        </span>
      </div>
    </header>
  );
}
