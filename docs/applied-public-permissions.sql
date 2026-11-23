-- הוחל בפרויקט האתר לאחר אישור המשתמש, 27.10.2026.
-- Migration: tighten_landing_public_form_permissions
revoke update, delete, truncate, references, trigger, maintain on table public.reviews, public.feature_requests from anon, authenticated;
revoke select on table public.feature_requests from anon, authenticated;
revoke insert on table public.reviews from anon;
revoke insert (id, name, rating, content, status, created_at) on table public.reviews from anon;
grant insert (name, rating, content) on table public.reviews to anon;
revoke insert on table public.feature_requests from anon;
revoke insert (id, name, feature_text, status, created_at) on table public.feature_requests from anon;
grant insert (name, feature_text) on table public.feature_requests to anon;
alter policy "public insert feature requests" on public.feature_requests with check (status = 'pending');
do $verify$
begin
  if has_column_privilege('anon','public.reviews','status','INSERT') or
     has_column_privilege('anon','public.feature_requests','status','INSERT') or
     has_table_privilege('anon','public.feature_requests','SELECT') or
     has_table_privilege('anon','public.reviews','TRUNCATE') or
     has_table_privilege('authenticated','public.reviews','UPDATE') then
    raise exception 'Permission tightening verification failed';
  end if;
  if not has_column_privilege('anon','public.reviews','content','INSERT') or
     not has_column_privilege('anon','public.feature_requests','feature_text','INSERT') or
     not has_table_privilege('anon','public.reviews','SELECT') then
    raise exception 'Required public form permissions missing';
  end if;
end $verify$;
