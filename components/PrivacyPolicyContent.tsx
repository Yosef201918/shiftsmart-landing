"use client";

import Link from "next/link";
import { Home } from "lucide-react";

import RichText from "@/components/RichText";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/links";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/*
 * תוכן דף מדיניות הפרטיות, כרכיב לקוח נפרד מ-app/privacy/page.tsx: ה-page
 * עצמו נשאר Server Component כדי שיוכל לייצא metadata (חובה ב-Next.js —
 * "use client" ו-export const metadata לא יכולים לחיות באותו קובץ), ואילו
 * התוכן כאן צורך useLanguage() בדיוק כמו שאר רכיבי האתר כדי להגיב למתג
 * השפה. אימייל יצירת הקשר מגיע מ-lib/links.ts (מקור אמת יחיד), לא כקבוע
 * מקומי.
 */
export default function PrivacyPolicyContent() {
  const { t } = useLanguage();
  const { privacy } = t;

  return (
    <main className="relative z-10 mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="group inline-flex items-center gap-2 text-sm text-mist transition duration-300 hover:text-neon"
      >
        <Home className="size-4 shrink-0 transition duration-300 group-hover:text-neon" strokeWidth={1.75} />
        {privacy.backToHome}
      </Link>

      <article className="mt-8">
        <h1 className="font-display text-3xl text-chalk sm:text-4xl">
          {privacy.pageTitle}
        </h1>
        <p className="mt-3 text-sm text-mist">{privacy.lastUpdated}</p>

        <p className="mt-8 text-base leading-relaxed text-mist">
          {privacy.intro}
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          {privacy.dataPrinciple.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          <RichText segments={privacy.dataPrinciple.body} />
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          {privacy.permissionsTitle}
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {privacy.permissions.map((permission) => (
            <li
              key={permission.label}
              className="flex gap-3 text-base leading-relaxed text-mist"
            >
              <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-neon" />
              <span>
                <strong className="text-chalk">{permission.label}</strong>{" "}
                {permission.body}
              </span>
            </li>
          ))}
        </ul>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          {privacy.backup.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          {privacy.backup.body}
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          {privacy.driveBackup.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          <RichText segments={privacy.driveBackup.paragraph1} />
        </p>
        <p className="mt-4 text-base leading-relaxed text-mist">
          <RichText segments={privacy.driveBackup.paragraph2} />
        </p>
        <p className="mt-4 text-base leading-relaxed text-mist">
          {privacy.driveBackup.paragraph3}
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          {privacy.thirdPartySharing.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          {privacy.thirdPartySharing.body}
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          {privacy.dataDeletion.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          {privacy.dataDeletion.body}
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          {privacy.minors.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          {privacy.minors.body}
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          {privacy.policyChanges.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          {privacy.policyChanges.body}
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          {privacy.contactTitle}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          {privacy.contactBody}{" "}
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
        {privacy.backToHome}
      </Link>
    </main>
  );
}
