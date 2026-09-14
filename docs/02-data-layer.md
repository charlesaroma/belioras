# 02 — Data Layer & Services (Backend-Ready)

**Rule:** components and contexts call services only. Services return Promises resolving to JSON-shaped data after `mockDelay`. Later, swap each service's internals to `fetch('/api/...')` — no component changes.

## Files: `src/services/`

| File | Exports | Shape |
|------|---------|-------|
| `apiClient.js` | `mockDelay(ms=250)`, `mockApi(getter, ms)` wrapper, `ApiError` | — |
| `productsApi.js` | `getProducts()`, `getProduct(id)`, `getByCollection(catId)`, `getNewArrivals()`, `search(query)` | product objects |
| `collectionsApi.js` | `getCollections()` | dress/hair/accessory collections |
| `categoriesApi.js` | `getCategories()`, `categoryUsage()`, `createCategory()`, `updateCategory()`, `deleteCategory()` | categories: name, sizes offered, types, details asked for |
| `navigationApi.js` | `getNavigation()` (tiles resolved), `getNavigationForEditing()`, `updateNavigation(items)` (validated), `resetNavigation()`, `getTaxonomy()` | the menu tree |
| `catalogApi.js` | `getCatalog(pathname)`, `getFeaturedCollection()`, `getSiblingLeaves(pathname)` | a menu page's products |
| `subscribersApi.js` | `subscribe()`, `confirmSubscription(token)`, `unsubscribe(token)`, `unsubscribeByEmail()`, `getSubscription(email)`, `getSubscribers()`, `unsubscribeSubscriber(id)`, `eraseSubscriber(id)` | newsletter audience and consent |
| `campaignsApi.js` | `getCampaigns()`, `saveCampaign()`, `scheduleCampaign()`, `unscheduleCampaign()`, `sendCampaign()`, `deleteCampaign()`, `getNewsletterSettings()`, `updateWelcomeEmail()` | newsletter campaigns and welcome email |
| `colorsApi.js` | `getColors()`, `colorUsage()`, `createColor()`, `updateColor()`, `deleteColor()` | colours: name, swatch hex, shop-filter family |
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
- `colors.json` — the managed colour list (`id`, `name`, `hex`, `family`). Products reference colours by id.
- `subscribers.json`, `campaigns.json`, `newsletter.json` (via `newsletterSeed.js`) — newsletter subscribers with their consent record (`status`, `source`, `consentText`, `consentedAt`, `confirmedAt`, `token`), campaigns, and the welcome email. Deletes are remembered in the domain's `removed` ids (`storeCollections.js`) so seed records don't return on reload.
- `categories.json` — what a piece is (`id`, `name`, `sizes[]`, `details[]`, `types[]`). The id is a product's `collectionId`; a type id is a product's `type`.
- `navigation.json` — the menu tree: top-level items, their columns (`sections`) of links, and `tiles`. Every node carries a `target` saying what it shows (see `src/utils/menuTargets.js`) and a generated `slug`/`url`. A catalogue page is found by its URL in this tree and lists the products `matchesTarget` selects; any other URL is a 404.
- New Arrivals are the products with `isNew`, newest `createdAt` first; there is no separate list.
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