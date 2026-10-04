"use client";

import Image from "next/image";

import { useLanguage } from "@/lib/i18n/LanguageContext";

const OPTION_BASE =
  "h-10 rounded-full px-4 text-xs font-semibold transition-colors duration-200 outline-db-accent focus-visible:outline-2 focus-visible:outline-offset-2";
const OPTION_ACTIVE = "bg-db-ivory text-db-ink";
const OPTION_IDLE = "text-db-muted hover:text-db-ivory";

/*
 * הסרגל העליון של כיוון B: במסכים רחבים שלוש משבצות — מתג השפה בצד ההתחלה,
 * המותג במרכז (כחתימה מעל הסמל), תגית ההשקה בצד הסיום. במובייל המותג בצד
 * ההתחלה ומתג השפה והתגית בצד הסיום, כמו בסרגל הרגיל, כדי לא להידחס.
 */
export default function TopBarB() {
  const { lang, t, setLang } = useLanguage();

  const brand = (
    <div className="flex items-center gap-2.5">
      <Image
        src="/icon-192.png"
        alt=""
        width={32}
        height={32}
        priority
        className="size-8 rounded-lg"
      />
      <span className="whitespace-nowrap text-lg font-bold tracking-tight">
        {t.brand.name}
      </span>
    </div>
  );

  const langSwitch = (
    <div
      role="group"
      aria-label={t.languageSwitcher.groupAriaLabel}
      className="flex items-center gap-0.5 rounded-full border border-db-line-strong p-0.5"
    >
      <button
        type="button"
        onClick={() => setLang("he")}
        aria-pressed={lang === "he"}
        className={`${OPTION_BASE} ${lang === "he" ? OPTION_ACTIVE : OPTION_IDLE}`}
      >
        {t.languageSwitcher.hebrewLabel}
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`${OPTION_BASE} ${lang === "en" ? OPTION_ACTIVE : OPTION_IDLE}`}
      >
        {t.languageSwitcher.englishLabel}
      </button>
    </div>
  );

  const badge = (
    <span className="flex items-center gap-2 text-xs text-db-muted">
      <span className="size-1.5 rounded-full bg-db-accent" />
      <span className="sr-only sm:not-sr-only">{t.brand.launchBadge}</span>
    </span>
  );

  return (
    <header className="py-4">
      {/* מובייל */}
      <div className="flex items-center justify-between gap-3 sm:hidden">
        {brand}
        <div className="flex items-center gap-3">
          {langSwitch}
          {badge}
        </div>
      </div>

      {/* sm ומעלה */}
      <div className="hidden grid-cols-3 items-center sm:grid">
        <div className="justify-self-start">{langSwitch}</div>
        <div className="justify-self-center">{brand}</div>
        <div className="justify-self-end">{badge}</div>
      </div>
    </header>
  );
}
