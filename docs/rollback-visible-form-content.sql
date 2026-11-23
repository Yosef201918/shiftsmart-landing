-- Recovery only: removes the four visible-content checks, leaves other constraints and permissions intact.
BEGIN;
ALTER TABLE public.reviews DROP CONSTRAINT reviews_name_visible;
ALTER TABLE public.reviews DROP CONSTRAINT reviews_content_visible;
ALTER TABLE public.feature_requests DROP CONSTRAINT feature_requests_name_visible;
ALTER TABLE public.feature_requests DROP CONSTRAINT feature_requests_feature_text_visible;
COMMIT;
