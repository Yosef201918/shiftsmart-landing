-- CUTOVER ONLY, after the server endpoint works and the server-mode frontend is deployed.
-- Closing these grants before deployment will break the legacy forms.
BEGIN;
REVOKE INSERT ON TABLE public.reviews, public.feature_requests FROM anon, authenticated;
REVOKE INSERT (id,name,rating,content,status,created_at) ON public.reviews FROM anon, authenticated;
REVOKE INSERT (id,name,feature_text,status,created_at) ON public.feature_requests FROM anon, authenticated;
COMMIT;
