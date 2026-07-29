"use client";

import { motion } from "framer-motion";
import { Download, Rocket, UserPlus, type LucideIcon } from "lucide-react";

import DirectionalArrow from "@/components/DirectionalArrow";
import { BETA_GROUP_URL, EXTERNAL_LINK_PROPS, PLAY_STORE_URL } from "@/lib/links";
import { fadeUp, staggerContainer, VIEWPORT_ONCE } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/*
 * המבנה החזותי של כל שלב (אייקון, קישור, רוחב, היסט, מבטא) הוא קבוע ואינו
 * תלוי שפה — רק הכותרת, התיאור ותווית הקישור מגיעים מהמילון. כך אין סיכון
 * שתרגום ישכח להעביר גם מאפיין עיצובי.
 */
type StepMeta = {
  icon: LucideIcon;
  href?: string;
  span: string;
  offset: string;
  accent?: boolean;
};

const STEP_META: [StepMeta, StepMeta, StepMeta] = [
  {
    icon: UserPlus,
    href: BETA_GROUP_URL,
    span: "lg:col-span-5",
    offset: "lg:mt-0",
  },
  {
    icon: Download,
    href: PLAY_STORE_URL,
    span: "lg:col-span-4",
    offset: "lg:mt-16",
  },
  {
    icon: Rocket,
    span: "lg:col-span-3",
    offset: "lg:mt-32",
    accent: true,
  },
];

const HOVER_LIFT = {
  y: -6,
  transition: { duration: 0.3, ease: "easeOut" },
} as const;

export default function BetaSteps() {
  const { t } = useLanguage();

  return (
    <section
      id="beta-steps"
      className="relative scroll-mt-16 px-5 pb-28 sm:px-8 lg:px-12 lg:pb-40"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* ---------- כותרת המקטע ---------- */}
        <motion.div
          className="max-w-2xl"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          <motion.p
            className="font-mono text-xs tracking-[0.3em] text-neon-deep"
            variants={fadeUp}
          >
            {t.betaSteps.kicker}
          </motion.p>
          <motion.h2
            className="mt-4 text-3xl font-extralight leading-snug text-chalk sm:text-4xl lg:text-[2.9rem]"
            variants={fadeUp}
          >
            {t.betaSteps.titlePrefix}
            <span className="font-display font-normal text-neon">
              {t.betaSteps.titleHighlight}
            </span>
            {t.betaSteps.titleSuffix}
          </motion.h2>
          <motion.p
            className="mt-5 text-lg leading-relaxed text-mist"
            variants={fadeUp}
          >
            {t.betaSteps.subtitle}
          </motion.p>
        </motion.div>

        {/* ---------- שלושת השלבים ---------- */}
        <motion.div
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12 lg:items-start lg:gap-7"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          {STEP_META.map(({ icon: Icon, href, span, offset, accent }, index) => {
            const { title, description, linkLabel } = t.betaSteps.steps[index];
            const number = String(index + 1).padStart(2, "0");

            const cardClass = `panel panel-rail edge-lit group relative flex flex-col overflow-hidden rounded-2xl p-8 transition-colors duration-500 hover:border-hair-lit ${span} ${offset} ${
              accent ? "border-neon-deep/70" : ""
            }`;

            const content = (
              <>
                {/* מספר ענק ורפאי ברקע הכרטיס — נשאר LTR תמיד, ספרות אינן זקוקות להיפוך */}
                <span
                  aria-hidden="true"
                  dir="ltr"
                  className="pointer-events-none absolute -top-4 left-4 font-mono text-[5.5rem] leading-none text-chalk/[0.04]"
                >
                  {number}
                </span>

                <span
                  className={`relative flex size-14 shrink-0 items-center justify-center rounded-xl border transition duration-500 ${
                    accent
                      ? "border-neon-deep bg-neon/[0.08]"
                      : "border-hair bg-abyss/60 group-hover:border-neon-deep"
                  }`}
                >
                  <Icon className="size-6 text-neon" strokeWidth={1.6} />
                </span>

                <h3 className="relative mt-6 font-display text-2xl leading-snug text-chalk">
                  {title}
                </h3>

                <p className="relative mt-3 text-base leading-relaxed text-mist">
                  {description}
                </p>

                {linkLabel ? (
                  <span className="relative mt-6 inline-flex items-center gap-2 text-sm text-neon">
                    {linkLabel}
                    <DirectionalArrow
                      strokeWidth={2}
                      className="size-4 transition-transform duration-300 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                    />
                  </span>
                ) : null}
              </>
            );

            return href ? (
              <motion.a
                key={number}
                href={href}
                {...EXTERNAL_LINK_PROPS}
                variants={fadeUp}
                whileHover={HOVER_LIFT}
                className={cardClass}
              >
                {content}
              </motion.a>
            ) : (
              <motion.div
                key={number}
                variants={fadeUp}
                whileHover={HOVER_LIFT}
                className={cardClass}
              >
                {content}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
