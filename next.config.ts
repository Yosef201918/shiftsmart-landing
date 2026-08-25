import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    /*
     * קיים package-lock.json גם בתיקיית הבית של המשתמש, ולכן Next היה מסיק
     * ממנה את שורש ה-workspace. הצמדה מפורשת לתיקיית הפרויקט מונעת פתרון
     * מודולים מהמקום הלא נכון.
     */
    root: path.resolve(__dirname),
  },
  /*
   * כותרות אבטחה גלובליות לכל הנתיבים. במכוון בלי Content-Security-Policy
   * בשלב הזה: האתר טוען Google Fonts, Vercel Analytics ו-Supabase ממקורות
   * חיצוניים שונים, ו-CSP שגוי היה עלול לחסום אותם בשקט בלי שגיאת build —
   * זה דורש רשימת דומיינים מדויקת ולא ניחוש, ונשאר כמשימת המשך נפרדת.
   */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
