"use client";

import { ArrowUpRight } from "lucide-react";

import { EXTERNAL_LINK_PROPS, PLAY_STORE_URL } from "@/lib/links";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/*
 * מדריך שלושת השלבים כ"כרטיס נוכחות": פתק שנהב אחד עם שלוש שלוחות, קווי
 * תלישה מקווקווים וחריצים חצי-עגולים בכל קו הפרדה (כמו כרטיס שעון נוכחות
 * ישן). הצבע ההפוך שובר את הרקע הכהה ונותן לשלושת השלבים משקל. המספור אמיתי —
 * אלה שלבים לפי סדר. שלב 1 הוא קישור ישיר ל-Google Play.
 */
const STEP_HREFS: [string | undefined, string | undefined, string | undefined] = [
  PLAY_STORE_URL,
  undefined,
  undefined,
];

export default function StepsB() {
  const { t } = useLanguage();

  return (
    <div className="relative mx-auto -mt-10 w-full max-w-5xl rounded-[1.5rem] bg-db-ivory px-6 pb-8 pt-9 text-db-ink shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)] sm:-mt-16 sm:px-10 sm:pb-10 sm:pt-11">
      <p className="text-sm font-semibold text-db-ink-green">{t.betaSteps.kicker}</p>
      <h2 className="mt-1.5 text-balance font-db-display text-[1.75rem] font-bold leading-tight sm:text-4xl">
        {t.betaSteps.titlePrefix}
        <span className="text-db-ink-green">{t.betaSteps.titleHighlight}</span>
        {t.betaSteps.titleSuffix}
      </h2>

      <ol className="relative mt-8 grid sm:mt-10 sm:grid-cols-3">
        {STEP_HREFS.map((href, index) => {
          const { title, description } = t.betaSteps.steps[index];
          const number = String(index + 1).padStart(2, "0");

          const body = (
            <>
              <span
                dir="ltr"
                className="block font-db-display text-[3.25rem] font-black leading-none text-db-ink-green sm:text-6xl"
              >
                {number}
              </span>
              <span className="mt-3 flex items-center gap-1.5 text-lg font-bold">
                {title}
                {href ? (
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4.5 shrink-0 rtl:-scale-x-100"
                    strokeWidth={2.25}
                  />
                ) : null}
              </span>
              <span className="mt-1 block text-[0.9375rem] leading-relaxed text-db-ink-muted">
                {description}
              </span>
            </>
          );

          /* קו תלישה מקווקו בין שלוחות: אופקי במובייל, אנכי מ-sm. החריצים יושבים על הקו */
          const itemClass =
            "relative py-6 first:pt-0 last:pb-0 sm:px-8 sm:py-0 sm:first:ps-0 sm:last:pe-0 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-dashed [&:not(:first-child)]:border-db-ink/25 sm:[&:not(:first-child)]:border-s sm:[&:not(:first-child)]:border-t-0";

          return (
            <li key={number} className={itemClass}>
              {index > 0 ? <MobileNotches /> : null}
              {href ? (
                <a href={href} {...EXTERNAL_LINK_PROPS} className="group block underline-offset-4 outline-db-ink-green hover:underline">
                  {body}
                </a>
              ) : (
                <div className="block">{body}</div>
              )}
            </li>
          );
        })}
      </ol>

      {/* חריצי תלישה בקצה העליון והתחתון של הכרטיס, מעל קווי ההפרדה האנכיים (מ-sm) */}
      {[1, 2].map((divider) => (
        <span key={divider} aria-hidden="true">
          <span
            className="absolute -top-3 hidden size-6 rounded-full bg-db-bg sm:block"
            style={{ insetInlineStart: `calc(2.5rem + (100% - 5rem) * ${divider} / 3 - 0.75rem)` }}
          />
          <span
            className="absolute -bottom-3 hidden size-6 rounded-full bg-db-bg sm:block"
            style={{ insetInlineStart: `calc(2.5rem + (100% - 5rem) * ${divider} / 3 - 0.75rem)` }}
          />
        </span>
      ))}
    </div>
  );
}

/*
 * חריצי הכרטיס במובייל: הקו המקווקו אופקי, והחריצים הם עיגולים בצבע הרקע שיושבים
 * על שני קצות הכרטיס בגובה הקו ונראים כחתך בנייר.
 */
function MobileNotches() {
  return (
    <>
      <span
        aria-hidden="true"
        className="absolute -top-3 -start-9 size-6 rounded-full bg-db-bg sm:hidden"
      />
      <span
        aria-hidden="true"
        className="absolute -top-3 -end-9 size-6 rounded-full bg-db-bg sm:hidden"
      />
    </>
  );
}
