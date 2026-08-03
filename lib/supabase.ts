import { createClient } from "@supabase/supabase-js";

/**
 * שורה בטבלת reviews ב-Supabase. תואמת בדיוק לעמודות שהוגדרו שם —
 * status תמיד מגיע מהשרת (ברירת המחדל "pending" מוגדרת בטבלה עצמה,
 * לא בקוד), ולכן שדה זה לא נשלח בכלל בהוספת ביקורת חדשה.
 */
export interface ReviewRow {
  id: string;
  name: string;
  rating: number;
  content: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

/** שדות שהלקוח מספק בעת יצירת ביקורת — id/status/created_at נקבעים בשרת */
export type NewReview = Pick<ReviewRow, "name" | "rating" | "content">;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/*
 * לא זורקים חריגה כאן: הקובץ הזה נטען ברמת המודול (import), לפני שכל
 * try/catch ברכיב מקבל סיכוי לתפוס משהו. חריגה כאן הייתה מפילה את כל
 * העמוד (לא רק את מקטע הביקורות) אם משתני הסביבה חסרים בפריסת Vercel —
 * למשל בדיוק המצב שקרה בפועל כשהם עדיין לא הוזנו שם. במקום זאת מתעדים
 * שגיאה ברורה לקונסולה וממשיכים עם כתובת placeholder תקנית מבחינת
 * תחביר; הקריאה בפועל ל-Supabase תיכשל בצורה מבוקרת (רשת/DNS) והשגיאה
 * הזו כן נתפסת ומטופלת ברכיב Reviews, כולל לוג משלה.
 */
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase Error: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Check .env.local locally, or the Environment Variables section of the Vercel project settings in production.",
  );
}

/*
 * מפתח ה-anon הוא ציבורי במתכוון (NEXT_PUBLIC_) — הוא מוגן ע"י Row Level
 * Security בצד Supabase, לא ע"י הסתרה. לקוח יחיד לכל האתר, ללא state
 * מקומי (auth: {persistSession: false}) כי אין כאן התחברות משתמשים.
 */
export const supabase = createClient(
  supabaseUrl || "https://misconfigured.supabase.co",
  supabaseAnonKey || "misconfigured-anon-key",
  { auth: { persistSession: false } },
);
