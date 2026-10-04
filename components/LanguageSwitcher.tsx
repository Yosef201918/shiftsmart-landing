"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

const OPTION_BASE =
  "h-8 rounded-full px-3.5 text-xs font-medium transition-colors duration-200";
const OPTION_ACTIVE = "bg-raised text-chalk ring-1 ring-inset ring-hair-lit";
const OPTION_IDLE = "text-mist hover:text-chalk";

/**
 * מתג שפה כפול-מצב: שני תוויות קבועות ("עברית" / "English"), כשהבחירה הפעילה
 * מסומנת במשטח מוגבה ובמסגרת דקה — בלי צבע מבטא, כדי שהירוק יישמר לפעולה
 * הראשית. שני התוויות תמיד באותה שפה משלהן — שם שפה בגוף ראשון אינו זקוק
 * לתרגום.
 */
export default function LanguageSwitcher() {
  const { lang, t, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.languageSwitcher.groupAriaLabel}
      className="flex items-center gap-0.5 rounded-full border border-hair bg-panel p-0.5"
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
}
