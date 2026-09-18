import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/links";

/* אותה לוגיקת נפילה אחורה בדיוק כמו siteUrl ב-app/layout.tsx וב-app/sitemap.ts */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_ENV === "production"
    ? SITE_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
