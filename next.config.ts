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
};

export default nextConfig;
