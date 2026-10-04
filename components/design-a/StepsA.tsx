"use client";

import { ArrowUpRight } from "lucide-react";

import { EXTERNAL_LINK_PROPS, PLAY_STORE_URL } from "@/lib/links";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/*
 * מדריך שלושת השלבים כ"פס תהליך": קו דק עם צמתים, ומספר שלב בגופן הנתונים.
 * כאן המספור כן נושא מידע — אלה שלושה שלבים לפי סדר, לא קישוט. במובייל הקו
 * עובר לצד ההתחלה והשלבים נערמים אנכית; בדסקטופ הם שלושה טורים על קו אופקי.
 * שלב 1 הוא קישור ישיר ל-Google Play (כמו במדריך המקורי), ושני האחרים טקסט.
 */
const STEP_HREFS: [string | undefined, string | undefined, string | undefined] = [
  PLAY_STORE_URL,
  undefined,
  undefined,
];

export default function StepsA() {
  const { t } = useLanguage();

  return (
    <div className="mt-16 lg:mt-24">
      <p className="text-sm font-medium text-da-accent">{t.betaSteps.kicker}</p>
      <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
        {t.betaSteps.titlePrefix}
        <span className="text-da-accent">{t.betaSteps.titleHighlight}</span>
        {t.betaSteps.titleSuffix}
      </h2>

      <ol className="mt-8 grid gap-0 lg:mt-10 lg:grid-cols-3 lg:gap-10">
        {STEP_HREFS.map((href, index) => {
          const { title, description } = t.betaSteps.steps[index];
          const number = String(index + 1).padStart(2, "0");

          const body = (
            <>
              <span
                dir="ltr"
                className="block font-da-mono text-[2.25rem] font-medium leading-none tracking-tight text-da-accent/60"
              >
                {number}
              </span>
              <span className="mt-4 flex items-center gap-2 text-lg font-semibold">
                {title}
                {href ? (
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4.5 shrink-0 text-da-accent transition-transform duration-200 group-hover:-translate-y-0.5 ltr:group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:-scale-x-100"
                  />
                ) : null}
              </span>
              <span className="mt-1.5 block max-w-[34ch] text-[0.9375rem] leading-relaxed text-da-muted">
                {description}
              </span>
            </>
          );

          /* קו התהליך: בדסקטופ מעל כל טור, במובייל בצד ההתחלה. הצומת יושב על הקו */
          const itemClass =
            "relative border-s border-da-line ps-7 pb-9 last:pb-0 lg:border-s-0 lg:border-t lg:ps-0 lg:pt-8 lg:pb-0";

          return (
            <li key={number} className={itemClass}>
              <Node />
              {href ? (
                <a href={href} {...EXTERNAL_LINK_PROPS} className="group block">
                  {body}
                </a>
              ) : (
                <div className="block">{body}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* צומת על קו התהליך */
function Node() {
  return (
    <span
      aria-hidden="true"
      className="absolute -start-[5px] top-1.5 size-[9px] rounded-full bg-da-accent lg:-top-[5px] lg:start-0"
    />
  );
}
