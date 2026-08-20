# 08 — EU Legal & Consumer Compliance

Non-negotiable requirements mapped to implementation locations.

| # | Requirement | Where | Implementation |
|---|---|---|---|
| 1 | **Omnibus (lowest price in last 30 days)** | ProductCard, PDP, shop grids, search | Show current price; originalPrice strikethrough; tooltip/label "Lowest price in 30 days". If no originalPrice set, fine (no annotation implying a discount). Data: `originalPrice` field. |
| 2 | **Cookie consent — equal weight buttons** | `cookieConsent.jsx` | Both "Accept" and "Reject" same visual weight (one gold, one ghost border) — no hidden rejection; choice persisted; banner re-offers on 6-month expiry; analytics only fire on accept. |
| 3 | **No pre-ticked boxes** | Checkout ContactForm, Newsletter (footer/home) | Newsletter checkbox default `false`; subscribe only on explicit tick. |
| 4 | **GPSR — manufacturer/safety records** | PDP accordion "Manufacturer & Safety", Dashboard Settings → GPSR, legal pages | Accordion shows manufacturer name, brand, EU address, contact, importer note; GPSR records CRUD in dashboard; requirement visible per product. |
| 5 | **Hair products non-returnable** | hair PDP, shipping/returns copy | `isNonReturnable: true` in data; PDP + return policy page state hygiene products excluded from 14-day withdrawal (permitted exception) — shown in a notice on PDP + returns page. |
| 6 | **14-day withdrawal** | Checkout summary, shipping/returns policy page, PDP accordion | Copy: clearly states 14 calendar days from receipt, except non-returnable hygiene items; withdrawal form mention (email) — link to returns page. |
| 7 | **VAT-inclusive prices** | All price displays, checkout | Prices shown VAT-inclusive ("incl. VAT" note in footer + checkout summary). |
| 8 | **Right of withdrawal info before order** | Checkout (before the obligation-to-pay button) | Static disclaimer text above submit: "By ordering you are bound to pay..." + withdrawal info link. |
| 9 | **Order confirmation email** | Checkout SuccessView | Success screen notes confirmation email + order summary; email is mock (no backend) but wording matches legal requirement of confirmation. |
| 10 | **Accessibility of legal info** | All | Legal info is normal readable text; not in images; focus/dialog accessible (Modal/Drawer), Escape works. |

Legal pages (existing files in `src/pages/legal/`): privacy-policy, terms-of-service, return-and-refund-policy (incl. 14-day withdrawal + non-returnable hair), shipping-policy, cookie-policy — content can live in `settings.json` (editable via dashboard) or JSX; if dashboard edits required → move to `settingsApi` and render from data (see `07-dashboard.md` Settings LegalTab). QA pass verifies each checkbox in `09-qa-polish.md`.