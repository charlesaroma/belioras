# 06 — Storefront (Phase 4)

## Home — `src/pages/1.home/`

`home.jsx` composes sections (each in `sections/`):

- `Hero.jsx` — full-bleed brand hero: image (hero.png replaced in Phase 6 w/ brand SVG/photo placeholder), eyebrow "New Season", display headline, sub, 2 CTAs (btn-primary "Shop Dresses", ghost "Explore Hair"), floating badge (e.g. "20% off first order" — popup data).
- `ValueProps.jsx` — 3-4 icons row (Free shipping ≥ €150, 14-day returns, Authentic products, Secure checkout) — from settings.
- `FeaturedCategories.jsx` — 3 elegant category cards (Dresses/Hair/Accessories) with images + link.
- `NewArrivalsSection.jsx` — grid of 8 new arrivals (SaleBadge when sale) + "View all" → `/whats-new`.
- `FeaturedProducts.jsx` — bestsellers grid (4-8) + quick "Add to Cart" (opens nothing? adds + toast) + SaleBadge.
- `Testimonials.jsx` — 3 cards: quote, RatingStars, name/city, verified badge.
- `BrandStory.jsx` — split layout image + copy + stats (years, countries, clients).
- `Newsletter` (kit) last.

## What's New — `src/pages/2.whatsNew/`

- `NewArrivalsSection.jsx` — date-badged grid (recent 30 days) + filter chips by category.
- `CategoryShowcase.jsx` — shimmer sections for dresses/hair/accessories featured items.

## Shop & Category Pages

- `3.shop/shop.jsx` — **all products** with ProductFilters sidebar (see below); collection quick links.
- `sections/ProductFilters.jsx` — sidebar (desktop) / mobile drawer: category checkboxes, price range (double slider? implement two number inputs + min/max), color swatches (SwatchGroup), size chips, "On sale" toggle, "Clear all".
- `sections/Sidebar.jsx` — filter container above grid (count + ActiveFilters chips + SortSelect + grid/`list` toggle? keep scope: count + sort).
- `sections/MobileFilters.jsx` — "Filters" button → Drawer with same panel.
- `4.dresses/DressesPage.jsx` + `sections/` — reuse shop sections with category preset; size guide CTA banner.
- `5.hair/HairPage.jsx` + `sections/` — hair-specific facets (length in inches, weight, hairType, color) + non-returnable notice banner + care guide promo.
- `6.accessories/AccessoriesPage.jsx` + `sections/` — reuse shop sections; category chips.

### ActiveFilters.jsx (storefront)

- Chips with × remove each; "Clear all"; results count in header ("X products").

### SortSelect.jsx (storefront)

- Featured / Price low→high / high→low / Newest / Top rated — URL param `?sort=`.

URL state: filters via `useSearchParams` (collection, categories, min, max, colors, sizes, sale, sort, q). `filterSort.js` applies everything; O(n) fine.

## Product Display

- `ProductCard.jsx` (storefront) — image (aspect 3/4, hover second image fade if present), wishlist heart (top-right, toggles, aria-pressed), SaleBadge, name, collection, RatingStars + count, **Omnibus price row** (current price bold; original strikethrough + "Lowest in 30 days" tooltip/title), quick add button (if stock) / "Sold out" overlay.
- `ProductGrid.jsx` — responsive grid 2/3/4 cols + Skeleton loading.
- PDP route: `/product/:slug` — page in `pages/` (new `product/` folder, `sections/`): hero (gallery: main image + thumbnails, Zoom on hover? skip), info column (breadcrumbs, name, rating, Omnibus price, description, color SwatchGroup, size SizeSwatch + size guide link (Modal w/ guide), QuantitySelector, Add to Cart (stock logic), Wishlist btn, trust badges, ETA shipping note, GPSR accordion (manufacturer details), details accordions (Description, Materials & Care, Shipping & Returns incl. hair non-returnable), reviews section (RatingStars breakdown, review cards, verified badges, "Write review" → Modal form saved to reviews store), You may also like (related by category).

## Search — `src/pages/search/`

- `SearchPage.jsx` + `sections/SearchResults.jsx` — reads `?q=`, product grid, "No results" EmptyState with suggestions, recent searches (localStorage chips).

## Checkout — `src/pages/checkout/`

Route `/checkout` (protected? no — guest checkout allowed, but if authed prefill).

`sections/` (each ≤250 lines):
- `CheckoutSteps.jsx` — stepper (1 Contact → 2 Shipping → 3 Payment → 4 Done), animated progress, aria-current.
- `ContactForm.jsx` — email (prefilled from AuthContext), newsletter checkbox **off by default** (GDPR), Continue → server validation.
- `ShippingForm.jsx` — first/last name, address, city, postal code, country select, phone, shipping method radio (Standard €5.90 / Express €14.90, free if ≥ threshold), default address prefill if authed.
- `PaymentForm.jsx` — card number (formatted 4-4-4-4), expiry (MM/YY), CVC (password-ish), name on card; "Order with Obligation to Pay" (red-ish? keep gold) btn-primary w/ OrderSummary side; on submit → create order (ordersApi), clear cart, → success.
- `OrderSummary.jsx` — items mini list, subtotal, shipping (method), discount (coupon input + validate via couponsApi + applied chip), **total incl. VAT note**, coupon error inline.
- `SuccessView.jsx` — order number, email confirmation copy, continue shopping CTA.

## Auth Pages (existing files reused)

- `login.jsx` — authApi.login, redirect back, demo hint (`admin@belioras.com / demo123` and customer demo).
- `signup.jsx` — authApi.register + auto-login.
- `forgotpassword.jsx` — "email sent" state.

## FAQ / Support / Legal

- FAQ accordion (categories), contact-us successful-form state, about-us brand story, order-tracking mock lookup, hair-length-guide & shoe-size-guide tables, legal pages from `legal/` (copy in data or content — keep as JSX content, fine).

## Acceptance

- [ ] Home sections all render from services (skeleton on load).
- [ ] Shop filter combos produce correct counts; URL shareable; back/forward works.
- [ ] PDP: size/color required before add (validation + shake/toast); correct stock clamp; reviews persist across session (store refresh).
- [ ] Checkout: validation errors inline; coupon applies to totals; order creates with id; success shows id; cart empties; newsletter unchecked by default.
- [ ] Auth: wrong password error; login redirects; demo creds work.
- [ ] Search: no-results state; recent searches saved.