-- טיוטה היסטורית, 27.10.2026. נוסח מעודכן כבר הוחל באישור המשתמש.
-- הנוסח שהוחל נמצא ב-docs/applied-public-permissions.sql, כולל הסרת MAINTAIN.
-- אין להריץ טיוטה זו מחדש.
-- מטרה: לצמצם הרשאות עודפות ולחייב pending בהצעות חדשות.
-- לפני החלה: לבדוק שאין כלי ניהול שמסתמך על הרשאות authenticated אלה,
-- לשמור את הגדרות ההרשאות הקיימות, ולהריץ בדיקות כתיבה בסביבה מבודדת.
-- אין שינוי בנתונים קיימים, במפתחות או ב-service_role.
begin;

revoke update, delete, truncate, references, trigger
  on table public.reviews, public.feature_requests from anon, authenticated;

-- קריאת הצעות אינה נדרשת למבקר; כיום RLS מחזיר אפס שורות בכל מקרה.
revoke select on table public.feature_requests from anon, authenticated;

-- הלקוח שולח רק את שדות הטופס. סטטוס ותאריך מתקבלים מברירות המחדל במסד.
revoke insert on table public.reviews from anon;
revoke insert (id, name, rating, content, status, created_at)
  on table public.reviews from anon;
grant insert (name, rating, content) on table public.reviews to anon;

revoke insert on table public.feature_requests from anon;
revoke insert (id, name, feature_text, status, created_at)
  on table public.feature_requests from anon;
grant insert (name, feature_text) on table public.feature_requests to anon;

alter policy "public insert feature requests"
  on public.feature_requests with check (status = 'pending');

-- בכוונה rollback: שינוי ל-commit ייעשה רק לאחר אישור והכנת בדיקות מתאימות.
rollback;
