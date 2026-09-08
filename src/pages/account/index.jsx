/**
 * The client account area.
 *
 * A barrel, mirroring src/Dashboard/index.jsx. App.jsx imported the whole
 * admin app in one line and this area in seven; now both read the same way.
 *
 * The area stays under src/pages/ deliberately. The Dashboard earns its own
 * top-level folder by being a self-contained app that never touches storefront
 * code; the account area is the opposite — it renders inside the storefront
 * Layout and shares ProductCard, GridViewSwitcher, StatusChip and the ui
 * primitives with it. Promoting it would mean either duplicating those or
 * importing across a boundary, so the symmetry would be cosmetic.
 */
export { default as AccountLayout } from "./AccountLayout";
export { default as AccountProfile } from "./Profile";
export { default as AccountOrders } from "./Orders";
export { default as AccountOrderDetail } from "./OrderDetail";
export { default as AccountAddresses } from "./Addresses";
export { default as AccountWishlist } from "./Wishlist";
export { default as AccountSettings } from "./Settings";
