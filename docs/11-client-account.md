# 11 — Client Account (The Signed-In Shopper)

**Rule:** The account area is part of the storefront, not a second app. It renders inside `Layout`, reuses storefront components, and lives at `src/pages/account/`. Everything a signed-in customer can do is here; everything an admin can do is in [07](07-dashboard.md).

Shoppers sign in at `/login`; staff use `/atelier`, which is linked from nowhere public. Both call the same `login()` and land the person by role — refusing the "wrong" door would tell anyone probing which addresses belong to staff.

## Why It Is Not `src/Account/`

The Dashboard earns a top-level folder by being self-contained — its own chrome, hooks and constants, and a binding rule that neither side imports the other's pages ([10](10-folder-structure.md)). The account area is the opposite: it renders inside the storefront shell and shares `ProductCard`, `GridViewSwitcher`, `StatusChip` and the `ui/` primitives. A sibling folder would force either duplication or a cross-boundary import, so the symmetry would be cosmetic.

## Structure

```
src/pages/account/
├── index.jsx              # Barrel — App.jsx imports the area in one line
├── AccountLayout.jsx      # Shell: heading, left rail, <Outlet/>. Owns the page's only h1
├── Profile.jsx            # Overview
├── Orders.jsx             # History list
├── OrderDetail.jsx        # One order + timeline + order again + receipt
├── Addresses.jsx          # Address book
├── Wishlist.jsx           # Saved pieces
├── Settings.jsx           # Profile, security, preferences
└── sections/
    └── SettingsPanel.jsx  # Private to Settings

src/components/account/    # Shared by ≥2 account surfaces
├── Avatar.jsx             # Initials or photo. Also used by the navbar
├── OrderTimeline.jsx      # Four stages. Also used by the public tracker
└── accountMenuItems.js    # One list, rendered by AccountMenu and MobileMenu
```

## Routes

All under `<RequireAuth>` — no `adminOnly`, so staff can shop as themselves.

| Path | Page |
| --- | --- |
| `/account` | Overview |
| `/account/orders` | History |
| `/account/orders/:id` | Order detail |
| `/account/addresses` | Address book |
| `/account/wishlist` | Saved pieces |
| `/account/settings` | Profile, security, preferences |

`/wishlist` redirects to `/account/wishlist` — one canonical URL, with the old link kept working.

## Headings

`AccountLayout` renders the **only** `h1` on the page (the customer's first name). Every child page starts at `h2`. Both the layout and each page used to emit an `h1`, so every route had two stacked.

## Data

| Concern | Source | Notes |
| --- | --- | --- |
| Orders | `services/ordersApi` `getOrders(userId)` / `getOrder(id, { userId })` | `getOrder` requires proof of ownership — the id alone is guessable |
| Products | `services/productsApi` | Wishlist resolution, order thumbnails, order again |
| Wishlist | `context/WishlistContext` | Per-account via `useScopedStorage` |
| Addresses | `useScopedStorage("belioras:addresses", [], user.id)` | Per-account. **No seed** — it once shipped a fictional customer's Lisbon address to every new account |
| Profile | `context/AuthContext` → `updateProfile`, `changePassword`, `verifyPassword` | |
| Status vocabulary | `utils/orderStatus` | One definition, shared with the Dashboard and the public tracker |

## Per-User Isolation (Binding)

Wishlist and addresses are namespaced by user id and cleared on sign-out. They were single device-global keys, so on a shared browser the next person inherited the previous one's saved pieces and home address. An anonymous wishlist is **merged** into the account on first sign-in; an anonymous address book is not — a delivery address is not something to move silently between accounts.

## Sensitive Changes

Changing the email address requires the current password (`verifyPassword`), because that address receives every password reset. A name or phone edit stays one step.

## What Is Not Built

Needs the backend, and is flagged rather than faked:

- Avatar upload — `user.avatar` is read and rendered, never written. The data path is open; it needs somewhere to upload to.
- Returns / RMA — `refunded` exists only as a status an admin sets.
- Real invoices — the Receipt action is `window.print()` against the print stylesheet in `index.css`. A sequential invoice number and VAT breakdown is a legal document and belongs on the server.
- Notification preferences, delete account, active sessions, back-in-stock alerts.

## Acceptance

- One `h1` per route; child pages start at `h2`.
- A brand-new account opens `/account/addresses` to an empty state.
- Sign out from the account lands on `/`, not the sign-in form; the drawer and the sidebar behave the same.
- The mobile drawer offers the same destinations as the header dropdown.
- "Order again" reports any line it could not add rather than silently dropping it.
- No file over 250 lines ([00](00-code-conventions.md)).
