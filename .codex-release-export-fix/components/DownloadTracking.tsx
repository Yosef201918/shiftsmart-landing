"use client";

import { useEffect } from "react";

import { getSnapshot } from "@/lib/cookieConsent";
import { GA_MEASUREMENT_ID, PLAY_STORE_URL } from "@/lib/links";

const placements = new Set(["hero", "quick_start", "launch_banner", "sticky_cta", "footer"]);

type AnalyticsWindow = Window & {
  gtag?: (command: "event", name: string, parameters: Record<string, string>) => void;
};

/** Records a store-link activation, never an installation or form contents. */
export default function DownloadTracking() {
  useEffect(() => {
    function record(event: MouseEvent) {
      if (event.defaultPrevented || (event.type === "auxclick" && event.button !== 1)) return;
      if (getSnapshot() !== "accepted") return;
      const anchor = event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>("a[data-download-placement]")
        : null;
      const placement = anchor?.dataset.downloadPlacement;
      if (!anchor || anchor.href !== PLAY_STORE_URL || !placement || !placements.has(placement)) return;

      // No local queue: declining consent or a blocked tag drops the event.
      // Analytics must never delay or prevent the browser's normal navigation.
      try {
        (window as AnalyticsWindow).gtag?.("event", "play_store_click", {
          send_to: GA_MEASUREMENT_ID,
          placement,
          interface_language: document.documentElement.lang === "en" ? "en" : "he",
        });
      } catch {
        // Download links remain usable if analytics is unavailable.
      }
    }

    document.addEventListener("click", record);
    document.addEventListener("auxclick", record);
    return () => {
      document.removeEventListener("click", record);
      document.removeEventListener("auxclick", record);
    };
  }, []);

  return null;
}
