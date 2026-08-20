# 02 — Data Layer & Services (Backend-Ready)

**Rule:** components and contexts call services only. Services return Promises resolving to JSON-shaped data after `mockDelay`. Later, swap each service's internals to `fetch('/api/...')` — no component changes.

## Files: `src/services/`

| File | Exports | Shape |
|------|---------|-------|
| `apiClient.js` | `mockDelay(ms=250)`, `mockApi(getter, ms)` wrapper, `ApiError` | — |
| `productsApi.js` | `getProducts()`, `getProduct(id)`, `getByCollection(catId)`, `getNewArrivals()`, `search(query)` | product objects |
| `collectionsApi.js` | `getCollections()` | dress/hair/accessory collections |
| `categoriesApi.js` | `getCategories()` | category tree for mega menu |
| `authApi.js` | `login({email,password})`, `register(user)`, `logout()` | `{token, user}` from `users.json`; validate; throws `ApiError` on bad creds |
| `ordersApi.js` | `createOrder(payload)`, `getOrders(userId)`, `getOrder(id)`, `updateOrderStatus(id, status)` | order with generated id + dates |
| `couponsApi.js` | `validateCoupon(code)`, `getCoupons()` | coupon or null |
| `reviewsApi.js` | `getReviews(productId)`, `getAllReviews()` | review objects (name, rating, title, body, date, verified) |
| `promotionsApi.js` | `getPromotions()` | promo banners/flash sale config |
| `settingsApi.js` | `getSettings()` | shipping zones, tax rate, free-shipping threshold, announcement text, cookies text |

Hook: `src/hooks/useAsyncData.js` — `useAsyncData(fn, deps)` → `{data, loading, error, refresh}`.

## Mock Data: `src/data/`

All JSON arrays/objects, ~5-10 items each (enough to demo filters/DS):

- `products.json` — main catalog (dresses + accessories). Fields: id, slug, name, price, originalPrice (Omnibus), collectionId, categories[], description, details[], materials[], care[], colors[] (names only), sizes[], stock, isNew, bestseller, rating, reviewCount, images[] (object-fit grayscale placeholders `/img/*.svg` to draw later — see Phase 6).
- `dresses.json` — dress catalogs + `hairVariants[]` merged in `products.json`? No: dresses stay in products.json via `collectionId`; `dresses.json` holds size-chart + styling copy used by Dress PDP.
- `hair.json` — hair extensions/units: fields + `isNonReturnable: true`, `hairType` (brazilian/indian/remy), `lengthInInches`, `weight` (g), `color` names.
- `accessories.json` — bags, belts, scarves, jewelry + `nonReturnable` flags where applicable.
- `newArrivals.json` — date-stamped subset for `/whats-new`.
- `categories.json` — mega menu tree: 3 columns (Dresses / Hair / Accessories) each with children; `featured` entries point at product ids.
- `testimonials.json` — name, city, quote, rating, productUrl.
- `users.json` — customers + `admin@belioras.com` (password `demo123`, role super-admin (see `07-dashboard.md`)) + staff role examples.
- `orders.json` — seed orders covering all statuses (pending/paid/shipped/delivered/cancelled/refunded) for dashboard.
- `coupons.json` — e.g. `WELCOME10` (10% min €50), `FREESHIP` (free shipping threshold).
- `promotions.json` — flash sale entry, top banner, popup (15% first order) with start/end.
- `reviews.json` — per product 2-4 reviews, some "verified purchase".
- `settings.json` — shipping zones (EU flat €5.90, free ≥ €150; UK €12; World €19), tax 20% VAT included note, announcement text, cookie banner copy, GPSR manufacturer records, support contact, social links, hero copy, value props, brand story.

## Acceptance

- [ ] `grep -r "from '../../data" src --include=*.jsx` returns nothing (components never import data).
- [ ] Auth service validates against users.json and returns token+user; wrong password rejects with `ApiError`.
- [ ] Orders service persists created order into an in-memory store (module-level array) so checkout → dashboard demo works.