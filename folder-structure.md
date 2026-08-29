# 10 — Folder Structure (Where Everything Lives)

**Rule:** Every file has exactly one home. Pages own their private UI; anything reused by two or more pages moves up to shared folders (`components`, `hooks`, `utils`). The Dashboard is a self-contained app inside the repo and never reaches into storefront code. Before adding a file, find the folder below whose job matches it.

This doc maps *where* things live. Naming and comment conventions are in [00](00-code-conventions.md), the dependency stack in [01](01-dependencies.md).

## Top Level

```
belioras/
├── index.html            # Vite entry HTML
├── package.json          # Scripts & dependencies (see [01](01-dependencies.md))
├── vite.config.js        # Build config, path aliases
├── eslint.config.js      # Lint rules
├── public/               # Static assets served verbatim (favicon, fonts)
├── scripts/              # One-off maintenance scripts
└── src/                  # All application code lives here
```

Build output, docs, and tooling configs are not application code — nothing under `src/` imports from them.

## `src/` At A Glance

| Folder | Contents | Notes |
| --- | --- | --- |
| `pages/` | Route-level screens | Numbered prefixes fix nav order (below) |
| `Dashboard/` | Admin app | Fully isolated from the storefront |
| `components/` | Shared UI | Used by two or more pages |
| `context/` | Global providers | Mounted near the app root |
| `services/` | API layer | Backend-ready wrappers ([02](02-data-layer.md)) |
| `data/` | JSON mock fixtures | Imported **only** by services |
| `hooks/` | Reusable hooks | Generic logic, no page awareness |
| `utils/` | Pure helpers | No React imports |
| entry files | `main.jsx`, `App.jsx`, `index.css` | Palette tokens live in `index.css` ([03](03-foundations.md)) |

## `src/pages/`

Numbered prefixes are not cosmetic — they encode primary route/nav order. **Never rename them.** Inserting a page between existing ones means a deliberate renumber.

| Prefix | Folder | Purpose |
| --- | --- | --- |
| `0.` | `auth/` | AuthLayout, login, signup, forgot password |
| `1.` | `home/` | Landing page |
| `2.` | `whatsNew/` | What's-new feed |
| `3.` | `shop/` | Shop listing + CategoryPage |
| `4.` | `dresses/` | Dresses category page |
| `5.` | `hair/` | Hair category page |
| `6.` | `accessories/` | Accessories category page |

Unnumbered folders exist alongside them — reached via links, footer, or account menu, not primary nav:

| Folder | Contents |
| --- | --- |
| `product/` | Product detail page |
| `checkout/` | CheckoutPage |
| `search/` | Search results |
| `account/` | AccountLayout + Profile, Orders, OrderDetail, Addresses, Wishlist |
| `customer-support/` | About us, contact us, order tracking, hair-length & shoe-size guides |
| `legal/` | Terms, privacy, cookie, shipping, return & refund policies ([08](08-eu-legal-compliance.md)) |
| `FAQ/` | FAQ page |

### Per-Page Structure

Each major page owns a private `sections/` folder. Canonical example (`home/`):

```
home/
├── home.jsx                          # Page shell, default export
└── sections/
    ├── HeroSection.jsx               # Private to this page
    ├── FeaturedCategoriesSection.jsx
    ├── FeaturedProductsSection.jsx
    ├── BrandStorySection.jsx
    ├── NewArrivalsSection.jsx
    ├── ValuePropsSection.jsx
    ├── TestimonialsSection.jsx
    └── NewsletterSection.jsx
```

- Page files default-export one component; sections are named exports local to that page.
- `sections/` may hold non-component helpers too (e.g. `shop/sections/constants.jsx`).
- When a second page needs a section's piece, promote it to `src/components/storefront/` or `src/components/shared/` — never import across page folders.

## `src/Dashboard/`

A complete admin app living beside the storefront:

| Path | Role |
| --- | --- |
| `index.jsx` | Router/entry for the admin area |
| `DashboardLayout.jsx` | Sidebar + header shell |
| `lib/constants.jsx` | Dashboard-only constants |
| `components/` | DashHeader, DashSidebar, DashTable, SalesChart, StatCard |
| `pages/` | DashOverview, DashOrders, DashProducts, DashCategories, DashSettings, DashUsers |
| `pages/categories/modals/`, `pages/products/modals/` | Create/edit modals colocated with their page |

Isolation rules (binding):

- Dashboard never imports `src/pages/**`.
- Storefront never imports `src/Dashboard/**`.
- Both read data through `src/services` — same mocks today, same real API later ([02](02-data-layer.md)).
- Behavior and flows are covered in [07](07-dashboard.md).

## Shared Infrastructure

### `src/components/`

| Subfolder | Contents |
| --- | --- |
| *(root)* | Hero, TrustBar |
| `layout/` | Footer, CookieConsent, FlashSalePopup, NotFound, ScrollToTop |
| `layout/navbar/` | AnnouncementBar, NavLinks, NavActions, MegaMenu, MobileMenu, SearchBar, CartDrawer, Logo, barrel `index.jsx` |
| `auth/` | RequireAuth route guard |
| `shared/` | QuantitySelector, RatingStars, SaleBadge |
| `storefront/` | ProductCard, ProductGrid |

### `src/context/`

Five providers mounted near the App root: AuthContext, CartContext, CurrencyContext, ToastContext, WishlistContext.

### `src/services/`

The entire API surface. `apiClient.js` exposes `mockDelay(ms = 250)`, `mockApi()`, and `ApiError`; nine domain modules wrap it (products, collections, categories, auth, orders, coupons, reviews, promotions, settings) plus the `useAsyncData` hook. Full contracts in [02](02-data-layer.md).

### `src/data/`

Thirteen JSON fixtures mirroring future backend shapes. **Only services import these.**

### `src/hooks/` & `src/utils/`

Hooks: `useAsyncData`, `useLocalStorage`, `useMediaQuery`. Utils: `cn`, `constants`, `filterSort`, `formatCurrency`. Both stay generic — no business logic, no knowledge of specific pages.

## Placement Rules (Binding)

1. New screen → `src/pages/<name>/` (add `sections/` when it has distinct blocks). Assign a number only if it joins primary nav.
2. Component needed by ≥ 2 pages → `src/components/…`; needed by one page → that page's `sections/`.
3. Any network-shaped call goes through a service module — components never import `src/data` directly.
4. Global state → `src/context`; reusable stateful logic → `src/hooks`; pure functions → `src/utils`.
5. Dashboard work stays under `src/Dashboard/` end to end.
6. Styling uses palette tokens from `src/index.css` only — see [00](00-code-conventions.md) and [03](03-foundations.md).

Where things go next: layout mechanics in [04](04-layout.md), the UI-kit inventory in [05](05-ui-kit.md), storefront flows in [06](06-storefront.md), QA gates in [09](09-qa-polish.md).
