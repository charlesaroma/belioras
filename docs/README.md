# Belioras — Build Breakdown & Master Status Tracker

Luxury fashion & hair e-commerce frontend (Vite + React 19 + Tailwind v4 + Motion + React Router + Lucide) plus brand-tinted admin dashboard. Mock JSON data in `src/data/`, accessed **only** through the backend-ready services layer in `src/services/`.

## Golden Rules

1. **Backend-ready**: components/contexts never import JSON directly — always via `src/services/*` (promise wrappers with `mockDelay`). Swap internals to `fetch()` later = zero component changes.
2. **Split rule**: JSX files max ~250 lines. Page-level splits go in the page's `sections/` folder; shared/layout splits go in `src/components/`.
3. **Comment style**: simple, minimal. `{/* Section name */}` above tags/sections. Title case, no dashes, no decoration. One-line file-top comment only when needed.
4. **Palette**: always Belioras tokens from `src/index.css` (`gold-*`, `brown-*`, `champagne-*`, `umber-*`, `ivory-*`, `espresso`). No arbitrary hex in components — use `constants.js` maps when needed.
5. **EU legal (non-negotiable)**: see `08-eu-legal-compliance.md`. Omnibus price, cookie consent equal-weight, GPSR records, no pre-ticked boxes, hair non-returnable, 14-day withdrawal, VAT-inclusive.
6. **Design**: follow `ui-ux-pro-max` skill + `belioras-design.md`, plus installed taste-skills: `design-taste-frontend` (anti-generic baseline: Density 4 / Variance 8 / Motion 6), `high-end-visual-design` (Editorial Luxury archetype — this project's exact archetype), `minimalist-ui` (serif editorial, crisp borders), `gpt-taste` (headline/filler-text discipline only — no GSAP; we use Motion). Lucide icons only, no emojis. Touch targets ≥ 44px. Focus rings everywhere. `prefers-reduced-motion` respected.

## Build Order (Phases)

Storefront-first: everything the customer sees (layout shell → UI kit → storefront pages) ships before the admin dashboard. **Dashboard is the last build phase.**

| # | Phase | Doc | Status |
|---|-------|-----|--------|
| 0 | Dependencies & config | `01-dependencies.md` | done |
| 1 | Foundations (utils, contexts, services, hooks, data) | `02-data-layer.md` + `03-foundations.md` | in-progress |
| 2 | Layout — storefront shell first (navbar folder, AI chat, footer, cookie, shell) | `04-layout.md` | pending |
| 3 | UI kit (incl. swatches) | `05-ui-kit.md` | pending |
| 4 | Storefront (home, shop, PDPs, search, checkout, auth, FAQ, legal) | `06-storefront.md` | pending |
| 5 | Dashboard (11 modules) — built last | `07-dashboard.md` | pending |
| 6 | QA & polish (a11y, responsive, lint, build, favicon) — final pass over the whole app incl. dashboard | `09-qa-polish.md` | pending |

## Status Legend

- `pending` — not started
- `in-progress` — actively working
- `done` — complete & verified

## File Tree (Target)

```
docs/
├── README.md                ← this file
├── 00-code-conventions.md
├── 01-dependencies.md
├── 02-data-layer.md
├── 03-foundations.md
├── 04-layout.md
├── 05-ui-kit.md
├── 06-storefront.md
├── 07-dashboard.md
├── 08-eu-legal-compliance.md
└── 09-qa-polish.md

src/
├── main.jsx                 ← ok
├── index.css                ← ok (Tailwind v4 tokens)
├── App.jsx                  ← replace with routes
├── utils/                   ← cn, formatCurrency, filterSort, constants
├── hooks/                   ← useAsyncData, useLocalStorage, useMediaQuery
├── services/                ← apiClient + productsApi, collectionsApi, categoriesApi, authApi, ordersApi, couponsApi, reviewsApi, promotionsApi, settingsApi
├── context/                 ← Auth, Cart, Wishlist, Currency, Toast
├── components/
│   ├── layout/              ← navbar/ (8 files), AiChat/ (3), footer, cookieConsent, ScrollToTop, NotFound
│   ├── ui/                  ← Button, Input, Select, QuantitySelector, Modal, Drawer, Accordion, RatingStars, Badge, Skeleton, EmptyState, TrustBadges, Breadcrumbs, Swatch, SizeSwatch, SwatchGroup, SectionHeader, Newsletter, Announcement
│   └── storefront/          ← FilterPanel, ActiveFilters, SortSelect, ProductCard, ProductGrid, FeaturedCarousel
├── data/                    ← *.json (products, dresses, hair, accessories, newArrivals, categories, testimonials, users, orders, coupons, promotions, reviews, settings)
├── pages/
│   ├── 0.auth/              ← login, signup, forgotpassword
│   ├── 1.home/sections/     ← Hero, FeaturedCategories, NewArrivals, FeaturedProducts, Testimonials, ValueProps, BrandStory
│   ├── 2.whatsNew/sections/ ← NewArrivalsSection, CategoryShowcase
│   ├── 3.shop/sections/     ← ProductFilters, Sidebar, MobileFilters
│   ├── 4.dresses/           ← DressesPage (+ sections/ product grid, filters)
│   ├── 5.hair/              ← HairPage (+ sections/)
│   ├── 6.accessories/       ← AccessoriesPage (+ sections/)
│   ├── search/              ← SearchPage + sections/
│   ├── checkout/            ← CheckoutPage + sections/ (6 files)
│   ├── FAQ/                 ← faq.jsx
│   ├── customer-support/    ← about-us, contact-us, order-tracking, hair-length-guide, shoe-size-guide
│   └── legal/               ← 5 legal pages
└── Dashboard/               ← index + 11 modules + sections/
```

## Verifier

At the end of every phase: `npm run lint` (if configured) + `npx vite build` must pass; tracker checkboxes updated in the phase doc.