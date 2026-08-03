"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Megaphone, Send, X } from "lucide-react";

import { CONTACT_EMAIL } from "@/lib/links";
import { EASE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/*
 * כפתור פעולה צף (FAB) לפידבק על הבטא, פינה קבועה בתחתית המסך.
 *
 * מיקום: bottom-24 ולא bottom-6 — כדי לא לחפוף את ה-StickyCta (רצועה
 * קבועה בתחתית שמופיעה אחרי שההירו יוצא מהתצוגה). ה-StickyCta גובהה
 * כ-56px פלוס ריפוד ו-safe-area, כך ש-bottom-24 (96px) משאיר מרווח בטוח
 * מעליה בלי תלות בגובה מדויק או בלוגיקת הצגה/הסתרה משותפת בין הרכיבים.
 *
 * המודאל בנוי כטופס mailto: השדות מרכיבים כתובת mailto דינמית עם נושא
 * וגוף מקודדים, ופתיחתה מפעילה את אפליקציית המייל של המשתמש עם טיוטה
 * מוכנה — בלי צורך בשרת/backend. זו אותה שיטה שכבר קיימת בפוטר
 * (CONTACT_MAILTO), רק עם תוכן דינמי מהטופס.
 */
export default function FeedbackFab() {
  const { t, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) return;

    const body = name.trim() ? `${name.trim()}\n\n${message.trim()}` : message.trim();
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      t.feedback.mailSubject,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
    setIsOpen(false);
    setName("");
    setMessage("");
  };

  return (
    <>
      {/* ---------- כפתור צף ---------- */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={t.feedback.fabAriaLabel}
        aria-haspopup="dialog"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.6 }}
        whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
        whileTap={{ scale: 0.94 }}
        className="panel edge-lit fixed bottom-24 end-5 z-40 flex size-14 items-center justify-center rounded-full text-neon shadow-neon sm:end-6"
      >
        <Megaphone className="size-6" strokeWidth={1.75} />
      </motion.button>

      {/*
        ---------- מודאל הפידבק ----------
        המעטפת החיצונית הזו תמיד מורכבת (לא מותנית ב-isOpen): היא רק שכבת
        מיקום שקופה בלי אנימציה משלה. שני האלמנטים המונפשים (התריס והדיאלוג)
        הם ילדים ישירים-אחים של AnimatePresence, לא מקוננים זה בזה — כשילד
        מונפש אחד מקונן בתוך ילד מונפש אחר שהוא הילד היחיד של AnimatePresence,
        מעקב היציאה (exit) נתקע והאלמנט נשאר ב-DOM עם opacity:0 לנצח בלי
        להיעלם. מבנה "אחים" הוא התבנית המתועדת והתקינה של framer-motion
        לדיאלוגים עם תריס+פאנל.
      */}
      <div
        className={`fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-5 ${
          isOpen ? "" : "pointer-events-none"
        }`}
      >
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              key="feedback-backdrop"
              aria-hidden="true"
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-void/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
            />
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen ? (
            <motion.div
              key="feedback-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              dir={dir}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="panel edge-lit relative w-full max-w-md rounded-t-3xl p-6 sm:rounded-3xl sm:p-8"
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={t.feedback.closeAria}
                className="absolute end-5 top-5 flex size-9 items-center justify-center rounded-full border border-hair text-mist transition duration-300 hover:border-neon-deep hover:text-neon"
              >
                <X className="size-4" strokeWidth={1.9} />
              </button>

              <span className="panel flex size-12 items-center justify-center rounded-2xl border-neon-deep/70 bg-neon/[0.08]">
                <Megaphone className="size-5 text-neon" strokeWidth={1.75} />
              </span>

              <h2
                id={titleId}
                className="mt-5 pe-10 font-display text-2xl text-chalk"
              >
                {t.feedback.modalTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-mist">
                {t.feedback.modalSubtitle}
              </p>

              <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
                <label className="flex flex-col gap-1.5 text-sm text-mist">
                  {t.feedback.nameLabel}
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={t.feedback.namePlaceholder}
                    className="rounded-xl border border-hair bg-abyss/60 px-4 py-3 text-base text-chalk placeholder:text-mist/60 transition duration-300 focus:border-neon-deep focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-sm text-mist">
                  {t.feedback.messageLabel}
                  <textarea
                    required
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder={t.feedback.messagePlaceholder}
                    rows={4}
                    className="resize-none rounded-xl border border-hair bg-abyss/60 px-4 py-3 text-base text-chalk placeholder:text-mist/60 transition duration-300 focus:border-neon-deep focus:outline-none"
                  />
                </label>

                <button
                  type="submit"
                  className="mt-1 inline-flex h-14 w-full shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-xl bg-neon px-7 font-display text-base text-[#021309] shadow-neon transition duration-300 hover:-translate-y-0.5 hover:bg-neon-soft hover:shadow-[0_0_40px_-4px_rgb(92_255_157/0.6)]"
                >
                  <Send className="size-5 shrink-0" strokeWidth={2.25} />
                  {t.feedback.submitCta}
                </button>
              </form>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}
