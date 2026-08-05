"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, X } from "lucide-react";

import { fadeUp, staggerContainer, VIEWPORT_ONCE, EASE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/*
 * שלב 21 — מקטע "הצעת פיצ'ר": כרטיס קריאה-לפעולה קטן שפותח מודאל עם טופס
 * פשוט (שם, אימייל אופציונלי, תיאור הרעיון). בשלב הזה השליחה היא מקומית
 * בלבד — טוסט הצלחה וסגירה — ללא חיבור לאף backend עדיין.
 *
 * מודאל וטוסט בנויים כשכבת מיקום קבועה תמיד-מורכבת עם AnimatePresence
 * נפרד לכל אלמנט מונפש (לא מקונן), אותה תבנית בדיוק כמו ב-Reviews.tsx —
 * קינון אלמנט מונפש בתוך אלמנט מונפש יחיד בתוך AnimatePresence תוקע את
 * מעקב היציאה (exit) ומשאיר אלמנטים רפאים ב-DOM.
 */
export default function FeatureRequest() {
  const { t, dir } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feature, setFeature] = useState("");
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

  useEffect(() => {
    if (!isToastVisible) return;
    const timer = setTimeout(() => setIsToastVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [isToastVisible]);

  const closeModal = () => {
    setIsOpen(false);
    setName("");
    setEmail("");
    setFeature("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !feature.trim()) return;

    // TODO: Connect to Supabase feature_requests table
    closeModal();
    setIsToastVisible(true);
  };

  return (
    <section className="relative px-5 pb-28 sm:px-8 lg:px-12 lg:pb-40">
      <motion.div
        className="panel panel-rail edge-lit mx-auto flex w-full max-w-6xl flex-col items-start gap-6 rounded-2xl p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
      >
        <motion.div className="flex items-start gap-4" variants={fadeUp}>
          <span className="panel flex size-12 shrink-0 items-center justify-center rounded-2xl border-neon-deep/70 bg-neon/[0.08]">
            <Lightbulb className="size-5 text-neon" strokeWidth={1.75} />
          </span>
          <div>
            <h2 className="font-display text-xl text-chalk sm:text-2xl">
              {t.featureRequest.modalTitle}
            </h2>
            <p className="mt-1.5 max-w-md text-sm leading-relaxed text-mist">
              {t.featureRequest.modalSubtitle}
            </p>
          </div>
        </motion.div>

        <motion.button
          type="button"
          onClick={() => setIsOpen(true)}
          variants={fadeUp}
          className="inline-flex h-14 w-full shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-xl bg-neon px-7 font-display text-base text-[#021309] shadow-neon transition duration-300 hover:-translate-y-0.5 hover:bg-neon-soft hover:shadow-[0_0_40px_-4px_rgb(92_255_157/0.6)] sm:w-auto"
        >
          {t.featureRequest.buttonLabel}
        </motion.button>
      </motion.div>

      {/*
        ---------- מודאל הצעת פיצ'ר ----------
        מעטפת מיקום קבועה, תמיד מורכבת — ראו הסבר בתחילת הקובץ.
      */}
      <div
        className={`fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-5 ${
          isOpen ? "" : "pointer-events-none"
        }`}
      >
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              key="feature-backdrop"
              aria-hidden="true"
              onClick={closeModal}
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
              key="feature-dialog"
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
                onClick={closeModal}
                aria-label={t.featureRequest.closeAria}
                className="absolute end-5 top-5 flex size-9 items-center justify-center rounded-full border border-hair text-mist transition duration-300 hover:border-neon-deep hover:text-neon"
              >
                <X className="size-4" strokeWidth={1.9} />
              </button>

              <span className="panel flex size-12 items-center justify-center rounded-2xl border-neon-deep/70 bg-neon/[0.08]">
                <Lightbulb className="size-5 text-neon" strokeWidth={1.75} />
              </span>

              <h2 id={titleId} className="mt-5 pe-10 font-display text-2xl text-chalk">
                {t.featureRequest.modalTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-mist">
                {t.featureRequest.modalSubtitle}
              </p>

              <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
                <label className="flex flex-col gap-1.5 text-sm text-mist">
                  {t.featureRequest.nameLabel}
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={t.featureRequest.namePlaceholder}
                    className="rounded-xl border border-hair bg-abyss/60 px-4 py-3 text-base text-chalk placeholder:text-mist/60 transition duration-300 focus:border-neon-deep focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-sm text-mist">
                  {t.featureRequest.emailLabel}
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t.featureRequest.emailPlaceholder}
                    dir="ltr"
                    className="rounded-xl border border-hair bg-abyss/60 px-4 py-3 text-end text-base text-chalk placeholder:text-mist/60 transition duration-300 focus:border-neon-deep focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-sm text-mist">
                  {t.featureRequest.featureLabel}
                  <textarea
                    required
                    value={feature}
                    onChange={(event) => setFeature(event.target.value)}
                    placeholder={t.featureRequest.featurePlaceholder}
                    rows={4}
                    className="resize-none rounded-xl border border-hair bg-abyss/60 px-4 py-3 text-base text-chalk placeholder:text-mist/60 transition duration-300 focus:border-neon-deep focus:outline-none"
                  />
                </label>

                <button
                  type="submit"
                  className="mt-1 inline-flex h-14 w-full shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-xl bg-neon px-7 font-display text-base text-[#021309] shadow-neon transition duration-300 hover:-translate-y-0.5 hover:bg-neon-soft hover:shadow-[0_0_40px_-4px_rgb(92_255_157/0.6)]"
                >
                  {t.featureRequest.submitCta}
                </button>
              </form>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* ---------- טוסט הצלחה ---------- */}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex justify-center px-5">
        <AnimatePresence>
          {isToastVisible ? (
            <motion.div
              key="feature-toast"
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="panel edge-lit pointer-events-auto rounded-full px-6 py-3 text-sm text-chalk shadow-neon"
            >
              {t.featureRequest.toastMessage}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
