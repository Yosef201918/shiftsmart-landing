-- הצעה בלבד: לא הוחל. בדיקה בצד המסד גם לפניות ישירות ל-REST.
-- אין מחיקה/עדכון נתונים או שינוי הרשאות. מגבלות האורך הקיימות נשמרות.
BEGIN;
ALTER TABLE public.reviews ADD CONSTRAINT reviews_name_visible CHECK (name IS NOT NULL AND char_length(regexp_replace(name, U&'[\0001-\0020\007f-\00a0\00ad\034f\061c\1680\180e\2000-\200f\2028-\202f\205f\2060-\206f\3000\feff]', '', 'g')) > 0) NOT VALID;
ALTER TABLE public.reviews ADD CONSTRAINT reviews_content_visible CHECK (content IS NOT NULL AND char_length(regexp_replace(content, U&'[\0001-\0020\007f-\00a0\00ad\034f\061c\1680\180e\2000-\200f\2028-\202f\205f\2060-\206f\3000\feff]', '', 'g')) > 0) NOT VALID;
ALTER TABLE public.feature_requests ADD CONSTRAINT feature_requests_name_visible CHECK (name IS NOT NULL AND char_length(regexp_replace(name, U&'[\0001-\0020\007f-\00a0\00ad\034f\061c\1680\180e\2000-\200f\2028-\202f\205f\2060-\206f\3000\feff]', '', 'g')) > 0) NOT VALID;
ALTER TABLE public.feature_requests ADD CONSTRAINT feature_requests_feature_text_visible CHECK (feature_text IS NOT NULL AND char_length(regexp_replace(feature_text, U&'[\0001-\0020\007f-\00a0\00ad\034f\061c\1680\180e\2000-\200f\2028-\202f\205f\2060-\206f\3000\feff]', '', 'g')) > 0) NOT VALID;
ALTER TABLE public.reviews VALIDATE CONSTRAINT reviews_name_visible;
ALTER TABLE public.reviews VALIDATE CONSTRAINT reviews_content_visible;
ALTER TABLE public.feature_requests VALIDATE CONSTRAINT feature_requests_name_visible;
ALTER TABLE public.feature_requests VALIDATE CONSTRAINT feature_requests_feature_text_visible;
COMMIT;
