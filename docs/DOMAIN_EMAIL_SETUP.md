# Domain email for Sender verification — proposal

3 November 2026. Owner asked to try creating a branded email for Sender. Existing Gmail must not be renamed or replaced. No paid Google Workspace account is needed for the proposed forwarding-only setup.

## Read-only findings

Public DNS queries, 3 November 2026:

- NS: `ns1.vercel-dns.com`, `ns2.vercel-dns.com`.
- MX lookup returned SOA authority only, no MX answers. No domain mail receiving provider detected in this lookup.
- TXT lookup returned a Google site-verification value only, no SPF value observed. Preserve this verification record.

Initial baseline only; see completion record below for changes subsequently authorized and applied.

## Approved scope — account setup pending

Owner explicitly replied “מאושר” to the concrete forwarding proposal. Authorized: create only `updates@shift-smartapp.com`, forward to the existing public app contact `yoseffstor@gmail.com` through ImprovMX Free, and add the corresponding mail DNS records in Vercel. Do not ask again for the same approved scope. Messages to the alias will pass through ImprovMX. Do not create catch-all forwarding or import subscribers.

Fresh public DNS and authenticated Vercel `get_records` checks after approval still show no MX/SPF. All six Vercel records were returned with no next page: Google-verification TXT, three system CAA entries, root ALIAS and wildcard ALIAS. Preserve all six. No DNS mutation has occurred.

Opened ImprovMX signup in the chat browser and filled the approved Gmail account email. No password entered and Create Account not clicked. Owner must choose password and complete signup/terms/email verification. This is a credentials/account-creation handoff, not a renewed request for approval of the domain configuration. Wait for account access and alias ownership before adding MX records. Do not route domain mail into an unconfigured/unclaimed account.

ImprovMX Free currently includes one domain, 25 aliases, 500 forwarded messages/day, and no SMTP sending allowance. It supplies receiving/forwarding; Sender supplies newsletter sending. This is not a new Gmail inbox and does not by itself enable sending regular Gmail messages as the branded alias.

Official generic DNS guide gives the following proposed records, to verify against the account's actual instructions before applying:

| Type | Name | Value | Priority |
|---|---|---|---|
| MX | @ | mx1.improvmx.com | 10 |
| MX | @ | mx2.improvmx.com | 20 |
| TXT | @ | v=spf1 include:spf.improvmx.com ~all | — |

Do not remove existing A/CNAME/TXT records or change nameservers. Re-read DNS immediately before changes. If any MX or SPF appeared in the meantime, stop and assess; do not overwrite mail routing. There must be only one SPF policy at the same hostname. Merge Sender's later provider-supplied SPF include if required rather than adding a second SPF record.

## Next actions after approval

1. Complete ImprovMX Free signup/login. Account creation/credentials/terms require the appropriate user handoff or action-time approval. Official app login opened at https://app.improvmx.com/login . No fields submitted yet.
2. Verify destination email and create only the approved alias. No forwarding rule before destination approval.
3. Apply only the approved mail DNS records, keep a record of newly generated DNS record IDs for reversal, and verify propagation plus alias delivery with an approved test message.
4. Only after receiving works, use `updates@shift-smartapp.com` in Sender's domain-verification flow. Then obtain the actual Sender DKIM/SPF/DMARC records from the logged-in account and configure them separately as required. Do not guess these values.
5. This enables domain receiving and verification; it does not complete Sender's newsletter form, DOI test, survey test, or website release approval.

Rollback: remove only newly added forwarding DNS records and disable the newly created alias if authorized. Do not delete existing records or user messages. Keep website DNS and nameservers untouched.

## Sources

- https://www.sender.net/help/deliverability-compliance/verify-sending-domain/
- https://www.sender.net/help/deliverability-compliance/verify-spf-dkim-records/
- https://www.improvmx.com/pricing/
- https://www.improvmx.com/guides/vercel/
- https://www.improvmx.com/guides/generic-dns-configuration/

## Completed configuration — 3 November 2026

Owner completed ImprovMX account signup and reported the dashboard open. Verified logged in as the approved Gmail in the chat browser. Added `shift-smartapp.com`. Provider automatically created a default `*` alias; renamed it in place to `updates` before DNS activation. Reloaded and checked the Aliases page: exactly one of 25 aliases used, `updates` forwarding to the approved Gmail. No catch-all remains.

Read exact DNS values in the domain's ImprovMX DNS Records page. Rechecked all six existing Vercel records immediately before applying changes; no MX/SPF conflict. Added only:

| New record ID | Type | Value | Priority | TTL |
|---|---|---|---|---|
| rec_2f2704ec1ad624eafc30e7c3 | MX | mx1.improvmx.com. | 10 | 60 |
| rec_9f8fd0f6a063510757e1734a | MX | mx2.improvmx.com. | 20 | 60 |
| rec_bd85306d1998e6839a457590 | TXT | v=spf1 include:spf.improvmx.com ~all | — | 60 |

Authenticated Vercel readback returned nine records with no next page: all six baseline records unchanged plus these three. Provider DNS page updated to green Forwarding with all three checks green. Did not use the paid one-click DNS option, add a card, create SMTP credentials, or upgrade.

This verifies domain forwarding configuration. The user later received and verified Sender's domain-ownership email through the approved `updates@shift-smartapp.com` alias. Sender shows Ownership confirmed. With explicit approval, its DKIM CNAME and DMARC TXT records were added to Vercel, and the existing SPF was merged with Sender's include in the same record. Vercel readback confirms all three Sender authentication records and both ImprovMX MX records; Sender authentication is still awaiting confirmation. The account review request has been submitted and is pending. No test newsletter was sent.

Rollback targets only the three IDs above; preserve existing website aliases, CAA and Google-verification TXT. Removing mail routing interrupts this newly configured address and should only be done if needed/authorized. Sender DKIM/DMARC and any SPF merge must use the future account-provided values, not guesses. General newsletter and iPhone survey remain unpublished.

Sender Billing shows a Professional trial with 13 days remaining and says the account moves to Free Forever after the trial. No payment method is saved; no upgrade or purchase was made. Sender onboarding shows account registration and account-email verification complete.

Sender provided these account-specific records after ownership verification:

| Type | Name | Value |
|---|---|---|
| CNAME | `sender._domainkey` | `dkim.sendersrv.com` |
| TXT | `@` | `v=spf1 include:spf.improvmx.com include:sendersrv.com ~all` |
| TXT | `_dmarc` | `v=DMARC1; p=none;` |

Vercel readback (team scope `shiftsmart-landing`) confirmed current root SPF is `v=spf1 include:spf.improvmx.com ~all` under ID `rec_bd85306d1998e6839a457590`, and no Sender DKIM/DMARC record exists. No Sender DNS change has been applied pending the user's explicit approval for these concrete operations. Keep one SPF record, preserve all six website/system records and two ImprovMX MX entries, and use only the exact values above.
