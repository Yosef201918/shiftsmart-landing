"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, X } from "lucide-react";

import { fadeUp, staggerContainer, VIEWPORT_ONCE, EASE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/** כוכבים קבועים (לא אינטראקטיביים) — מציגים דירוג קיים בכרטיס ביקורת/ממוצע */
function StaticStars({ rating, className = "size-4" }: { rating: number; className?: string }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${className} ${
            star <= rating ? "fill-amber text-amber" : "fill-transparent text-hair-lit"
          }`}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

/*
 * שלב 17 — מקטע ביקורות ציבורי בסגנון Google Play, במקום ה-FAB הפרטי
 * שהוסר. שלושה חלקים: כותרת ממוצע דירוג + כפתור "כתוב ביקורת", גריד
 * כרטיסי ביקורות (נתוני דמו), ומודאל כתיבת ביקורת עם דירוג כוכבים
 * אינטראקטיבי. לאחר שליחה מוצג טוסט זמני — אין עדיין backend אמיתי.
 *
 * מודאל וטוסט בנויים כשכבת מיקום קבועה תמיד-מורכבת עם AnimatePresence
 * נפרד לכל אלמנט מונפש (לא מקונן) — התבנית שתוקנה בפאזה 16 אחרי שגילינו
 * שקינון אלמנט מונפש בתוך אלמנט מונפש יחיד בתוך AnimatePresence תוקע
 * את מעקב היציאה (exit) ומשאיר אלמנטים רפאים ב-DOM.
 */
export default function Reviews() {
  const { t, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [name, setName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
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
    setReviewText("");
    setSelectedRating(0);
    setHoverRating(0);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reviewText.trim() || selectedRating === 0) return;

    // TODO: Connect to backend database to save review permanently
    closeModal();
    setIsToastVisible(true);
  };

  return (
    <section
      id="reviews"
      className="relative scroll-mt-16 px-5 pb-28 sm:px-8 lg:px-12 lg:pb-40"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* ---------- כותרת המקטע + ממוצע דירוג ---------- */}
        <motion.div
          className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          <div className="max-w-2xl">
            <motion.p
              className="font-mono text-xs tracking-[0.3em] text-neon-deep"
              variants={fadeUp}
            >
              {t.reviews.kicker}
            </motion.p>
            <motion.h2
              className="mt-4 text-3xl font-extralight leading-tight text-chalk sm:text-4xl"
              variants={fadeUp}
            >
              {t.reviews.titlePrefix}
              <span className="font-display font-normal text-neon">
                {t.reviews.titleHighlight}
              </span>
            </motion.h2>

            <motion.div
              className="mt-5 flex items-center gap-3"
              variants={fadeUp}
            >
              <span dir="ltr" className="font-display text-4xl text-chalk">
                {t.reviews.averageRating}
              </span>
              <span className="flex flex-col gap-1">
                <StaticStars rating={5} className="size-4" />
                <span className="text-sm text-mist">{t.reviews.subtitle}</span>
              </span>
            </motion.div>
          </div>

          <motion.button
            type="button"
            onClick={() => setIsOpen(true)}
            variants={fadeUp}
            className="inline-flex h-14 w-full shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-xl bg-neon px-7 font-display text-base text-[#021309] shadow-neon transition duration-300 hover:-translate-y-0.5 hover:bg-neon-soft hover:shadow-[0_0_40px_-4px_rgb(92_255_157/0.6)] sm:w-auto"
          >
            {t.reviews.writeReviewCta}
          </motion.button>
        </motion.div>

        {/* ---------- גריד הביקורות ---------- */}
        <motion.div
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          {t.reviews.items.map(({ name: reviewerName, role, rating, text }) => (
            <motion.article
              key={reviewerName}
              variants={fadeUp}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
              className="panel panel-rail edge-lit flex flex-col rounded-2xl p-7 transition-colors duration-500 hover:border-hair-lit"
            >
              <StaticStars rating={rating} />
              <p className="mt-4 flex-1 text-base leading-relaxed text-mist">
                “{text}”
              </p>
              <div className="mt-6 border-t border-hair pt-4">
                <p className="font-display text-base text-chalk">{reviewerName}</p>
                <p className="text-sm text-mist">{role}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/*
        ---------- מודאל כתיבת ביקורת ----------
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
              key="review-backdrop"
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
              key="review-dialog"
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
                aria-label={t.reviews.modal.closeAria}
                className="absolute end-5 top-5 flex size-9 items-center justify-center rounded-full border border-hair text-mist transition duration-300 hover:border-neon-deep hover:text-neon"
              >
                <X className="size-4" strokeWidth={1.9} />
              </button>

              <h2 id={titleId} className="pe-10 font-display text-2xl text-chalk">
                {t.reviews.modal.title}
              </h2>

              <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
                <label className="flex flex-col gap-1.5 text-sm text-mist">
                  {t.reviews.modal.nameLabel}
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={t.reviews.modal.namePlaceholder}
                    className="rounded-xl border border-hair bg-abyss/60 px-4 py-3 text-base text-chalk placeholder:text-mist/60 transition duration-300 focus:border-neon-deep focus:outline-none"
                  />
                </label>

                {/* ---------- דירוג כוכבים אינטראקטיבי ---------- */}
                <div className="flex flex-col gap-1.5 text-sm text-mist">
                  {t.reviews.modal.ratingLabel}
                  <div
                    dir="ltr"
                    className="flex items-center gap-1.5"
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        aria-label={t.reviews.modal.ratingAria(star)}
                        aria-pressed={selectedRating === star}
                        onClick={() => setSelectedRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        className="p-0.5"
                      >
                        <Star
                          className={`size-7 transition-colors duration-150 ${
                            star <= (hoverRating || selectedRating)
                              ? "fill-amber text-amber"
                              : "fill-transparent text-hair-lit"
                          }`}
                          strokeWidth={1.5}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex flex-col gap-1.5 text-sm text-mist">
                  {t.reviews.modal.reviewLabel}
                  <textarea
                    required
                    value={reviewText}
                    onChange={(event) => setReviewText(event.target.value)}
                    placeholder={t.reviews.modal.reviewPlaceholder}
                    rows={4}
                    className="resize-none rounded-xl border border-hair bg-abyss/60 px-4 py-3 text-base text-chalk placeholder:text-mist/60 transition duration-300 focus:border-neon-deep focus:outline-none"
                  />
                </label>

                <button
                  type="submit"
                  className="mt-1 inline-flex h-14 w-full shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-xl bg-neon px-7 font-display text-base text-[#021309] shadow-neon transition duration-300 hover:-translate-y-0.5 hover:bg-neon-soft hover:shadow-[0_0_40px_-4px_rgb(92_255_157/0.6)]"
                >
                  {t.reviews.modal.submitCta}
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
              key="review-toast"
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="panel edge-lit pointer-events-auto rounded-full px-6 py-3 text-sm text-chalk shadow-neon"
            >
              {t.reviews.toastMessage}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
