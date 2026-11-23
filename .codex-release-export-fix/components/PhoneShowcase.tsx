"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { fadeScale, VIEWPORT_ONCE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// הנכס המאושר כולל מכשיר; אין להוסיף סביבו מסגרת נוספת.
export default function PhoneShowcase() {
  const { t } = useLanguage();
  const { mockupSrc, mockupWidth, mockupHeight, mockupAlt } = t.phoneShowcase;

  return (
    <section
      id="app-preview"
      className="relative scroll-mt-16 px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28"
    >
      <motion.div
        className="mx-auto w-full max-w-6xl"
        variants={fadeScale}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
      >
        {/* הטיה קלה שמתיישרת במעבר עכבר, על אלמנט פנימי כדי לא לדרוס
            את ה-transform ש-framer-motion כותב על אלמנט ה-motion */}
        <div className="relative mx-auto w-full max-w-[380px] sm:max-w-[440px]">

          <div className="relative">
            <div className="relative overflow-hidden rounded-xl bg-void">
              <a href={mockupSrc} target="_blank" rel="noopener noreferrer">
              <Image
                key={mockupSrc}
                src={mockupSrc}
                alt={mockupAlt}
                width={mockupWidth}
                height={mockupHeight}
                sizes="(min-width: 640px) 440px, (max-width: 420px) calc(100vw - 40px), 380px"
                className="h-auto w-full"
              />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
