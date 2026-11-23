-- נקודת חזרה למצב שאומת ב-27.10.2026 לפני תיקון ההרשאות.
-- אינה מיועדת להרצה שגרתית: היא מחזירה הרשאות רחבות שהוחלט לצמצם.
-- הוכן לצורך התאוששות בלבד, ולא הורץ.
begin;
revoke insert (name, rating, content) on public.reviews from anon;
revoke insert (name, feature_text) on public.feature_requests from anon;
grant all privileges on table public.reviews, public.feature_requests to anon, authenticated;
alter policy "public insert feature requests" on public.feature_requests with check (true);
rollback;
