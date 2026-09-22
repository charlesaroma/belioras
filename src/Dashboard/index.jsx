
export { default as DashboardLayout } from "./DashboardLayout";

// Pages, in sidebar order
export { default as DashOverview } from "./pages/0.overview/overview";
export { default as DashProducts } from "./pages/2.products/products";
export { default as DashCategories } from "./pages/4.categories/categories";
export { default as DashMegaMenu } from "./pages/6.mega-menu/mega-menu";
export { default as DashOrders } from "./pages/7.orders/orders";
export { default as DashTransactions } from "./pages/8.transactions/transactions";
export { default as DashCustomers } from "./pages/10.customers/customers";
export { default as DashNewsletter } from "./pages/13.newsletter/newsletter";
export { default as DashTeam } from "./pages/14.team/team";
export { default as DashSettings } from "./pages/15.settings/settings";

// Chrome shared by every dashboard page
export { default as DashSidebar } from "./components/DashSidebar";
export { default as DashHeader } from "./components/DashHeader";
export { default as DashTable } from "./components/DashTable";
export { default as SalesChart } from "./components/SalesChart";
export { default as StatCard } from "./components/StatCard";
