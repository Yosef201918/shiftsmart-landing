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

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
  );
}

/*
 * מפתח ה-anon הוא ציבורי במתכוון (NEXT_PUBLIC_) — הוא מוגן ע"י Row Level
 * Security בצד Supabase, לא ע"י הסתרה. לקוח יחיד לכל האתר, ללא state
 * מקומי (auth: {persistSession: false}) כי אין כאן התחברות משתמשים.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});
