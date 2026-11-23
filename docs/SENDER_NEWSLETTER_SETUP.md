# Sender Free — release newsletter handover

3 November 2026. Owner registered with Sender and authorized continuing the newsletter integration. Brevo setup is abandoned; do not resume it.

## Current access and changes

Sender is authenticated in the chat browser. The account's email verification is complete (the onboarding dashboard shows green checks for Complete registration and Verify email address). Do not copy activation URLs or tokens into chat or project files.

Billing shows a **Professional trial** with 13 days remaining. Sender states the account will move to Free Forever when the trial ends; no payment method is saved. Do not click Keep Pro Features, add a card, purchase SMS credit, or upgrade. This is not yet a confirmed Free-plan state. Account settings display **Account is under review** and say Sender will provide an update within one hour. No review result is available yet.

The account already had `shift-smartapp.com` in its Domains list. After the owner followed Sender's verification email, the dashboard showed a green check for Ownership confirmed. Authentication has not yet been confirmed in Sender. Sender supplied these exact DNS values:

| Type | Name | Value |
|---|---|---|
| CNAME | `sender._domainkey` | `dkim.sendersrv.com` |
| TXT | `@` | `v=spf1 include:spf.improvmx.com include:sendersrv.com ~all` |
| TXT | `_dmarc` | `v=DMARC1; p=none;` |

Vercel readback in team scope `shiftsmart-landing` confirmed the original SPF and all six website/system records and two ImprovMX MX records. With the owner's approval, Sender DKIM and DMARC were added:

| Record ID | Type | Name | Value | TTL |
|---|---|---|---|---|
| `rec_3f8770946a48956a73578644` | CNAME | `sender._domainkey` | `dkim.sendersrv.com.` | 60 |
| `rec_2ac08e7bacb81b10dd982a71` | TXT | `_dmarc` | `v=DMARC1; p=none;` | 60 |

With the owner's approval, the SPF policy was updated in the Vercel dashboard to `v=spf1 include:spf.improvmx.com include:sendersrv.com ~all`. The existing single SPF record is now ID `rec_3e0dad6223c1eda9701c1793`. Vercel readback returned 11 total records with no next page; all six site/system records and both ImprovMX MX records remain present. DKIM and DMARC were also added as listed above. No second SPF policy was created. Public DNS resolution was not available from this environment; Sender has not yet confirmed authentication.

Created a dedicated empty group `Shift Smart — עדכוני גרסאות` (ID `egG763`). The existing `Test group (y0556771780@gmail.com)` and its single contact were left untouched.

Created embedded-form draft `Shift Smart — הרשמה לעדכוני גרסאות` (form ID `dBBk5J`). It has a Hebrew title, email-only field, RTL direction, unchecked required consent with app-release-only wording, and assignment to the dedicated group. The form remains a DRAFT and is not embedded. The submit button and privacy helper still have generic English wording. Publishing settings show Double opt-in disabled and unavailable with the notice “Double opt-in is only available on verified accounts.” Sender email and domain ownership are verified, but account approval remains under review; no DOI setup can be considered complete.

The account's Publishing settings exposed the actual embed code. Public account identifier: `22dff9d6a44209`; form ID: `dBBk5J`. Javascript: load `https://cdn.sender.net/accounts_resources/universal.js` once and initialize `sender('22dff9d6a44209')`. Form mount: `<div style="text-align: left" class="sender-form-field" data-sender-form-id="dBBk5J"></div>`. Do not add this to the website until DOI and consent behavior are verified and the form is approved for a Preview. The draft shows 0 subscribed, 0 visitors and 0% conversion. A submit attempt during editor work showed consent is required and unchecked; no subscriber was added.

No campaign, automation, API token, contact import or mailing was created. The Sender ownership verification email was received at the forwarded alias and verified by the owner. No newsletter or subscriber test was sent.

Local website copy/privacy/callback now names Sender instead of Brevo. The old Brevo transport and env-variable activation were removed from `/api/newsletter`. It reports disabled and rejects submission until the actual Sender form is configured and verified. No fake confirmation state is shown. Preview `5cjz4020z` predates this switch and still contains the inactive Brevo wording; do not treat it as the final Sender version.

## Intended integration

Prefer Sender's native embedded form with confirmation checkbox and double opt-in enabled in Publishing settings. Official documentation confirms that such forms keep a subscriber unconfirmed until the confirmation link is clicked. The general create-subscriber API does not document equivalent DOI behavior; do not replace this with a direct subscriber insert while still promising an email-confirmation flow.

Remaining setup:

1. Owner must run the exact interactive Vercel CLI SPF update above; the CLI specifically requires the user to confirm a live-record overwrite. Do not retry via another endpoint or create a second SPF record.
2. Recheck Sender Authentication after the SPF update and DNS propagation. Sender warns updates can take 24–48 hours.
3. Sender's account review request has been submitted with accurate details: the signup form is still a draft, the dedicated group is empty, no contacts have been imported, and future messages will be occasional app release updates for people who explicitly opt in. The dashboard now says the account is under review and promises an update within one hour. Resolve the “verified accounts” eligibility blocking Double Opt-in only through Sender's official flow. Do not substitute a direct create-subscriber API while DOI is disabled.
4. Finish and save the existing form: localize submit/privacy copy, configure sender and confirmation email when available, and keep the form unpublished until the DOI flow is enabled and verified.
5. Use the account-provided embed code above only after those checks; first add it to a concrete Preview, not Production. Test confirmation, duplicates, unsubscribed contacts and opt-out with the user's authorized mailbox only. No campaigns, automations, or imports.
6. Update privacy copy to match the actual data flow. Keep the iPhone-only list separate. Production still requires separate approval.

## Sources verified

- https://www.sender.net/help/lead-capture/connecting-forms-to-lists/
- https://www.sender.net/help/lead-capture/embedded-signup-form/
- https://www.sender.net/help/lead-capture/share-signup-form/
- https://api.sender.net/subscribers/add-subscriber/
- https://www.sender.net/pricing/free-plan/

No percentage discount or Pro code has been promised or configured. No change to Supabase or existing survey/review data in this provider-switch session. Rollback is disabling the newsletter or restoring the prior website deployment while preserving existing responses and subscriptions.

## 2026-11-07 — Owner-authorized Preview integration and one test
Release forms dBBk5J and aM8y3Q are now PUBLISHED with DOI enabled. Consent remains unchecked and required. One owner-approved signup to yoseffstor@gmail.com was performed on Preview o5pia2kxl. Sender logs show DELIVERED for the DOI email; recipient has not found it and confirmation is not complete. No resend, campaign, automation, paid plan, DNS or manual subscription-status change. Success screens were localized and made readable. Latest Preview qg7t97is4 includes lifecycle cleanup; final browser QA blocked by disabled Local browser use and Windows input access denial. See RELEASE_READINESS.md for exact limits. Earlier DRAFT/account-review notes in this document are historical.
