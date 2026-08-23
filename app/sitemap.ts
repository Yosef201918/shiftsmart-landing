import type { MetadataRoute } from "next";

/*
 * אותה לוגיקת נפילה אחורה בדיוק כמו siteUrl ב-app/layout.tsx: NEXT_PUBLIC_
 * SITE_URL קובע דומיין קבוע בפרודקשן, VERCEL_URL הוא נפילה אחורה אוטומטית
 * שוורסל מזריק לכל דיפלוי (כולל preview deployments), localhost רק לפיתוח
 * מקומי. חייבת להישאר זהה ל-layout.tsx כדי שהסייטמאפ תמיד יצביע על אותו
 * דומיין שהאתר עצמו רץ עליו.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
