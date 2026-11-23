# iPhone survey — storage approval proposal

Status updated 3 November 2026: owner explicitly approved the dedicated table and optional email. Migration `create_private_iphone_interest_responses` applied to project `dnktrdnvajefiekayqsk`. RLS enabled; anon/authenticated have no public read access and anon has no direct insert. Existing tables unchanged. Edge Function `iphone-interest` v1 ACTIVE with gateway JWT verification enabled. Frontend and Next proxy remain local, not deployed to the live website.

The Edge Function uses its built-in server service credentials, not browser secrets. Next proxies bounded JSON using the existing publishable/anon key. Origin checks and strict validation are active; no new rate limiting. Security advisor reports only INFO for RLS without policies: intentional because public roles have no table access and the server performs inserts.

Verified: TypeScript and focused ESLint pass; local endpoint rejects invalid payload (400) and foreign origin (403); database insert in a rolled-back transaction passed and persisted row count remains zero. Full submission with a disposable email and cleanup awaits the separately requested user approval. No claim of full end-to-end success yet.

Optional email input is implemented with an unchecked opt-in. This creates an update list only; no mail provider, automatic email delivery or marketing campaign has been enabled.

## Proposed scope

Create a dedicated `iphone_interest_responses` table in the existing Shift Smart Supabase project. No paid resource and no change to reviews or feature requests.

Fields: generated id and timestamp; survey version; device (iphone/android/both/other); shift worker (yes/not_currently); interest (yes/maybe/not_relevant); optional comment up to 500 characters; language (he/en); allowlisted source (website/instagram/whatsapp/direct/other). Reject arbitrary source strings and extra fields. Do not store raw IP, user agent, full referrer, name or phone number.

Optional email registration is a separate decision. Current prototype intentionally has no email field. If approved, store an optional email and explicit opt-in timestamp/version privately, use only for iPhone availability updates, and document deletion requests and retention before launch. Do not subscribe users to unrelated marketing.

## Access

Enable RLS. No anonymous/authenticated SELECT, UPDATE or DELETE. Prefer server-only INSERT using existing server credentials, with no secret exposed to the browser. Do not broaden existing table permissions. Public visitors must not see individual responses, email addresses or free text.

The endpoint must validate bounded enums, comment length and body size, check origin, return generic errors, and use an idempotency token/unique constraint to avoid duplicate retries. Browser repeat-vote checks are a convenience, not proof of one person. No rate-limiting system previously deferred may be enabled without separate approval.

## Required before public launch

1. Explicit owner approval for the new table and its access model; decide whether to collect email.
2. Verify current Supabase docs and existing project schema/credentials read-only, then prepare and review exact migration before application.
3. Implement server endpoint and UI success/error/retry behavior. Display success only after confirmed persistence. No responses or emails in analytics events/logs.
4. Add accurate website privacy copy for survey storage and contact/deletion policy. The app privacy document is maintained separately.
5. Verify using an explicitly approved disposable record, clean it up only with permission; inspect access controls read-only.
6. Add public source-tagged links, dedicated share/story artwork, and review OG preview. Current public link `/iphone` must not be distributed until the route is deployed and storage works.
7. Preview review, then separate approval to replace the live site. Remove draft notices and noindex only when ready. Roll back by restoring the prior deployment; preserve stored responses.

No changes have been applied to Supabase, production Vercel or existing submission paths.
