"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { fadeScale, VIEWPORT_ONCE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/*
 * מוקאפ הטלפון כמקטע עצמאי. הוא הוצא מתוך ההירו כדי שמדריך שלושת השלבים
 * יופיע לפניו — אחרת במובייל הגריד של ההירו היה מערים את המוקאפ מתחת לטקסט
 * ודוחף את המדריך אל מתחת לתמונה.
 *
 * התמונה לא מסומנת priority: היא כבר לא מעל הקיפול, ולכן טעינה עצלה
 * מיטיבה עם ה-LCP במקום להתחרות בתוכן שמופיע לפניה.
 *
 * שלדת המכשיר וכפתורי הצד נשארים במיקום פיזי קבוע (left/right) בכל שפה:
 * זהו רכיב חומרה אמיתי, לא טקסט זורם, ולכן אסור לו להתהפך לפי כיוון קריאה.
 *
 * מקור התמונה עצמו כן תלוי שפה (t.phoneShowcase.mockupSrc/Width/Height):
 * לעברית זהו נכס ייעודי שנבחר במיוחד להירו (mockup-v2.png). לאנגלית טרם
 * סופק נכס מקביל, ולכן משמש כרגע צילום המסך הראשון מתוך הסט האנגלי
 * (משמרת פעילה עם טיימר רץ) כתחליף הכי קרוב תוכנית. מכיוון שיחסי
 * הגובה-רוחב של שני הקבצים שונים, גובה שלדת המכשיר נגזר אוטומטית
 * מ-h-auto ומשתנה מעט בין השפות — וזה תקין, לא באג.
 */
export default function PhoneShowcase() {
  const { t } = useLanguage();
  const { mockupSrc, mockupWidth, mockupHeight, mockupAlt } = t.phoneShowcase;

  return (
    <section
      id="app-preview"
      className="relative scroll-mt-16 px-5 pb-28 sm:px-8 lg:px-12 lg:pb-40"
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
        <div className="relative mx-auto w-fit transition-transform duration-700 ease-out lg:-rotate-3 lg:hover:rotate-0">
          {/* הילת ניאון שמרימה את המכשיר מהרקע */}
          <div
            aria-hidden="true"
            className="absolute -inset-12 rounded-full bg-[radial-gradient(circle,rgba(92,255,157,0.2),transparent_62%)] blur-3xl"
          />

          {/* שלדת המכשיר */}
          <div className="relative w-[264px] rounded-[2.6rem] border border-hair-lit/60 bg-gradient-to-b from-[#1a2532] via-[#0b121c] to-[#070c14] p-[10px] shadow-device sm:w-[288px]">
            {/* כפתורי צד */}
            <span
              aria-hidden="true"
              className="absolute -left-[3px] top-[112px] h-14 w-[3px] rounded-s-full bg-hair-lit"
            />
            <span
              aria-hidden="true"
              className="absolute -left-[3px] top-[178px] h-9 w-[3px] rounded-s-full bg-hair-lit"
            />
            <span
              aria-hidden="true"
              className="absolute -right-[3px] top-[140px] h-20 w-[3px] rounded-e-full bg-hair-lit"
            />

            {/* המסך — נשאר נקי לגמרי, בלי אלמנטים צפים מעליו */}
            <div className="relative overflow-hidden rounded-[2.05rem] bg-void">
              <Image
                key={mockupSrc}
                src={mockupSrc}
                alt={mockupAlt}
                width={mockupWidth}
                height={mockupHeight}
                sizes="(min-width: 640px) 268px, 244px"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
