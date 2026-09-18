import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/links";

/*
 * אותה לוגיקת נפילה אחורה בדיוק כמו siteUrl ב-app/layout.tsx (כולל התיקון
 * שם: נפילה ל-SITE_URL הקבוע בפרודקשן במקום ל-VERCEL_URL הספציפי-לדיפלוי,
 * כשמשתנה הסביבה חסר). חייבת להישאר זהה ל-layout.tsx כדי שהסייטמאפ תמיד
 * יצביע על אותו דומיין שהאתר עצמו רץ עליו.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_ENV === "production"
    ? SITE_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

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
