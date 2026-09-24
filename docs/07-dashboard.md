# 07 — Dashboard (Phase 5)

Brand-tinted admin dashboard (ivory/gold/espresso, .font-display headers). Route `/dashboard` + `/dashboard/*` behind `RequireAuth` (role `admin` or `super-admin`). Demo login: `admin@belioras.com` / `demo123`. No chart library — a single custom SVG revenue chart, `AdminDashboard/components/SalesChart.jsx`.

## Shell — `src/AdminDashboard/`

- `DashboardLayout.jsx` — sidebar (espresso) + topbar (ivory, breadcrumb + search + admin avatar + "View store" link) + content area; responsive: sidebar → slide-in drawer on mobile.
- `DashboardPages.jsx` — barrel re-exporting every page under a `Dash*` name, imported by `src/routes/DashboardRoutes.jsx`.
- `sections/` as needed, per page.

## Modules

Numbered by sidebar order; `13` is a reserved slot for a page not yet built (Messages).

1. **Overview** (`1.overview`) — stat cards (revenue, orders, low-stock count, …) each vs. last period; a revenue panel (`OverviewRevenuePanel.jsx`, `SalesChart.jsx`) and a recent-orders table.
2. **Products** (`3.products`) — table (thumb, name, category, price, total stock, status) with search and status tabs. The form (`/dashboard/products/new`, `/:id/edit`) walks category → name, SKU and description → colours & photos (each colour from the managed list, with its own photos; quick-add a colour) → sizes (only those the category offers) → stock per colour × size → price in € with an On sale switch → labels (New, Featured) → (the category and what it's filed under are chosen in the sidebar's Category card: pick a category and its Subcategories appear in place; pick one and only its types show, each tagged `subcat:<subcategoryId>:<typeId>`; add a type in Categories & Colours and it is pickable here on the next load). A sticky save bar: Save draft / Publish, or Unpublish / Save changes when live. Stock is stored per `colorways: [{ colorId, images[], stock: { size: n } }]`.
3. **Inventory** (`4.inventory`) — one row per colour × size variant: on-hand, reserved (units held by open orders, derived rather than stored), and available. Adjust (received / removed / recounted, with a reason and note), a per-variant movement history, bulk "Receive stock" for a selection, and a low-stock threshold (shop-wide default plus a per-product override). A shipped order deducts on-hand once; cancelling or refunding a shipped order can return units to stock.
4. **Categories & Colours** (`5.categories`) — two tabs. **Categories**: add, rename, delete; each has a name, the sizes it offers and its own **Subcategories** — freely-named "Shop by …" groups (Shop by Category, Shop by Occasion, Shop by Fabric, …), each holding whatever types the admin lists under it (Dresses, Hair and Accessories ship with them seeded). Subcategories belong to their category alone; there is no shared Occasion/Fabric/Style taxonomy any more. They are what the product form offers for tagging and what Mega Menu links point at. A category may also carry a flat single-select `types` list (older products still carry it); once it has Subcategories it stops showing in the tree, the dialog and the product form. Ids are fixed at creation, so a rename reaches every product; a category or type in use by a product, or by a Mega Menu link or tile, can't be removed. **Colours**: add, rename, delete; each is a boutique name, a swatch and a shop-filter family.
5. **Sizes & Guides** (`6.sizes`) — two tabs. **Sizes**: the shop-wide size list (add/rename/delete, usage-guarded against categories and products). **Size guides**: one card per guide (Dresses, Footwear, Hair), each with an editable measurement table and a Preview that renders the exact component the storefront shows, plus "Restore shipped tables".
6. **Mega Menu** (`7.mega-menu`) — top-level items are added, renamed, reordered and removed; each has columns of links plus up to two feature tiles. Nothing is typed but names: a link is picked as a category, a type, one or more filter values or a label, with live piece counts; a tile links to a menu page or one product, and uses an uploaded photo or picks one automatically. Addresses are generated once and kept on rename, and follow the three layers the menu shows: `/item/column/link` (`/dresses/shop-by-colour/white-dresses`); an address from before columns were included still works and redirects to the current one. The menu is built only from what exists, and what a link points at can't be removed from under it: deleting a category, type or Subcategory type that a menu link or tile uses is refused until that link is changed. "Restore original" reloads the shipped `navigation.json`. Saving checks the whole menu first. Each node stores a `target` (`src/utils/menuTargets.js`); the storefront navbar, mobile menu, footer and the catalogue's splat route all read the same tree.
7. **Orders** (`8.orders`) — table of all orders: id, customer, date, total, status chip, tabs by status, search and date-range filters, a detail modal (items, address, timeline, forward-only status actions). Marking an order shipped opens a small dialog for an optional tracking number and carrier. Order data from `ordersApi` over the shared `contentStore`, so a status change here is what the customer's own order tracking shows too.
8. **Transactions** (`9.transactions`, `payments` capability, super-admin only) — every movement of money against an order: payments, refunds, failed attempts, each as its own row. Summary (collected, refunded, net, failed count), filters by type/provider/period, search by transaction id, order, name or email. Read-only until a payment provider is connected.
9. **Discounts** (`10.discounts`, marketing capability) — coupon codes: percent off, a fixed amount off, or free shipping, sitewide (no per-product or per-category scoping). Add, edit, pause/activate, delete; a coupon a past order used keeps its code in that order's history regardless.
10. **Customers** (`11.customers`) — table (name, email, orders count, total spent, joined), row → detail view (profile card + order history).
11. **Reviews** (`12.reviews`, content capability) — every submission lands pending; status tabs (pending/published/hidden), a detail view with publish/hide actions and a reply field shown publicly under the review once posted. Only published reviews are ever readable on the storefront.
12. **Newsletter** (`14.newsletter`, marketing capability) — the Belioras Letter. **Subscribers**: counts, status tabs, search, CSV export with consent record, unsubscribe, erase (GDPR). **Campaigns**: subject, heading, message, featured pieces, a link, a live email preview; draft, schedule or send. **Welcome email**: on/off, its coupon code, wording. Sign-up is double opt-in (`pending` → `subscribed` via `/newsletter/confirm`); only `subscribed` addresses are ever emailed.
13. **Team & roles** (`15.team`) — **Members**: everyone with dashboard access, their role, how far it reaches, and when they last signed in. New people are *invited*: name, email and role make an account waiting for them and a one-time link (`/atelier/invite?token=…`) where they choose their own password; an email that already has a customer account is given access at once. Invitations can be copied again, renewed or withdrawn. **Roles**: editable records (`src/data/rolesSeed.js`, the `roles` domain), each giving every section (`utils/permissions.js`) *No access*, *View* or *Edit*. Administrator is locked. Starting roles: Administrator, Staff, Finance, Customer support, Content editor, Developer / IT. Rules the service enforces: nobody grants beyond their own access, changes their own role or edits the role they hold, and the last Administrator stays one; a role still held can't be deleted.
- **Reports** (`2.reports`) — for a period (this month … all time, or custom): sales & VAT by month, orders, products, coupons, customers, and stock value today; four summary cards; each report downloads as CSV. Sales count orders paid and not refunded.
- **Activity log** (`18.activity`) — sign-ins, failed sign-ins at the atelier door, sign-outs and every change saved in the dashboard, with who, when and what; filters by person and area; CSV export. Written by the services (`services/auth/audited.js`), not the screens.
14. **Shipping** (`17.shipping`) — its own page rather than a panel inside Settings, since shipping is where the shop's real operational complexity lives (zones today, room for carriers and methods later). Per-zone flat rate and free-shipping threshold, edited inline; saves through the same settings document as everything else, merged section-by-section so it never touches Contact/Tax/Compliance.
15. **Settings** (`16.settings`) — one form, several panels: Contact, Storefront (branding/announcement), Compliance (GPSR manufacturer records, legal-page text — the legal pages render straight from these settings, so an edit here is live on save).

## Acceptance

- [ ] Every built module usable end-to-end with demo data (writes persist to the shared `contentStore`, survive a reload).
- [ ] Status workflow transitions enforced (no shipped→pending).
- [ ] Every list/table with a meaningful row count has search, and status filters where the data has a status.
- [ ] Settings' compliance panel updates the corresponding public legal page.
## Shell conventions

- **Buttons.** One size, weight and spacing (`.dash-root .btn`); the page's main action is the solid `btn-primary`, secondary actions are outlined, "View store" is a quiet link.
- **Header.** A breadcrumb from the sidebar's own groups (Catalogue / Products / New) above the page title; a page's main action is portalled into the header with `DashHeaderActions`.
- **Unsaved changes.** Pages that edit a draft (Mega Menu, Settings) show a sticky "You have unsaved changes · Discard · Save" bar while something differs from what is stored.
- **Switches.** `Switch` is the one on/off control: green and knob-right when on. Dates are written in words (`1 Jan 2027`).
- **Destructive actions** always ask first (`ConfirmDialog`), with Undo afterwards where the change can be reversed.
- **Settings** announcements are a list (each with its own switch and optional dates) and feed the storefront's top bar; addresses are stored as four parts plus the joined line the legal pages print.

## Permissions

- The sidebar shows a section only when the signed-in role has at least View; opening one without access shows a refusal inside the shell. A role is read live, so a change applies to people already signed in.
- View-only: the page shows a notice, the header's main action is hidden, and every write is refused by the service (`audited` checks Edit on the section before the write runs, then logs it). A real backend makes the same check server-side.
- The Overview hides money (revenue, average order, the chart) from roles without Transactions or Reports.

## Invoices and receipts

- When payment is confirmed (an order leaves *To pay*), it gets the next invoice number in the year's sequence (`BEL-2026-0001`, prefix from Settings → Invoices) and a receipt to its customer.
- `/invoice/:id` is the invoice, A4 and printable ("Print or save as PDF"); staff, or the customer whose order it is, can open it. Linked from the admin order detail and the customer's order page.
- Email is not connected yet, so receipts (automatic, or "Resend receipt") are recorded as *queued* on the order for the backend's mailer to send. Invoices need a VAT ID in Settings → Invoices before they are valid.
