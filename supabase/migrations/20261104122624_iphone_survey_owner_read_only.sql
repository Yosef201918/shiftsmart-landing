grant select on table public.iphone_interest_responses to authenticated;

create policy "iphone_survey_owner_read_only"
on public.iphone_interest_responses
for select
to authenticated
using ((select auth.jwt() ->> 'email') = 'yoseffstor@gmail.com');
