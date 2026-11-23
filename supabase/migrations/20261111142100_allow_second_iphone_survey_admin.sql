alter policy iphone_survey_owner_read_only
on public.iphone_interest_responses
using (
  lower((select auth.jwt() ->> 'email')) = any (
    array[
      'yoseffstor@gmail.com',
      'y0556771780@gmail.com'
    ]::text[]
  )
);
