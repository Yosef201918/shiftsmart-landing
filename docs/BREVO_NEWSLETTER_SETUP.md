# Brevo Free + Shift Smart release newsletter

3 November 2026. Owner requested Brevo Free and a newsletter. No discount has been promised, created or activated.

## Current state

- Local UI in `components/NewsletterSignup.tsx`, inside the existing footer. Hebrew/English, email input, separate unchecked newsletter consent, confirmation-email wording. No migration or newsletter table added.
- `/api/newsletter` GET exposes only `{enabled}`. POST validates origin, bounded 2 KB JSON, email, explicit consent, language and honeypot. When configured, requests Brevo double opt-in; does not claim subscription is complete just because the provider accepted a request. No email in URLs, analytics events or application logs.
- `/newsletter-confirmed` is a noindex informational landing page. Its text is conditional on arriving through the actual provider confirmation link; opening it directly does not prove subscription.
- Account is NOT connected. Registration page is open for the owner at https://onboarding.brevo.com/account/register . Signup page states free/no credit card. Owner must complete credentials/terms and any account verification. No account was created or terms accepted by the agent.
- No connected Brevo plugin was found. No new Make scenario, email campaign, recipient import or outgoing email was created.

## Finish account setup

1. Owner completes free account signup/login. Keep Free; do not add payment or buy a plan.
2. Configure sender and authenticate the sending domain using the DNS records actually supplied by Brevo. Do not guess DNS entries or change unrelated website records. Ask for authorization if a new DNS/access action requires it.
3. Create a dedicated release-updates list. Keep iPhone-only opt-ins separate. Do not import survey emails into the general newsletter without their separate consent.
4. Create and activate a double-opt-in template, with clear Shift Smart release-news consent text and the confirmation link configured according to Brevo's current instructions (`{{ params.DOIurl }}`). Redirect to `https://www.shift-smartapp.com/newsletter-confirmed`. Use bilingual content initially, or implement separate verified templates/lists per language before claiming language-specific delivery.
5. Configure server-only values: `BREVO_API_KEY`, `BREVO_NEWSLETTER_LIST_ID`, `BREVO_DOI_TEMPLATE_ID`. No `NEXT_PUBLIC_` API key. Do not paste credentials into chat or logs. API-key creation is a persistent-access action requiring user completion/approval. The existing iPhone Edge Function does not need this key.
6. Rebuild Preview with those values, verify a user-approved real mailbox and DOI confirmation, unsubscribe and error states. Confirm Free account sending limits and sender approval before enabling. Configuration presence alone is not proof of delivery.
7. Publish only after approval for the concrete release. Public production route and callback must exist before distributing links. Preview emails redirect to production deliberately; do not run real DOI testing until callback availability is addressed.

## Release workflow and limits

Brevo Free currently provides 300 sends/day, not an unlimited campaign. Confirmation emails consume sending capacity too. For 1,000 newsletter recipients, a release update needs at least four daily batches at this cap; that is a planning minimum, not an implemented scheduler or a delivery-time promise. Unused daily capacity does not roll over. Free campaigns over the daily cap require Brevo's requeue workflow; do not assume automatic multi-day draining or schedule campaigns without checking the current account behavior.

Only actual app releases should produce release newsletters, not website previews/deployments. No release-triggered automation has been armed. Draft an update after the app version is published, preview it and then send to confirmed, eligible contacts with a working unsubscribe link. Respect suppression/unsubscribed addresses; do not re-add them via survey import. No upgrade or billing without owner approval.

## iPhone demand and discounts

The survey can launch without Brevo because its optional iPhone-only email list is stored in the approved private Supabase table. Full disposable-record test and deletion approval remains pending. No iPhone recipient has been sent an email.

Do not tie an incentive to answering “yes” in the survey. Demand decisions should use iPhone shift workers expressing genuine intent, not newsletter subscriber totals. An optional Pro reward is an idea only. Google Play promo codes and discounted one-time product offers are different mechanisms; inspect the app's actual product/billing setup before proposing an exact code or percentage. No Google Play modification is authorized by merely discussing a possible reward.

## Sources checked

- https://help.brevo.com/hc/en-us/articles/208589409-About-Brevo-s-pricing-plans
- https://help.brevo.com/hc/en-us/articles/208580669-FAQs-What-are-the-limits-of-the-Free-plan
- https://developers.brevo.com/reference/create-doi-contact
- https://help.brevo.com/hc/en-us/articles/208771869-Create-a-sign-up-form-in-Brevo
- https://support.google.com/googleplay/android-developer/answer/6321495
- https://support.google.com/googleplay/android-developer/answer/16430488

## Rollback

Leave provider config absent to keep registration disabled, or revert the website deployment. Preserve existing survey responses. Do not delete contacts or cancel subscriptions without authorization. No changes to existing reviews, gallery drag behavior or protected slogans.
