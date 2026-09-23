# 07 — Dashboard (Phase 5)

Brand-tinted admin dashboard (ivory/gold/espresso, .font-display headers). Route `/dashboard` + `/dashboard/*` behind `RequireAuth` (role `admin` or `super-admin`). Demo login: `admin@belioras.com` / `demo123`. No chart library — a single custom SVG revenue chart, `AdminDashboard/components/SalesChart.jsx`.

## Shell — `src/AdminDashboard/`

- `DashboardLayout.jsx` — sidebar (espresso) + topbar (ivory, breadcrumb + search + admin avatar + "View store" link) + content area; responsive: sidebar → slide-in drawer on mobile.
- `DashboardPages.jsx` — barrel re-exporting every page under a `Dash*` name, imported by `src/routes/DashboardRoutes.jsx`.
- `sections/` as needed, per page.

## Modules

Numbered by sidebar order; the gaps (`2`, `13`) are reserved slots for pages not yet built (Reports, Messages).

1. **Overview** (`1.overview`) — stat cards (revenue, orders, low-stock count, …) each vs. last period; a revenue panel (`OverviewRevenuePanel.jsx`, `SalesChart.jsx`) and a recent-orders table.
2. **Products** (`3.products`) — table (thumb, name, category, price, total stock, status) with search and status tabs. The form (`/dashboard/products/new`, `/:id/edit`) walks category → name, SKU and description → colours & photos (each colour from the managed list, with its own photos; quick-add a colour) → sizes (only those the category offers) → stock per colour × size → price in € with an On sale switch → labels (New, Featured) → optional details folded away. A sticky save bar: Save draft / Publish, or Unpublish / Save changes when live. Stock is stored per `colorways: [{ colorId, images[], stock: { size: n } }]`.
3. **Inventory** (`4.inventory`) — one row per colour × size variant: on-hand, reserved (units held by open orders, derived rather than stored), and available. Adjust (received / removed / recounted, with a reason and note), a per-variant movement history, bulk "Receive stock" for a selection, and a low-stock threshold (shop-wide default plus a per-product override). A shipped order deducts on-hand once; cancelling or refunding a shipped order can return units to stock.
4. **Categories & Colours** (`5.categories`) — three tabs. **Categories**: add, rename, delete; each chooses its sizes, its types, and the detail dimensions its product form asks for. **Colours**: add, rename, delete; each is a boutique name, a swatch and a shop-filter family. **Details**: CRUD for the Occasion/Fabric/Style/Length/Hair tag values products are tagged with. Ids are fixed at creation, so a rename reaches every product; anything still in use (by a product, or in a category/colour's own configuration) can't be removed.
5. **Sizes & Guides** (`6.sizes`) — two tabs. **Sizes**: the shop-wide size list (add/rename/delete, usage-guarded against categories and products). **Size guides**: one card per guide (Dresses, Footwear, Hair), each with an editable measurement table and a Preview that renders the exact component the storefront shows, plus "Restore shipped tables".
6. **Mega Menu** (`7.mega-menu`) — top-level items are added, renamed, reordered and removed; each has columns of links plus up to two feature tiles. Nothing is typed but names: a link is picked as a category, a type, one or more filter values or a label, with live piece counts; a tile links to a menu page or one product, and uses an uploaded photo or picks one automatically. Addresses are generated from the name once and kept on rename. Saving checks the whole menu first. Each node stores a `target` (`src/utils/menuTargets.js`); the storefront navbar, mobile menu, footer and the catalogue's splat route all read the same tree.
7. **Orders** (`8.orders`) — table of all orders: id, customer, date, total, status chip, tabs by status, search and date-range filters, a detail modal (items, address, timeline, forward-only status actions). Marking an order shipped opens a small dialog for an optional tracking number and carrier. Order data from `ordersApi` over the shared `contentStore`, so a status change here is what the customer's own order tracking shows too.
8. **Transactions** (`9.transactions`, `payments` capability, super-admin only) — every movement of money against an order: payments, refunds, failed attempts, each as its own row. Summary (collected, refunded, net, failed count), filters by type/provider/period, search by transaction id, order, name or email. Read-only until a payment provider is connected.
9. **Discounts** (`10.discounts`, marketing capability) — coupon codes: percent off, a fixed amount off, or free shipping, sitewide (no per-product or per-category scoping). Add, edit, pause/activate, delete; a coupon a past order used keeps its code in that order's history regardless.
10. **Customers** (`11.customers`) — table (name, email, orders count, total spent, joined), row → detail view (profile card + order history).
11. **Reviews** (`12.reviews`, content capability) — every submission lands pending; status tabs (pending/published/hidden), a detail view with publish/hide actions and a reply field shown publicly under the review once posted. Only published reviews are ever readable on the storefront.
12. **Newsletter** (`14.newsletter`, marketing capability) — the Belioras Letter. **Subscribers**: counts, status tabs, search, CSV export with consent record, unsubscribe, erase (GDPR). **Campaigns**: subject, heading, message, featured pieces, a link, a live email preview; draft, schedule or send. **Welcome email**: on/off, its coupon code, wording. Sign-up is double opt-in (`pending` → `subscribed` via `/newsletter/confirm`); only `subscribed` addresses are ever emailed.
13. **Team** (`15.team`) — the staff/super-admin table (name, email, role, status), role changes with a confirmation, invite.
14. **Shipping** (`17.shipping`) — its own page rather than a panel inside Settings, since shipping is where the shop's real operational complexity lives (zones today, room for carriers and methods later). Per-zone flat rate and free-shipping threshold, edited inline; saves through the same settings document as everything else, merged section-by-section so it never touches Contact/Tax/Compliance.
15. **Settings** (`16.settings`) — one form, several panels: Contact, Storefront (branding/announcement), Compliance (GPSR manufacturer records, legal-page text — the legal pages render straight from these settings, so an edit here is live on save).

## Acceptance

- [ ] Every built module usable end-to-end with demo data (writes persist to the shared `contentStore`, survive a reload).
- [ ] Status workflow transitions enforced (no shipped→pending).
- [ ] Every list/table with a meaningful row count has search, and status filters where the data has a status.
- [ ] Settings' compliance panel updates the corresponding public legal page.