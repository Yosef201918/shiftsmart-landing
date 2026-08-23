"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";
import Link from "next/link";

import { EASE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const STORAGE_KEY = "shiftsmart-cookie-consent";

/**
 * באנר הסכמת עוגיות. עוגן לפינה תחתונה (start, לא מרכז) כדי שלא יתנגש
 * עם כפתור StickyCta שממורכז בתחתית המסך — שני הבאנרים יכולים להיות
 * גלויים בו-זמנית בלי לחפוף.
 *
 * דפוס mount-guard: לפני שהאפקט הראשון רץ בצד הלקוח אין דרך לדעת אם
 * המשתמש כבר בחר בעבר (זה שמור ב-localStorage, לא נגיש בזמן רינדור
 * השרת) — ולכן מרנדרים null עד שהבדיקה בצד הלקוח מסתיימת, במקום לרנדר
 * את הבאנר תמיד ואז להסתיר אותו, מה שהיה גורם להבהוב (flash) בטעינה.
 */
export default function CookieConsent() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    setVisible(localStorage.getItem(STORAGE_KEY) === null);
  }, []);

  const choose = (value: "accepted" | "rejected") => {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: EASE }}
          /*
           * מוגבה ל-bottom-24 (ולא bottom-4) בכל הרוחבים בכוונה: כרטיס
           * פינתי ברוחב כרטיס (max-w-sm/md) עדיין תופס כמעט את כל רוחב
           * המסך במובייל, כך שהפרדה אופקית בלבד מ-StickyCta (הכפתור
           * הצף הממורכז) לא מספיקה — רק הפרדה אנכית קבועה מבטיחה שלעולם
           * לא תהיה חפיפה ביניהם, בכל רוחב מסך.
           */
          className="panel edge-lit fixed bottom-24 start-4 z-[60] w-[calc(100%-2rem)] max-w-sm rounded-2xl p-5 sm:max-w-md"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
          role="dialog"
          aria-live="polite"
          aria-label={t.cookieConsent.heading}
        >
          <div className="flex items-start gap-3">
            <span className="panel brackets flex size-10 shrink-0 items-center justify-center rounded-xl">
              <Cookie className="size-5 text-neon" strokeWidth={1.75} />
            </span>
            <div>
              <p className="font-display text-sm text-chalk">
                {t.cookieConsent.heading}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-mist">
                {t.cookieConsent.body}{" "}
                <Link
                  href="/privacy"
                  className="text-neon underline decoration-neon-deep underline-offset-4 transition duration-300 hover:text-neon-soft"
                >
                  {t.cookieConsent.privacyLinkLabel}
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => choose("accepted")}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-neon px-4 font-display text-sm text-[#021309] shadow-neon transition duration-300 hover:-translate-y-0.5 hover:bg-neon-soft"
            >
              {t.cookieConsent.acceptLabel}
            </button>
            <button
              type="button"
              onClick={() => choose("rejected")}
              className="panel inline-flex h-11 flex-1 items-center justify-center rounded-xl px-4 font-display text-sm text-chalk transition duration-300 hover:-translate-y-0.5 hover:border-neon-deep hover:text-neon"
            >
              {t.cookieConsent.rejectLabel}
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
