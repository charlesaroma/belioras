
export { default as DashboardLayout } from "./DashboardLayout";

// Pages, in sidebar order
export { default as DashOverview } from "./pages/0.overview/overview";
export { default as DashProducts } from "./pages/1.products/products";
export { default as DashCategories } from "./pages/2.categories/categories";
export { default as DashMegaMenu } from "./pages/3.mega-menu/mega-menu";
export { default as DashOrders } from "./pages/4.orders/orders";
export { default as DashCustomers } from "./pages/5.customers/customers";
export { default as DashTeam } from "./pages/6.team/team";
export { default as DashSettings } from "./pages/7.settings/settings";

// Chrome shared by every dashboard page
export { default as DashSidebar } from "./components/DashSidebar";
export { default as DashHeader } from "./components/DashHeader";
export { default as DashTable } from "./components/DashTable";
export { default as SalesChart } from "./components/SalesChart";
export { default as StatCard } from "./components/StatCard";
