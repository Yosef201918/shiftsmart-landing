create table public.iphone_interest_responses (
id uuid primary key,
created_at timestamptz not null default now(),
survey_version text not null default 'iphone-v1' check (survey_version='iphone-v1'),
device text not null check (device in ('iphone','android','both','other')),
shift_worker text not null check (shift_worker in ('yes','not_currently')),
interest text not null check (interest in ('yes','maybe','not_relevant')),
comment text not null default '' check (char_length(comment)<=500),
language text not null check (language in ('he','en')),
source text not null default 'direct' check (source in ('website','instagram','whatsapp','direct','other')),
email text check (email is null or (char_length(email)<=254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$')),
email_opt_in_at timestamptz,
consent_version text,
constraint email_consent check ((email is null and email_opt_in_at is null and consent_version is null) or (email is not null and email_opt_in_at is not null and consent_version='iphone-email-v1'))
);
alter table public.iphone_interest_responses enable row level security;
revoke all on public.iphone_interest_responses from public, anon, authenticated;
grant insert on public.iphone_interest_responses to service_role;
