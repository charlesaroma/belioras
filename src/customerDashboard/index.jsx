/**
 * The customer dashboard.
 *
 * A barrel, mirroring src/Dashboard/index.jsx — the admin app's own barrel —
 * so App.jsx reads both areas the same way. This still renders inside the
 * storefront Layout rather than replacing it, and still reuses ProductCard,
 * GridViewSwitcher, StatusChip and the ui/ primitives from src/components/.
 *
 * Avatar, OrderTimeline and accountMenuItems stay in src/components/account/
 * rather than moving in here: the admin sidebar, the global navbar and the
 * public order tracker all import them, and none of those are customer
 * dashboard pages. Nesting shared code inside a folder named for one of its
 * several consumers would point the admin area's imports backwards through
 * the customer's own folder.
 */
export { default as AccountLayout } from "./AccountLayout";

// Pages, numbered in account-menu order (see components/account/accountMenuItems.js)
export { default as AccountProfile } from "./pages/0.profile/Profile";
export { default as AccountOrders } from "./pages/1.orders/Orders";
export { default as AccountOrderDetail } from "./pages/1.orders/OrderDetail";
export { default as AccountWishlist } from "./pages/2.wishlist/Wishlist";
export { default as AccountAddresses } from "./pages/3.addresses/Addresses";
export { default as AccountSettings } from "./pages/4.settings/Settings";
