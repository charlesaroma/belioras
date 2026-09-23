# Belioras — System Architecture

Written for whoever connects a real backend next. It explains what exists, why it's shaped this way, and exactly what has to change versus what can stay.

## 1. High-level shape

```
src/
├── pages/, product/, checkout/, customer-support/, legal/   ← storefront screens
├── customerDashboard/                                       ← the signed-in shopper's own app
├── AdminDashboard/                                           ← the staff app
├── routes/            authRoutes() · dashboardRoutes() · storefrontRoutes()
├── context/            Content, Language, Currency, Auth (customer + staff realms), Cart, Wishlist, ProductDraft, Toast
├── services/           the entire API surface — see §2
├── services/store/     contentStore.js — the mock persistence layer — see §3
└── data/               JSON seed fixtures — see §3
```

Three independent apps share one shell (`App.jsx` → `AppProviders` → `BrowserRouter` → the three route-tree builders). The storefront and `customerDashboard/` share chrome and freely import each other's shared components; `AdminDashboard/` is fully isolated — it never imports `src/pages/**` and the storefront never imports it back. Full reasoning in `docs/10-folder-structure.md#two-dashboards-one-rule-each`.

## 2. The service layer

Every piece of data in the app is read and written through a service module in `src/services/`, grouped by business area (`catalog/`, `sales/`, `marketing/`, `content/`, `auth/`, `store/`). Components and contexts **never** import `src/data/*.json` directly — that boundary is the entire point: swap what's inside a service function from a `contentStore` read to a real `fetch()` call, and nothing above it changes.

Every service function:
- Returns a Promise (wrapped in `mockApi()` from `src/api/mock.js`, which adds an artificial delay and standardizes error shape).
- Throws `ApiError(message, status)` on failure — components already branch on this shape (`err.message`, `err.status`), so a real API returning the same shape needs no component changes either.

Full function-by-function contract table: `docs/02-data-layer.md`.

## 3. The mock persistence layer (`contentStore.js`)

This is the piece a real backend replaces wholesale, and the piece most worth understanding before doing that.

- **One domain per concern** — `products`, `orders`, `coupons`, `reviews`, `navigation`, `taxonomy`, `categories`, `settings`, and so on (full list: `DOMAINS` in `contentStore.js`). Each domain is one localStorage key (`belioras:content:<domain>`), not one giant blob — a shape change in one domain can't corrupt another, and each is easy to inspect or clear independently while debugging.
- **Seed + `rev`.** Every domain has a seed (`src/data/*.json`, sometimes wrapped by a `*Seed.js` file into `{ rev, items }`) and a `rev` number. On load, `contentStore` compares the seed's `rev` against what's stored:
  - **Same `rev`** → merge per item id: the seed supplies the canonical item list (and any newly-added fields), the stored copy supplies admin edits.
  - **Different `rev`** → the seed's shape changed under the stored data; discard the stored copy wholesale rather than merge two incompatible structures.
  - **Bump `rev`** whenever a domain's item shape changes (a new required-ish field, a restructured nested object) — three of this session's additions did exactly this (`coupons` and `reviews` promoted from flat JSON to `{rev, items}`; `catalogSeed`'s `rev` bumped from 7 to 8 when every product gained a `sku`).
- **Writes go through `setState(domain, updater)`**, which persists to localStorage and bumps an internal version counter that `useAsyncData`-driven reads pick up on their own polling/refresh cycle — there's no separate "did this change" plumbing to reimplement.

**What a real backend replaces:** `contentStore.js`, every `*Seed.js`, and every `src/data/*.json` fixture disappear. Each service function's body changes from a `contentStore` read/write to an HTTP call. The `rev`/merge machinery has no equivalent need server-side (a real database doesn't need to reconcile against a shipped seed) — it existed purely to make local development and demoing painless.

**What stays:** the service module boundary itself (the shape of what each function takes and returns), the status vocabularies (`utils/orderStatus.js`, `utils/roles.js` — canonical, alias-normalized, exactly the contract a real API should also speak), and the capability-based authorization model's *shape* (see §5) even though its *enforcement* has to move server-side.

## 4. Routing

`App.jsx` composes three route trees, each independent:
- `authRoutes()` — full-screen, no navbar/footer: `/login`, `/signup`, `/forgot-password` (shopper), `/atelier` (staff, linked from nowhere public).
- `dashboardRoutes()` — everything under `/dashboard/*`, behind `<RequireAuth adminOnly>`.
- `storefrontRoutes()` — everything else, wrapped in the storefront `Layout` (navbar, footer, cookie consent). Includes `customerDashboard/`'s routes under `/account/*`, behind `<RequireAuth>` (no `adminOnly` — a staff member can shop as themselves too). A catch-all splat route resolves any other path against the navigation tree (`CatalogPage` + `getCatalog(pathname)`) and 404s if it isn't a real menu destination — the menu tree is the single source of truth for what's a valid catalogue URL.

## 5. Auth & authorization

Two realms (`customer`, `staff`), each its own React context/provider (`CustomerAuthProvider`, `StaffAuthProvider`), each its own localStorage key (`belioras:auth:customer`, `belioras:auth:staff`), so a browser can hold a signed-in shopper and a signed-in staff member at once without collision. `authApi.login({ realm })` enforces realm separation with a uniform 401 (see PRD §2 for why).

Roles: `customer`, `staff`, `super-admin`. Capabilities (`catalog`, `content`, `orders`, `payments`, `marketing`, `team`, `settings`, …) gate individual dashboard sections; `utils/roles.js` maps role → capabilities. `RequireAuth` reads the current realm's session and redirects if the check fails.

**This is entirely client-side today.** A forged or manually-set localStorage session currently reaches guarded routes — nothing on the "server" (there is no server) re-checks the token or the capability. This is the load-bearing reason real backend integration matters: every one of these checks needs a server-side equivalent (a real session/JWT validated per-request, capability checks enforced in the API layer, not just hidden by a redirect). Treat every `RequireAuth`/capability gate in the frontend as documentation of *intended* access control, not enforcement of it.

## 6. What to build server-side, mapped to what exists

| Frontend piece | Server-side equivalent needed |
|---|---|
| `contentStore.js` domains | Real tables/collections, one per domain (see `docs/02-data-layer.md` for exact shapes) |
| `mockApi()` / `ApiError` | Real HTTP responses in the same success/error shape |
| `localStorage`-based auth sessions | Real tokens (JWT or session cookie), validated per request |
| `RequireAuth` / capability checks | Server-side authorization on every guarded endpoint, not just the UI |
| `updateOrderStatus`'s implicit trust (no ownership check) | A real ownership/role check before allowing a status transition |
| Coupon `validateCoupon` | Same validation, but race-safe under concurrent redemption (a usage-limit check that isn't a client-side read-then-write) |
| Reviews `createReview` verified-purchase check | Same logic, but against real order data, server-side |
| Payment ("Nothing is charged now" disclosure) | A real payment provider integration (Stripe/PayPal per the transactions doc's own framing) |
| Contact form (`contactApi.sendMessage`) | An actual inbox — currently has no admin-facing destination (see PRD §4, Messages) |

## 7. Where to go next

- `docs/02-data-layer.md` — the full service contract table.
- `docs/10-folder-structure.md` — where every file lives and why.
- `docs/07-dashboard.md`, `docs/11-client-account.md` — the two apps' feature detail.
- `docs/08-eu-legal-compliance.md` — legal requirements already reflected in the frontend (omnibus pricing, cookie consent, GPSR, withdrawal rights) that a backend must also respect in its own logic (e.g. non-returnable hair products, VAT-inclusive pricing).
- `PRD.md` — the product this architecture serves, and everything intentionally deferred.
