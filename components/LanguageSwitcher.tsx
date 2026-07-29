"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

/**
 * מתג שפה כפול-מצב בסגנון זכוכית: שני תוויות קבועות ("עברית" / "English"),
 * עם גלולת ניאון על הבחירה הפעילה. שני התוויות תמיד באותה שפה משלהן —
 * שם שפה בגוף ראשון אינו זקוק לתרגום.
 */
export default function LanguageSwitcher() {
  const { lang, t, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.languageSwitcher.groupAriaLabel}
      className="panel flex items-center gap-0.5 rounded-full p-1 text-xs"
    >
      <button
        type="button"
        onClick={() => setLang("he")}
        aria-pressed={lang === "he"}
        className={`rounded-full px-3 py-1.5 font-medium transition duration-300 ${
          lang === "he"
            ? "bg-neon text-[#021309] shadow-neon"
            : "text-mist hover:text-chalk"
        }`}
      >
        {t.languageSwitcher.hebrewLabel}
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`rounded-full px-3 py-1.5 font-medium transition duration-300 ${
          lang === "en"
            ? "bg-neon text-[#021309] shadow-neon"
            : "text-mist hover:text-chalk"
        }`}
      >
        {t.languageSwitcher.englishLabel}
      </button>
    </div>
  );
}
