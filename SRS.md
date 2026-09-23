# Belioras — Software Requirements Specification

## 1. Purpose & scope

This SRS covers the Belioras frontend as it stands ahead of real backend integration. It states what the system must do (functional requirements), the qualities it must have (non-functional requirements), and — since this is a frontend-first, mock-data-backed build — what a real backend specifically has to provide for every requirement below to keep holding once the mock layer is removed. See `System-Architecture.md` for the technical detail behind that swap, and `PRD.md` for product framing and deferred scope.

## 2. System overview

A React 19 + Vite + Tailwind v4 single-page application, three independent route trees (auth, storefront, admin dashboard) sharing one provider stack. Data currently lives in a mock persistence layer (`contentStore.js`) over localStorage, seeded from JSON fixtures, accessed exclusively through a service-module API surface that already speaks the shape a real backend would return. Full detail: `System-Architecture.md` §1–§3.

## 3. Functional requirements

### 3.1 Storefront browsing & search
- The system shall present every product collection (New Arrivals, Dresses, Hair, Accessories) and every filtered slice of them through one catalogue mechanism, resolved against a single navigation tree — a URL not present in that tree shall 404.
- The system shall support filtering (category, colour, size, price, sale) and sorting on catalogue listings, and text search across products.
- The system shall present a product detail page with variant (colour × size) selection, live per-variant stock, a size guide appropriate to the product's category, its SKU, and its published reviews.

### 3.2 Reviews
- A signed-in customer shall be able to submit a rating (1–5) and written review for a product.
- A submission shall not be visible anywhere on the storefront until a staff member publishes it from the moderation queue.
- The system shall mark a review "verified purchase" when the reviewing customer's order history includes the reviewed product, without blocking submission from customers who haven't purchased it.
- A published review may carry a shop reply, visible publicly beneath it.

### 3.3 Cart & checkout
- Adding a product to the cart shall open the cart drawer, every time (not only the first add in a session).
- Checkout shall not require account creation.
- The system shall compute shipping cost from a zone derived from the delivery country (flat rate, free above a threshold, or "not shippable" for unsupported countries).
- The system shall accept a coupon code, validate it (active, not expired, minimum order met), and apply its discount (percent off, fixed amount off, or free shipping) to the order total; a free-shipping coupon shall waive the shipping charge itself, not merely appear to.
- Pricing shall be VAT-inclusive, with the tax amount broken out for display, not added on top.
- The system shall refuse to place an order for more units of a variant than are available, with a clear message naming the product and size.
- Payment collection is out of scope for this phase; the system shall disclose this plainly at the point of purchase and shall not collect card details.
- Placing an order shall produce a confirmation page and make the order immediately visible to guest tracking (by reference + email) and, if the customer was signed in, their account order history.

### 3.4 Order tracking & lifecycle
- The system shall expose four canonical order stages (To pay, To ship, Shipped, Delivered) plus two off-timeline outcomes (Cancelled, Refunded), normalized from any legacy status dialect a data source might use.
- Guests shall be able to look up an order by reference and the email it was placed under; a wrong reference and a wrong email shall produce the same not-found response (no confirmation of which is wrong).
- A signed-in customer shall be able to cancel their own order while it remains To pay or To ship, and shall see the resulting cancelled state (with an explanatory message) immediately.
- A staff member shall be able to advance an order forward through its lifecycle (never backward without a correction outside normal flow), and shall be able to record a tracking number and carrier when marking an order shipped; both shall then be visible to the customer, signed in or via guest tracking.
- Marking a shipped order cancelled or refunded shall ask whether its units are physically back in stock before adjusting inventory.

### 3.5 Customer account
- A signed-in customer shall be able to view and manage: order history and detail, a wishlist, an address book (add, edit in place, remove, set default), a derived "wardrobe" view (pieces owned and usual sizes, computed from order history, storing nothing new), and account settings (profile, password, preferences, newsletter subscription).

### 3.6 Admin dashboard
- Staff (capability-appropriate) shall be able to fully manage: products (including stock per variant, and CRUD for categories, colours, sizes, size guides, and the storefront navigation menu), inventory adjustments with a movement history, orders (status, tracking), discount codes, customer records, review moderation, newsletter subscribers/campaigns, staff/role assignment (super-admin only), transactions (super-admin only), and shop-wide settings (shipping zones, tax, legal-page text, GPSR records).
- Every edit made in the dashboard shall be reflected on the storefront and in the customer account area immediately, without a separate publish/sync step, because both read the same underlying store.

### 3.7 Authentication & authorization
- The system shall maintain two entirely separate sign-in realms (customer, staff) that cannot authenticate into each other's door, with indistinguishable failure responses for a wrong-realm attempt versus a wrong password.
- The system shall gate dashboard sections by role/capability (see `utils/roles.js`).

## 4. Non-functional requirements

- **Accessibility.** Minimum touch target 44×44px; visible focus rings throughout; `prefers-reduced-motion` respected; alt text and aria-labelling on interactive/icon-only controls.
- **Internationalization.** Locale-aware currency formatting and display language, mediated by dedicated contexts (`LanguageContext`, `CurrencyContext`) rather than ad hoc formatting at call sites.
- **Legal compliance (EU).** Omnibus-compliant price display (a shown "was" price must be a genuine prior price), equal-weight cookie consent (no dark-pattern accept/reject sizing), no pre-ticked consent boxes, GPSR manufacturer records maintained per product line, hair products marked non-returnable where applicable, 14-day withdrawal handling, VAT-inclusive pricing throughout. Full detail: `docs/08-eu-legal-compliance.md`.
- **Data integrity under a shape change.** Any change to a stored domain's item shape must be paired with a revision bump in its seed, so a client holding stale locally-persisted data is cleanly reseeded rather than silently corrupted (`System-Architecture.md` §3).
- **Performance.** No non-functional performance targets have been formally set for this phase; the build is a client-rendered SPA with no server-side rendering.

## 5. Constraints

- Data is currently backed by browser localStorage via `contentStore.js`, not a real database — see `System-Architecture.md` §3 for exactly what a real backend replaces and what it preserves.
- No payment, transactional-email, or shipping-carrier provider is connected. Every place this matters is disclosed in the UI itself (checkout's payment notice) or flagged in `PRD.md` §4.
- Authorization is enforced client-side only (see §3.7 and `System-Architecture.md` §5) — this is a constraint of the current phase, not an accepted end state.
- No automated test suite exists; verification is manual (lint, build, and scripted browser checks against real user flows).

## 6. Backend integration requirements

For each service module in `src/services/`, a real backend must provide an HTTP endpoint returning the same shape the corresponding mock function returns today (full per-function contract: `docs/02-data-layer.md`), and must additionally:

- Enforce every authorization check the frontend currently only *displays* (§3.7, `System-Architecture.md` §5) — this is the single highest-priority item, since the current state is a genuine access-control gap, not a stylistic one.
- Enforce ownership on customer-scoped mutations (e.g. a customer can only cancel their own order) — currently checked client-side only.
- Provide race-safe coupon redemption (a usage-limit check that can't be beaten by concurrent requests).
- Provide a real payment integration before checkout can honestly stop disclosing "nothing is charged."
- Provide a destination for contact-form messages (no admin-facing inbox exists today — `PRD.md` §4, Messages).

## 7. Data model summary

See `System-Architecture.md` §3 for the persistence pattern and `docs/02-data-layer.md` for the full per-domain field-level contract; this SRS does not restate either.

## 8. Constraints on scope (explicitly out of this phase)

Returns/RMA, gift cards, per-product coupon scoping, avatar upload, real invoices, account deletion, back-in-stock alerts, a sales/reports dashboard, and a staff-facing message inbox. Full list with rationale: `PRD.md` §4.
