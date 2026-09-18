"use client";

import Link from "next/link";
import { Home } from "lucide-react";

import RichText from "@/components/RichText";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/links";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/*
 * תוכן דף תנאי השימוש, כרכיב לקוח נפרד מ-app/terms/page.tsx — אותה תבנית
 * בדיוק כמו PrivacyPolicyContent: ה-page נשאר Server Component כדי לייצא
 * metadata, והתוכן כאן צורך useLanguage() כדי להגיב למתג השפה. אימייל
 * יצירת הקשר מגיע מ-lib/links.ts (מקור אמת יחיד).
 */
export default function TermsOfServiceContent() {
  const { t } = useLanguage();
  const { terms } = t;

  return (
    <main className="relative z-10 mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="group inline-flex items-center gap-2 text-sm text-mist transition duration-300 hover:text-neon"
      >
        <Home className="size-4 shrink-0 transition duration-300 group-hover:text-neon" strokeWidth={1.75} />
        {terms.backToHome}
      </Link>

      <article className="mt-8">
        <h1 className="font-display text-3xl text-chalk sm:text-4xl">
          {terms.pageTitle}
        </h1>
        <p className="mt-3 text-sm text-mist">{terms.lastUpdated}</p>

        <p className="mt-8 text-base leading-relaxed text-mist">
          {terms.intro}
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          {terms.serviceDescription.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          {terms.serviceDescription.body}
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          {terms.openBeta.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          <RichText segments={terms.openBeta.body} />
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          {terms.userResponsibilityTitle}
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {terms.userResponsibilityItems.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-base leading-relaxed text-mist"
            >
              <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-neon" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          {terms.intellectualProperty.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          {terms.intellectualProperty.body}
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          {terms.liability.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          {terms.liability.body}
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          {terms.changes.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          {terms.changes.body}
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          {terms.governingLaw.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          {terms.governingLaw.body}
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          {terms.contactTitle}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          {terms.contactBody}{" "}
          <a
            href={CONTACT_MAILTO}
            dir="ltr"
            className="text-neon underline decoration-neon-deep underline-offset-4 transition duration-300 hover:text-neon-soft"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </article>

      <div className="rule-hair mt-12" />

      <Link
        href="/"
        className="group mt-6 inline-flex items-center gap-2 text-sm text-mist transition duration-300 hover:text-neon"
      >
        <Home className="size-4 shrink-0 transition duration-300 group-hover:text-neon" strokeWidth={1.75} />
        {terms.backToHome}
      </Link>
    </main>
  );
}
