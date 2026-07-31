"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { fadeUp, staggerContainer, VIEWPORT_ONCE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function AppCarousel() {
  const { dir, lang, t } = useLanguage();
  const shots = t.gallery.shots;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    direction: dir,
    loop: true,
    align: "center",
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  /*
   * embla קורא את direction רק בהקמה הראשונית. כשהמשתמש מחליף שפה
   * (ומכאן dir), חייבים לאתחל מחדש את המנוע כדי שהחישוב הפנימי של
   * הגלילה (סימן ה-scrollLeft וכו') יתאים לכיוון החדש. אותו מעבר שפה
   * גם מחליף את קובצי התמונה ואת יחסי הגובה-רוחב שלהם (הסטים העברי
   * והאנגלי צולמו ביחסים שונים), ולכן reInit נחוץ גם כדי שהמידות
   * המחודשות של השקופיות יימדדו נכון.
   */
  useEffect(() => {
    emblaApi?.reInit({
      direction: dir,
      loop: true,
      align: "center",
      skipSnaps: false,
    });
  }, [dir, lang, emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    /*
     * לא קוראים ל-onSelect ישירות בגוף ה-effect: זה setState סינכרוני
     * שגורם לרינדור מדורג. embla מתחיל תמיד ב-startIndex 0, שזהה לערך
     * ההתחלתי של ה-state, וכל שינוי אחריו מגיע דרך האירועים שמנויים כאן.
     */
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  return (
    <section
      id="gallery"
      className="relative scroll-mt-16 pb-28 sm:pb-32 lg:pb-40"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
        {/* ---------- כותרת המקטע ---------- */}
        <motion.div
          className="flex flex-wrap items-end justify-between gap-6"
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
              {t.gallery.kicker}
            </motion.p>
            <motion.h2
              className="mt-4 text-3xl font-extralight leading-tight text-chalk sm:text-4xl"
              variants={fadeUp}
            >
              {t.gallery.titlePrefix}
              <span className="font-display font-normal text-neon">
                {t.gallery.titleHighlight}
              </span>
            </motion.h2>
          </div>

          {/*
            חצי ניווט — מבוססים על rtl:rotate-180 של Tailwind, שמתהפך
            אוטומטית לפי dir/lang של <html>. במסכי מגע אפשר פשוט להחליק.
          */}
          <motion.div className="flex items-center gap-3" variants={fadeUp}>
            <button
              type="button"
              onClick={scrollPrev}
              aria-label={t.gallery.prevAria}
              className="panel flex size-11 items-center justify-center rounded-full text-chalk transition duration-300 hover:border-neon-deep hover:text-neon"
            >
              <ChevronLeft className="size-5 rtl:rotate-180" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label={t.gallery.nextAria}
              className="panel flex size-11 items-center justify-center rounded-full text-chalk transition duration-300 hover:border-neon-deep hover:text-neon"
            >
              <ChevronRight className="size-5 rtl:rotate-180" strokeWidth={2} />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/*
        אזור הגלילה יוצא מגבולות המיכל הממורכז כדי שהשקופיות ייחתכו ברכות
        בקצוות המסך. overflow-hidden כאן הוא גם מה שמונע גלילה אופקית של הדף.
      */}
      <motion.div
        className="mt-12 overflow-hidden"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
      >
        <div ref={emblaRef} className="overflow-hidden">
          {/*
            will-change-transform: embla כותב translate3d על האלמנט הזה בכל
            פריים בזמן גרירה/גלילה — זהו האלמנט הכי "כבד" באנימציה בכל הדף,
            ורמז מוקדם לדפדפן מונע קפיצת שכבת קומפוזיציה ברגע הראשון של הגרירה.
          */}
          <div className="flex touch-pan-y gap-5 px-5 will-change-transform sm:gap-7 sm:px-8">
            {shots.map((shot, index) => (
              <div
                key={shot.src}
                /* גובה קבוע + aspect-ratio = רוחב מוגדר עוד לפני טעינת התמונה */
                className="h-[400px] flex-none sm:h-[520px]"
                style={{ aspectRatio: `${shot.width} / ${shot.height}` }}
              >
                <div
                  className={`relative h-full w-full overflow-hidden rounded-[1.75rem] border transition duration-500 ${
                    index === selectedIndex
                      ? "border-neon-deep shadow-[0_30px_70px_-25px_rgba(0,0,0,0.95),0_0_50px_-16px_rgba(92,255,157,0.45)]"
                      : "border-hair shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)]"
                  }`}
                >
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    sizes="(min-width: 640px) 260px, 200px"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/*
        ---------- נקודות ניווט ----------
        כל נקודה שומרת על רוחב קבוע (w-7) בכל מצב — האפקט הוויזואלי של
        "התכווצות" מושג אך ורק דרך transform: scaleX, לא דרך שינוי width.
        width הוא תכונת פריסה שגורמת לחישוב reflow בכל פריים של האנימציה;
        scaleX רץ על ה-GPU בלבד ואינו נוגע בפריסה כלל.
      */}
      <div className="mt-8 flex items-center justify-center gap-2.5">
        {shots.map((shot, index) => (
          <button
            key={shot.src}
            type="button"
            onClick={() => scrollTo(index)}
            aria-label={t.gallery.goToSlideAria(index + 1)}
            aria-current={index === selectedIndex}
            className={`h-1.5 w-7 origin-center rounded-full transition-[transform,background-color] duration-400 will-change-transform ${
              index === selectedIndex
                ? "scale-x-100 bg-neon"
                : "scale-x-[0.214] bg-hair-lit hover:bg-mist"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
