"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { fadeUp, staggerContainer, VIEWPORT_ONCE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type ShotMeta = {
  /** שם הקובץ נשמר כפי שהוא, כולל הרווח — next/image מקודד אותו בעצמו */
  src: string;
  width: number;
  height: number;
};

/*
 * המידות אמיתיות ונלקחו מהקבצים עצמם. הן חשובות פעמיים:
 * גם למניעת קפיצת פריסה בזמן טעינה, וגם כדי שרוחב כל שקופית ייגזר
 * מיחס הגובה-רוחב שלה — כך הקרוסלה נמדדת נכון עוד לפני שהתמונות ירדו.
 * טקסט ה-alt של כל שקופית מגיע מהמילון לפי אותו אינדקס.
 */
const SHOT_META: [
  ShotMeta,
  ShotMeta,
  ShotMeta,
  ShotMeta,
  ShotMeta,
  ShotMeta,
] = [
  { src: "/Screenshot 1.jpg", width: 1080, height: 2525 },
  { src: "/Screenshot 2.jpg", width: 1080, height: 2340 },
  { src: "/Screenshot 3.jpg", width: 1080, height: 2340 },
  { src: "/Screenshot 4.jpg", width: 1080, height: 3389 },
  { src: "/Screenshot 5.jpg", width: 1080, height: 2466 },
  { src: "/Screenshot 6.jpg", width: 1080, height: 2768 },
];

export default function AppCarousel() {
  const { dir, t } = useLanguage();

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
   * הגלילה (סימן ה-scrollLeft וכו') יתאים לכיוון החדש.
   */
  useEffect(() => {
    emblaApi?.reInit({
      direction: dir,
      loop: true,
      align: "center",
      skipSnaps: false,
    });
  }, [dir, emblaApi]);

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
          <div className="flex touch-pan-y gap-5 px-5 sm:gap-7 sm:px-8">
            {SHOT_META.map((shot, index) => (
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
                    alt={t.gallery.shots[index].alt}
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

      {/* ---------- נקודות ניווט ---------- */}
      <div className="mt-8 flex items-center justify-center gap-2.5">
        {SHOT_META.map((shot, index) => (
          <button
            key={shot.src}
            type="button"
            onClick={() => scrollTo(index)}
            aria-label={t.gallery.goToSlideAria(index + 1)}
            aria-current={index === selectedIndex}
            className={`h-1.5 rounded-full transition-all duration-400 ${
              index === selectedIndex
                ? "w-7 bg-neon"
                : "w-1.5 bg-hair-lit hover:bg-mist"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
