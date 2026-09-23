# Belioras — Product Requirements Document

## 1. Purpose & positioning

Belioras is a luxury fashion and hair e-commerce boutique: dresses, hair extensions/wigs, and accessories, sold through an editorial-luxury storefront (see `belioras-design.md` for the visual language — espresso/gold/ivory palette, serif display type, restrained motion). The product is the full customer journey — browse, filter, buy, track, and manage an account — plus the staff tooling to run the shop day to day.

This document describes the product as built today: a complete, mock-data-backed frontend, ready to be wired to a real backend (see `System-Architecture.md` for that boundary).

## 2. Target users

Two realms, two doors, never crossed:

- **Shopper (customer realm)** — signs in at `/login`. Browses, buys as a guest or signed in, tracks orders, manages an account (orders, wishlist, addresses, wardrobe, settings).
- **Staff (admin realm)** — signs in at `/atelier`, linked from nowhere public. Two roles: `staff` (day-to-day operations — orders, customers, catalogue, discounts, reviews) and `super-admin` (also transactions/finance, team/role management). `authApi.login({ realm })` refuses a staff account at `/login` and a customer account at `/atelier` — the same 401 either way, so the public form can't be used to discover which addresses belong to staff.

## 3. Feature set as built

### Storefront (shopper-facing, signed in or not)
- Home page: hero, featured categories, new arrivals, best sellers, brand story, testimonials, Instagram grid.
- Shop/catalogue: every collection (New Arrivals, Dresses, Hair, Accessories) and every filtered slice of them served through one catalogue page and the menu tree — a URL not in the menu 404s, one that is always resolves to real products.
- Product detail: gallery, colour/size selection with live stock per variant, size guide (dresses/footwear/hair, each with its own reference table), SKU, reviews (read + submit), related pieces.
- Reviews: any signed-in customer can leave a rating and a written review on a product they're viewing. A submission is pending until a moderator publishes it — it does not appear anywhere on the storefront until then. A published review can carry a public reply from the shop. "Verified purchase" is a badge (checked against the customer's own order history for that product), not a gate — a non-purchaser can still leave a review.
- Cart: a drawer, not a page. Opens automatically on every add (not just the first), with quantity/remove controls and a running subtotal.
- Checkout: guest by design (no forced registration). Delivery address (typed, or picked from a saved one), a shipping zone computed from country (flat rate or free above a threshold, or "not shipped here" for unsupported countries), a coupon code field, VAT-inclusive pricing with the tax broken out for display, and an order confirmation page. Payment is explicitly not live — the page says so outright, nothing is charged, no card details are collected, and the order is created in `to-pay` status.
- Order tracking (guest, no login required): reference + email lookup, shows a four-stage timeline (To pay → To ship → Shipped → Delivered) or an off-timeline message for a cancelled/refunded order, plus tracking number and carrier once the order has shipped.
- Account (signed in): profile overview, order history + detail (with self-serve cancellation while an order is still To pay or To ship, and reorder), wishlist, address book (add/edit/remove/set default), wardrobe (what the customer owns and their usual sizes, derived from order history — nothing new stored), settings (profile, password, preferences, newsletter).
- Legal/support: FAQ, contact, about, hair length guide, shoe size guide, five legal pages (privacy, terms, shipping, returns, cookies) — all EU-compliance-aware (see `08-eu-legal-compliance.md`).

### Admin dashboard (staff-facing, `/dashboard/*`)
Fourteen built modules, sidebar-ordered — Overview, Products, Inventory, Categories & Colours, Sizes & Guides, Mega Menu, Orders, Transactions (finance, super-admin only), Discounts, Customers, Reviews (moderation), Newsletter, Team, Settings. Full detail in `docs/07-dashboard.md`. In short: every piece of catalogue data (products, colours, sizes, size guides, categories, the navigation menu itself), every order and its status, every coupon code, every review, every customer and staff record, and every shop-wide setting (shipping zones, tax, legal-page text, GPSR records) is editable here — and every edit is live on the storefront immediately, because both sides read the same store.

## 4. Known gaps & deferred work

Recorded here so nothing is silently lost between this pass and the next:

- **Returns / RMA.** No customer-initiated return-request flow exists. `refunded` is a status an admin can set on an order; there is no request, approval, or processing step around it.
- **Gift cards.** Not present in any form.
- **Per-product/category coupon scoping.** Coupons are deliberately global-only today (percent, fixed amount, or free shipping across the whole order) — a client request to scope a coupon to specific products or categories would need a real schema and checkout-logic change.
- **Avatar upload.** `user.avatar` is read and rendered, never written — no upload endpoint exists.
- **Real invoices.** The account "Receipt" action is `window.print()` against a print stylesheet. A sequential invoice number and VAT breakdown as a real legal document belongs on the server.
- **Account: notification preferences, delete account, active sessions.**
- **Back-in-stock alerts.**
- **Reports** (`2.reports`, sales/analytics) and **Messages** (`13.messages`, a contact-form inbox for staff) — reserved sidebar slots, never built. Today, contact-form submissions have nowhere to land for staff to see.
- **Client-side-only authorization.** `RequireAuth`/capability checks happen in the React app, not on a server. A forged localStorage session can currently reach admin routes. This is the single most important item for the backend integration to close before any real launch — see `System-Architecture.md` §6 and the SRS's non-functional requirements.
- **Order-status transitions have no server-side ownership or role check** in the mock layer (e.g. `updateOrderStatus` doesn't verify the caller owns the order or has the right role) — the UI-level guards are real, but a direct call bypasses them. Flagged explicitly during the order-cancellation build (`docs/11-client-account.md`).

## 5. Success criteria / acceptance

Each numbered build doc (`docs/01` through `docs/11`) carries its own acceptance checklist for the area it covers. `docs/09-qa-polish.md` is the final cross-cutting pass (accessibility, responsiveness, lint, build). There is no automated test suite in this repo — verification throughout has been manual: `npx eslint src` + `npx vite build` after every change, plus Puppeteer-driven browser checks exercising the actual user flows end to end.
