# 10 — Folder Structure (Where Everything Lives)

**Rule:** Every file has exactly one home. Pages own their private UI; anything reused by two or more pages moves up to shared folders (`components`, `hooks`, `utils`). The admin `Dashboard/` is a self-contained app inside the repo and never reaches into storefront code; the customer-facing `customerDashboard/` deliberately does reach into it, and that difference is explained in [Two dashboards](#two-dashboards-one-rule-each) below. Before adding a file, find the folder below whose job matches it.

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
| `customerDashboard/` | Signed-in client app | Renders inside the storefront `Layout`; see below |
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
| `0.` | `auth/` | AuthLayout, login, signup, forgot password, atelier (staff door) |
| `1.` | `home/` | Landing page |
| `3.` | `shop/` | Shop listing + CatalogPage |

**The gaps at 2, 4, 5 and 6 are deliberate.** Those folders held placeholder
pages for What's New, Dresses, Hair and Accessories. All four nav destinations
are now served by `3.shop/CatalogPage.jsx` through splat routes, so the stubs
were deleted rather than left as dead code. The numbers stay vacant because
renaming a live folder is what this section forbids.

Unnumbered folders exist alongside them — reached via links, footer, or account menu, not primary nav:

| Folder | Contents |
| --- | --- |
| `product/` | Product detail page |
| `checkout/` | CheckoutPage |
| `customer-support/` | About us, contact us, order tracking, hair-length & shoe-size guides |
| `legal/` | Terms, privacy, cookie, shipping, return & refund policies ([08](08-eu-legal-compliance.md)) |
| `FAQ/` | FAQ page |

The signed-in client portal is **not** in this list — it moved to the top-level
`src/customerDashboard/`, mirroring `src/Dashboard/`. See
[Two dashboards](#two-dashboards-one-rule-each) below and
[11](11-client-account.md) for the portal itself.

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
| `pages/` | DashOverview, DashProducts, DashCategories, DashMegaMenu, DashOrders, DashCustomers, DashTeam, DashSettings |
| `pages/categories/modals/`, `pages/products/modals/` | Create/edit modals colocated with their page |

Isolation rules (binding):

- `Dashboard/` never imports `src/pages/**` or `src/customerDashboard/**`.
- The storefront never imports `src/Dashboard/**`.
- Both read data through `src/services` — same mocks today, same real API later ([02](02-data-layer.md)).
- Behavior and flows are covered in [07](07-dashboard.md).

### `src/customerDashboard/`

The signed-in customer's own app, structured the same way as `Dashboard/` —
a barrel, a layout shell, a `pages/` folder — but held to a different
isolation rule. See [Two dashboards, one rule each](#two-dashboards-one-rule-each).

| Path | Role |
| --- | --- |
| `index.jsx` | Barrel — mirrors `Dashboard/index.jsx` |
| `AccountLayout.jsx` | Heading, left rail, `<Outlet/>` — the customer equivalent of `DashboardLayout.jsx` |
| `pages/` | Profile, Orders, OrderDetail, Addresses, Wishlist, Settings |
| `pages/sections/` | Per-page splits, e.g. `SettingsPanel.jsx` |

Full routes, data sources and acceptance criteria are in [11](11-client-account.md).

## Shared Infrastructure

### `src/components/`

No root-level files — everything sits in a subfolder.

| Subfolder | Contents | Used by |
| --- | --- | --- |
| `ui/` | Button, Field, TagInput, Dropzone, ConfirmDialog, EmptyState, StatusChip, ToastViewport, DraftDock | Storefront, account **and** Dashboard |
| `common/` | Modal, Drawer, DropdownPill, LanguageSelector, CurrencySelector | Both |
| `auth/` | RequireAuth route guard | Both |
| `account/` | Avatar, OrderTimeline, accountMenuItems | `customerDashboard/`, the storefront navbar, the public order tracker, **and** the admin `Dashboard/` sidebar/Customers/Team pages |
| `layout/` | Footer, CookieConsent, PageShell, NotFound, Forbidden, BackToTop, ScrollToTop | Storefront |
| `layout/navbar/` | AnnouncementBar, NavLinks, NavActions, MegaMenu, MegaMenuPanel, MobileMenu, AccountMenu, SearchBar, SearchPanel, CartDrawer, Logo, barrel `index.jsx` | Storefront |
| `search/` | ImageSearch | SearchPanel |
| `shared/` | BrandMark, PaymentMarks, QuantitySelector, RatingStars, GridDensityIcon | Storefront |
| `storefront/` | ProductCard, ProductCarousel, GridViewSwitcher | Storefront + account |
| `product/` | ColorSelector, SizeSelector | Product page |

`ui/` is genuinely shared infrastructure: the Dashboard is its heaviest
consumer. `layout/` and `layout/navbar/` are storefront-only.

### `src/context/`

Eight providers mounted near the App root, in this order: Content, Language,
Currency, Auth, Cart, Wishlist, **ProductDraft**, Toast. Language sits above
Currency because price formatting needs the active locale; ProductDraft sits
above `BrowserRouter` so an in-progress upload survives navigation.

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
5. Admin work stays under `src/Dashboard/` end to end; customer-account work
   stays under `src/customerDashboard/` end to end.
6. Styling uses palette tokens from `src/index.css` only — see [00](00-code-conventions.md) and [03](03-foundations.md).

## Two dashboards, one rule each

Both admin and customer areas are top-level folders, named to match — but they
are held to opposite isolation rules, and confusing the two is the mistake to
avoid here.

**`Dashboard/` is fully isolated.** It never imports `src/pages/**`, and the
storefront never imports it back. It has its own chrome, its own constants,
and reads data through the same `src/services` the storefront does — the two
apps meet only there.

**`customerDashboard/` is not isolated, on purpose.** It renders inside the
storefront's own `Layout` rather than a shell of its own, and freely imports
`ProductCard`, `GridViewSwitcher`, `StatusChip` and the `ui/` primitives from
`src/components/`. A customer checking an order has not left the shop, and a
separate chrome would say otherwise.

That difference is also why `Avatar`, `OrderTimeline` and `accountMenuItems`
live in `src/components/account/` rather than inside `customerDashboard/`
itself: the admin `Dashboard/` sidebar and its Customers/Team pages import
them too, and so does the storefront navbar and the public order tracker —
none of which are customer-dashboard pages. Nesting genuinely shared code
inside a folder named for only one of its five consumers would point the
admin area's imports backwards through the customer's own folder. Anything
used by two or more `customerDashboard/` pages **and nothing outside it**
belongs inside `customerDashboard/`, not in `components/account/`.

Where things go next: layout mechanics in [04](04-layout.md), the UI-kit
inventory in [05](05-ui-kit.md), storefront flows in [06](06-storefront.md),
the client portal in [11](11-client-account.md), QA gates in
[09](09-qa-polish.md).
