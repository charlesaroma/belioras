# 04 — Layout (Phase 2)

## Navbar — `src/components/layout/navbar/`

3-row structure:

1. **Row 1 — AnnouncementBar.jsx** (espresso bg, ivory text, 12px uppercase tracking): rotating messages (free shipping ≥ €150 EU, winter sale %, WELCOME10). Data from `settingsApi`/`promotionsApi`.
2. **Row 2 — main bar** (sticky? `sticky top-0 z-50 bg-ivory-50/90 backdrop-blur`):
   - Desktop: search input (visible, inline, full usable width) — SearchBar.jsx.
   - Center: **Logo.jsx** wordmark (espresso + gold, `.font-display`, "belioras" lowercase; link to `/`; also supports `/logo.svg` if real asset added).
   - Right icon cluster — NavActions.jsx: currency dropdown (EUR · USD · GBP, custom menu, aria), favorites (WishlistContext counter), user icon (→ `/login` or dropdown w/ account/dashboard if authed), cart (CartContext count badge → CartDrawer).
3. **Row 3 — NavLinks.jsx** (border-t umber): Home, What's New, Dresses, Hair, Accessories, FAQ, Contact. Each category item opens MegaMenu on hover/focus.

### MegaMenu.jsx — 4 columns

- Cols 1-3: category children from `categoriesApi` (e.g., Dresses → Maxi, Mini, Midi, Formal, Cocktail; Hair → Brazilian, Indian, Remy, Wigs & Toupees, Bundles; Accessories → Bags, Belts, Scarves, Jewelry).
- Col 4: Featured — 2 product cards (image, name, price) from `productsApi`.
- A11y: `aria-haspopup="true"` + `aria-expanded` on trigger; opens on hover + focus; Escape and click-outside close; AnimatePresence 300ms fade-up; `role="menu"`-ish semantics avoided — use nav + links.
- Public pages for categories exist: `4.dresses`, `5.hair`, `6.accessories` (route `/dresses`, `/hair`, `/accessories`).

### MobileMenu.jsx

- Hamburger (lg:hidden) → Drawer left, accordion category lists, search field, currency toggle, auth links. 44px targets.

### CartDrawer.jsx

- Right drawer, W-96 max-w-full; items (thumb, name, size/color meta, qty QuantitySelector, line total, remove); subtotal; shipping note (computed threshold "You qualify for free shipping"); CTA "Checkout" (→ `/checkout`) + "View Bag" (→ `/cart`? — no dedicated cart page per PRD: CTA goes to `/checkout` only; keep secondary "Continue shopping" that closes).
- Empty state: icon + copy + "Start shopping" link.

### index.jsx (navbar shell)

- Composes rows + mega menu + cart drawer + mobile menu; `AnnouncementProvider` logic inline in AnnouncementBar.

## AI Chat — `src/components/layout/AiChat/`

- `AiChatButton.jsx` — fixed bottom-right, round espresso bg, white sparkle icon, aria-label "Ask Belioras AI", badge dot when unseen. z-[60].
- `ChatDrawer.jsx` — AnimatePresence panel (max-h 70vh): header "Belioras Assistant", message list (user right/gold, bot left/ivory), quick-reply chips (Shipping, Returns, Sizing, Hair care, Contact, GPSR/legal), typing indicator (3 dots), input + send (Enter), auto-scroll, live region for bot messages.
- `chatResponses.js` — rule-based matcher (keyword → response+link), incl.: shipping, returns (14-day + hair non-returnable), sizing guides, hair care, order tracking (link), coupons, GPSR/manufacturer, contact; fallback apology + "contact-us" link.

## Other Layout

- `footer.jsx` — 4 cols: brand blurb + socials (lucide icons), Shop links, Help links (legal pages, guides, tracking), Newsletter (email input + subscribe; success toast; no pre-ticked). Bottom: payment method icons (text badges), copyright, "Prices include VAT".
- `cookieConsent.jsx` — full-width bottom bar: text + equal-weight "Accept" (gold) / "Reject" (ghost) buttons.
- `ScrollToTop.jsx` — router location change → window.scrollTo top (or `{behavior:'smooth'}` disabled on reduced motion).
- `NotFound.jsx` — 404 hero: large display "404", copy, "Back to shop" btn-primary.

## App.jsx

- `AppProviders` (Currency, Auth, Cart, Wishlist, Toast) + RouterProvider with layout route (`<Navbar/><Outlet/><Footer/><AiChat/><CookieConsent/><ScrollToTop/>`) + all routes.

## Acceptance

- [ ] 3-row navbar visible per spec; search inline desktop, icon mobile.
- [ ] Mega menu keyboard navigable, closes on Esc/outside; no layout shift on hover.
- [ ] AI chat answers 6 sample questions correctly; typing indicator shows.
- [ ] Cart drawer math correct; free-shipping threshold messaging works with EUR and USD.
- [ ] Cookie bar: both buttons equal size/weight; reject persists choice (localStorage).
- [ ] 404 page reachable; footer links all resolve.