# 07 — Dashboard (Phase 5)

Brand-tinted admin dashboard (ivory/gold/espresso, .font-display headers). Route `/dashboard` + `/dashboard/*` behind `RequireAuth` (role `admin` or `super-admin`). Demo login: `admin@belioras.com` / `demo123`. No chart libraries — custom lightweight SVG charts in `src/components/ui/charts/`.

## Shell — `src/Dashboard/`

- `DashboardLayout.jsx` — sidebar (espresso) + topbar (ivory, breadcrumb + search + admin avatar + "View store" link) + content area; responsive: sidebar → slide-in drawer on mobile.
- `index.jsx` — dashboard routes (sidebar nav).
- `sections/` as needed.

## Modules (11)

1. **Overview** — stat cards (Revenue, Orders, Conversion? keep: Revenue, Orders, Avg order value, New customers) each up/down % vs last month; LineChart revenue 12 months; BarChart orders by week; DonutChart sales by category; Top products list; recent orders table (5).
   - `sections/` StatsCards.jsx, SalesChart.jsx, OrdersByWeek.jsx, CategoryDonut.jsx, TopProducts.jsx, RecentOrders.jsx.
2. **Orders** — table all orders: id, customer, date, total, status (status-chip + dropdown actions: mark paid→shipped→delivered, cancel, refund), filters (status/tab pills, search, date range), detail Drawer (items, address, timeline), CSV export button (client-side). Order data from ordersApi (in-memory store + seed).
   - **Transactions** (`/dashboard/transactions`, `payments` capability, super-admin only) — every movement of money against an order: payments, refunds as their own rows, failed attempts. Summary (collected, refunded, net after fees, failed count), filters by type, provider and period, search by transaction ID, order, name or email. Detail panel links to the order; each order's panel lists its payments and links back. Read-only until a payment provider is connected, because refunds must go through Stripe or PayPal. Data from `transactionsApi` over `src/data/transactions.json`, shaped like the backend `Payment` table plus `type`, `fee` and `failureReason`.
3. **Products** — table (thumb, name, category name, price, total stock, status) with search and status tabs. The form (`/dashboard/products/new`, `/:id/edit`) is one column in the order a piece is thought about: category (cards, with quick-add) → name and description → colours & photos (each colour from the managed list, with its own photos; quick-add a colour) → sizes (only those the category offers) → stock per colour × size → price in € with an On sale switch and was price → labels (New arrival, Featured) → optional details folded away (only the dimensions the category asks for). A sticky save bar: Save draft / Publish, or Unpublish / Save changes when live.
   - Stored per product as `colorways: [{ colorId, images[], stock: { size: n } }]`, matching the backend's variant + inventory rows. Products saved before this carry `colors` names, `colorImages` and one `stock`; `productColorways.js` reads both shapes identically, and the form spreads an old single stock number across colours × sizes and asks the admin to check it.
   - `isNew` is the only switch for New Arrivals: badge, menu and the home page rail (`newArrivals.json` is gone).
4. **Categories & Colours** (`/dashboard/categories`) — two tabs. Categories: add, rename, delete; each chooses its sizes, its types (Accessories: Heels, Handbags…; a product may pick one) and the details its product form asks for. Colours: add, rename, delete; each is a boutique name, a swatch and a shop-filter family (Ebony → Black). Ids are fixed at creation, so a rename reaches every product; a category, type or colour still in use cannot be removed.
   - **Mega Menu** (`/dashboard/mega-menu`) — top-level items are added, renamed, reordered and removed; each shows everything, a category or a label, and has columns of links plus up to two feature tiles. Nothing is typed but names: a link is picked as a category, a type, one or more filter values (optionally only within a category, or only new arrivals) or a label, with live piece counts; a tile links to a menu page or one product, and uses an uploaded photo or picks one automatically. Addresses are generated from the name once and kept on rename, skipping addresses the shop already uses. Saving checks the whole menu first. Each node stores a `target` (`src/utils/menuTargets.js`); the storefront navbar, mobile menu, footer and a catch-all catalogue route read the same tree.
5. **Customers** — table (name, email, orders count, total spent, joined), row → detail view (profile card + order history + reviews).
   - **Newsletter** (`/dashboard/newsletter`, staff and administrators) — the Belioras Letter. **Subscribers**: counts, status tabs, search, a CSV export of confirmed subscribers with their consent record, unsubscribe, and erase (GDPR). Nobody is added by hand. **Campaigns**: write a subject, heading, message, up to four featured pieces and a button to a menu page, with a live email preview; save a draft, schedule or send to every confirmed subscriber. A sent campaign is read-only. **Welcome email**: on or off, its code (an active coupon) and wording. The rules live in `subscribersApi.js`: sign-up is double opt-in (`pending` → `subscribed` on the confirmation link, `/newsletter/confirm`); only `subscribed` is emailed; every email links to `/newsletter/unsubscribe`, and customers can also switch it off in Account › Settings; an unsubscribed record is kept so it can't be re-added silently; the welcome code is sent once per address. Nothing is delivered until the backend connects an email service, which sends on the same transitions.
6. **Reviews** — moderation queue: list w/ product, rating, text, status (published/pending/hidden); approve/hide actions; report count badge.
7. **Promotions** — tabs: **Flash Sales** (create/edit start-end, discount %, appliesTo, active toggle), **Banners & Popups** (home banner + popup copy/CTA/active), **Announcement Bar** (text, rotation, link), **Coupons** (code, type %, min spend, expires, usage limit, active) — CRUD each; data promoApi/couponsApi.
   - `sections/` FlashSalesTab.jsx, BannersTab.jsx, AnnouncementTab.jsx, CouponsTab.jsx, PromotionSkeleton.jsx.
8. **Staff & Roles** — staff table (name, email, role: admin/super-admin, last active, status), invite (Modal), role change, permissions matrix read-only hint; **Audit Log** tab — recent actions (who/what/when, from in-memory log seeded).
   - `sections/` StaffTable.jsx, RolesModal.jsx, AuditLog.jsx.
9. **Settings** — tabs: **Store** (name, logo URL, announcement text), **Shipping** (zones table: name, countries, flat rate, free threshold, edit inline), **Tax** (VAT rate, "prices include VAT" toggle), **Legal pages editors** (textarea/live textarea for privacy/terms/returns/withdrawal, Save → toast, used by legal pages? Legal pages read from settingsApi — yes: legal pages render text from `settings.json` so edits reflect), **GPSR** (manufacturer records CRUD: name, brand, address, contact, product scope, docs fields), **Notifications** (toggles mock).
   - `sections/` StoreTab, ShippingTab, TaxTab, LegalTab (per-page editor), GpsrTab, NotificationsTab.
10. **Media Library** — grid upload placeholder (URL entry + preview thumbs from `/img/` SVGs), delete, alt text field, "Use" copy-on-select (featured image select back to product form).
11. **Data** — CSV export gap (per module: orders, products, customers, reviews), JSON preview/download of relevant datasets.

## Charts (custom SVG)

- `components/ui/charts/` — `LineChart.jsx`, `BarChart.jsx`, `DonutChart.jsx`: props `data`, `labels`, `colors` (palette), tooltips (title attr or custom hover), `aria-label` + hidden table fallback per ux-ui-pro-max chart rule.

## Acceptance

- [ ] All 11 modules usable end-to-end with demo data (CRUD persists in-memory store, survives until refresh — acceptable; note in code).
- [ ] Status workflow transitions enforced (no shipped→pending).
- [ ] Chart components render with palette colors; keyboard/screen-reader: table fallback present.
- [ ] Every table has CSV/JSON export working.
- [ ] Legal editors update public legal pages (state lifted to store module — cross-tab sync not required).