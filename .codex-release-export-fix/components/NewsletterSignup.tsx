"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import SenderFormEmbed from "@/components/SenderFormEmbed";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const FORM_IDS = { he: "dBBk5J", en: "aM8y3Q" } as const;

export default function NewsletterSignup() {
  const { lang } = useLanguage();
  const he = lang === "he";
  return <section id="newsletter" aria-labelledby="newsletter-heading" className="border-b border-white/10 px-4 py-6 sm:p-9 lg:p-12">
    <div className="grid items-start gap-7 lg:grid-cols-2 lg:gap-16">
      <div>
        <p className="flex items-center gap-2 text-xs text-neon"><Mail size={16} aria-hidden="true" />{he ? "נשארים מעודכנים" : "STAY UPDATED"}</p>
        <h2 id="newsletter-heading" className="mt-3 max-w-md font-display text-2xl leading-snug text-chalk sm:text-3xl">{he ? "גרסה חדשה? תקבלו עדכון במייל." : "New version? Get an email update."}</h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-mist">{he ? "הירשמו לעדכוני הגרסאות של Shift Smart: מה התחדש ואיפה מורידים. אפשר להסיר את ההרשמה בכל הודעה." : "Get Shift Smart release news: what’s new and where to download. You can unsubscribe in every email."}</p>
      </div>
      <div className="newsletter-form min-w-0">
        <div className="-mx-4 sm:mx-0">
          <SenderFormEmbed key={lang} formId={FORM_IDS[lang]} lang={lang} unavailableText={he ? "לא הצלחנו לטעון את ההרשמה כרגע. אפשר לנסות שוב." : "We couldn’t load the signup form. Please try again."} />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-mist">
          {he ? "ההרשמה נפרדת מעדכוני iPhone. נשלח אליכם קישור אישור להצטרפות. " : "This signup is separate from iPhone updates. We’ll email you a confirmation link. "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-neon">{he ? "מדיניות פרטיות" : "Privacy policy"}</Link>
        </p>
      </div>
    </div>
  </section>;
}
