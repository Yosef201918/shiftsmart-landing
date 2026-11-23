"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
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
    loop: false,
    align: "center",
    containScroll: "keepSnaps",
    dragFree: true,
    skipSnaps: false,
    duration: 20,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const dragging = useRef(false);

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
      loop: false,
      align: "center",
      dragFree: true,
    });
  }, [dir, lang, emblaApi]);

  // A mouse released outside the browser may never send Embla its document mouseup.
  // Reset only an interrupted drag; normal releases keep their free-scroll position.
  useEffect(() => {
    if (!emblaApi) return;
    const start = () => { dragging.current = true; };
    const end = () => { dragging.current = false; };
    const cancel = () => {
      if (!dragging.current) return;
      dragging.current = false;
      emblaApi.reInit({ startIndex: emblaApi.selectedScrollSnap() });
    };
    const recoverReleasedMouse = (event: MouseEvent) => {
      if (event.buttons === 0) cancel();
    };
    emblaApi.on("pointerDown", start).on("pointerUp", end);
    window.addEventListener("blur", cancel);
    document.addEventListener("mousemove", recoverReleasedMouse, true);
    return () => {
      dragging.current = false;
      emblaApi.off("pointerDown", start).off("pointerUp", end);
      window.removeEventListener("blur", cancel);
      document.removeEventListener("mousemove", recoverReleasedMouse, true);
    };
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    // Free dragging may stop between snaps; enable arrows by position, not nearest snap.
    const progress = emblaApi.scrollProgress();
    setCanPrev(progress > 0.001);
    setCanNext(progress < 0.999);
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
    emblaApi.on("scroll", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("scroll", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  const onGalleryKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const next = event.key === (dir === "rtl" ? "ArrowLeft" : "ArrowRight");
      if (next) scrollNext(); else scrollPrev();
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      scrollTo(event.key === "Home" ? 0 : shots.length - 1);
    }
  };

  return (
    <section
      id="gallery"
      className="relative scroll-mt-16 pb-20 lg:pb-28"
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
              className="font-mono text-xs tracking-[0.3em] text-neon/60"
              variants={fadeUp}
            >
              {t.gallery.kicker}
            </motion.p>
            <motion.h2
              id="gallery-heading"
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
              disabled={!canPrev}
              aria-label={t.gallery.prevAria}
              className="panel flex size-11 items-center justify-center rounded-full text-chalk transition duration-200 hover:border-neon-deep hover:text-neon disabled:cursor-default disabled:opacity-30"
            >
              <ChevronLeft className="size-5 rtl:rotate-180" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canNext}
              aria-label={t.gallery.nextAria}
              className="panel flex size-11 items-center justify-center rounded-full text-chalk transition duration-200 hover:border-neon-deep hover:text-neon disabled:cursor-default disabled:opacity-30"
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
        className="mt-8 overflow-hidden sm:mt-10"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
      >
        <div ref={emblaRef} tabIndex={0} role="region" aria-labelledby="gallery-heading" onKeyDown={onGalleryKeyDown} className="overflow-hidden">
          {/*
            will-change-transform: embla כותב translate3d על האלמנט הזה בכל
            פריים בזמן גרירה/גלילה — זהו האלמנט הכי "כבד" באנימציה בכל הדף,
            ורמז מוקדם לדפדפן מונע קפיצת שכבת קומפוזיציה ברגע הראשון של הגרירה.
          */}
          <div className="flex cursor-grab select-none touch-pan-y gap-5 active:cursor-grabbing px-5 will-change-transform sm:gap-7 sm:px-8">
            {shots.map((shot, index) => (
              <div
                key={shot.src}
                /* גובה קבוע + aspect-ratio = רוחב מוגדר עוד לפני טעינת התמונה */
                className="h-[400px] flex-none sm:h-[520px]"
                style={{ aspectRatio: `${shot.width} / ${shot.height}` }}
              >
                <div
                  className={`relative h-full w-full overflow-hidden rounded-xl border transition duration-500 ${
                    index === selectedIndex
                      ? "border-neon-deep shadow-[0_30px_70px_-25px_rgba(0,0,0,0.95),0_0_50px_-16px_rgba(92,255,157,0.45)]"
                      : "border-hair shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)]"
                  }`}
                >
                  <a href={shot.src} target="_blank" rel="noopener noreferrer" draggable={false} className="block h-full w-full">
                  <Image
                    draggable={false}
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    sizes="(min-width: 640px) 347px, 267px"
                    className="h-full w-full object-contain"
                  />
                  </a>
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
      <div className="mt-5 flex items-center justify-center gap-2.5">
        {shots.map((shot, index) => (
          <button
            key={shot.src}
            type="button"
            onClick={() => scrollTo(index)}
            aria-label={t.gallery.goToSlideAria(index + 1)}
            aria-current={index === selectedIndex}
            className="group flex h-11 w-9 items-center justify-center"
          >
            <span
              className={`block h-1.5 w-7 origin-center rounded-full transition-[transform,background-color] duration-400 will-change-transform ${
                index === selectedIndex
                  ? "scale-x-100 bg-neon"
                  : "scale-x-[0.214] bg-hair-lit group-hover:bg-mist"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
