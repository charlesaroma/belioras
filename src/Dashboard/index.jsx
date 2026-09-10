/**
 * Dashboard barrel.
 *
 * Page folders are numbered in sidebar order (see lib/constants.jsx), the same
 * convention src/pages uses for the storefront. Each page owns a folder; its
 * private parts live in that folder's sections/.
 */
export { default as DashboardLayout } from "./DashboardLayout";

// Pages, in sidebar order
export { default as DashOverview } from "./pages/0.overview/DashOverview";
export { default as DashProducts } from "./pages/1.products/DashProducts";
export { default as DashCategories } from "./pages/2.categories/DashCategories";
export { default as DashMegaMenu } from "./pages/3.mega-menu/DashMegaMenu";
export { default as DashOrders } from "./pages/4.orders/DashOrders";
export { default as DashCustomers } from "./pages/5.customers/DashCustomers";
export { default as DashTeam } from "./pages/6.team/DashTeam";
export { default as DashSettings } from "./pages/7.settings/DashSettings";

// Chrome shared by every dashboard page
export { default as DashSidebar } from "./components/DashSidebar";
export { default as DashHeader } from "./components/DashHeader";
export { default as DashTable } from "./components/DashTable";
export { default as SalesChart } from "./components/SalesChart";
export { default as StatCard } from "./components/StatCard";
