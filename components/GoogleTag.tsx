"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";

import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/cookieConsent";
import { GA_MEASUREMENT_ID } from "@/lib/links";

/**
 * טוען את Google tag (gtag.js) רק אחרי שהמשתמש הסכים לעוגיות ב-CookieConsent.
 * מאזין לחנות ההסכמה המשותפת (lib/cookieConsent.ts) דרך useSyncExternalStore
 * — לא props ולא context נפרד — כך שברגע שהמשתמש לוחץ "מאשר/ת" בסשן הנוכחי
 * הרכיב מתעדכן ומרנדר את התגיות מיד, בלי רענון דף. בדחייה או לפני החלטה
 * (consent === null) לא מרונדר כלום.
 */
export default function GoogleTag() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (consent !== "accepted") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
