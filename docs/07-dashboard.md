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
3. **Products** — table (image thumb, name, category, price, stock, status badge: active/draft/low stock/out) + search; edit → Drawer/Modal form (name, price, originalPrice, category, colors, sizes, stock, description, images URL/upload placeholder, isNonReturnable toggle, sale toggle, GPSR fields); delete (confirm Modal); add product; stock column shows Low stock warning chip.
   - `sections/` ProductTable.jsx, ProductForm.jsx, StockAlerts.jsx.
4. **Categories** — tree list w/ add/edit/delete + product count + reorder (up/down).
5. **Customers** — table (name, email, orders count, total spent, joined), row → detail view (profile card + order history + reviews).
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