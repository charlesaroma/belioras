# 03 — Foundations (Phase 1)

Build order within phase:

## 1. `src/utils/`

- `cn.js` — clsx + tailwind-merge `cn()`.
- `formatCurrency.js` — `formatCurrency(amount, currency, locale)`.
- `constants.js` — color hex map (names → hex for swatches/badges), nav links data, sale badge config.
- `filterSort.js` — `filterProducts(products, {collectionId, categories, priceRange:{min,max}, colors, sizes, onSale, rating})` + `sortProducts(products, key)` (featured, price-asc, price-desc, newest, rating).

## 2. Contexts `src/context/`

| Context | State | API |
|---|---|---|
| `CurrencyContext` | currency (EUR default) | `setCurrency`, `convert(money)` via rates |
| `AuthContext` | user, token, loading | `login`, `register`, `logout` (via authApi) |
| `CartContext` | items[], subtotal, count | `addItem(product, {size,color,quantity})`, `updateQty`, `removeItem`, `clear`, `isInCart` |
| `WishlistContext` | ids[] | `toggle(id)`, `has(id)` |
| `ToastContext` | toasts[] | `toast(message, type)` — fixed top-center, auto-dismiss 3s, aria-live |

## 3. `src/hooks/`

- `useAsyncData.js` (see `02-data-layer.md`).
- `useLocalStorage.js` — persisted state helper (cart, wishlist, currency).
- `useMediaQuery.js` — breakpoint detection (mobile filters, mega menu).

## 4. Data files `src/data/`

Per `02-data-layer.md`. Seed carefully so every filter option has matches and dashboard metrics look plausible.

## Acceptance

- [ ] Contexts hydrate from localStorage on mount.
- [ ] Currency switch re-renders money everywhere (formatCurrency used everywhere, no raw `€`).
- [ ] addItem refuses out-of-stock; quantity clamped to stock.
- [ ] filterSort unit sanity via quick node script or manual console test.