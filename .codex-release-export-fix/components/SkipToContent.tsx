"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function SkipToContent() {
  const { lang } = useLanguage();

  return (
    <a
      href="#main-content"
      className="skip-to-content"
      onClick={() => document.getElementById("main-content")?.focus({ preventScroll: true })}
    >
      {lang === "he" ? "דילוג לתוכן הראשי" : "Skip to main content"}
    </a>
  );
}
