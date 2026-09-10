/* Dashboard Routes */
import { Navigate, Route } from "react-router-dom";

import RequireAuth from "../components/auth/RequireAuth";
import {
  DashboardLayout,
  DashOverview,
  DashProducts,
  DashCategories,
  DashMegaMenu,
  DashOrders,
  DashCustomers,
  DashTeam,
  DashSettings,
} from "../Dashboard";
import ProductForm from "../Dashboard/pages/1.products/product-form";

export default function dashboardRoutes() {
  return (
    <>
    {/*
      Guarded. The component existed and was written for exactly this,
      but was never applied — so the admin area, including customer
      names, emails and order totals, was reachable by anyone who typed
      the URL on the deployed site.
    */}
    <Route
      path="/dashboard"
      element={
        <RequireAuth adminOnly>
          <DashboardLayout />
        </RequireAuth>
      }
    >
      <Route index element={<DashOverview />} />
      <Route path="products" element={<DashProducts />} />
      {/* The product form is a page, not a modal: it is long enough that
          a 90vh box scrolling internally was the wrong container, and a
          route makes an edit linkable and refresh-safe. */}
      <Route path="products/new" element={<ProductForm />} />
      <Route path="products/:id/edit" element={<ProductForm />} />
      <Route path="categories" element={<DashCategories />} />
      {/* The navigation tree gets its own section: it is the structure
          shoppers move through, not the vocabulary pieces are tagged
          with, and the two were conflated under Categories. */}
      <Route path="mega-menu" element={<DashMegaMenu />} />
      <Route path="orders" element={<DashOrders />} />
      {/* Staff handle orders, so they need the customers behind them.
          The combined Users page was administrator-only, which locked
          staff out of the very records they were being asked to serve. */}
      <Route path="customers" element={<DashCustomers />} />

      {/*
        Access management is its own job, and an administrator's. It used
        to share a table with customers, so the control that grants
        administrator rights sat beside a shopper's delivery history —
        and staff could promote a colleague, or an account they
        controlled, to super-admin.
      */}
      <Route
        path="team"
        element={
          <RequireAuth adminOnly capability="team">
            <DashTeam />
          </RequireAuth>
        }
      />

      {/* The old combined page, kept so a bookmark still lands somewhere
          useful rather than on a 404. */}
      <Route path="users" element={<Navigate to="/dashboard/customers" replace />} />
      <Route
        path="settings"
        element={
          <RequireAuth adminOnly capability="settings">
            <DashSettings />
          </RequireAuth>
        }
      />
    </Route>

    {/* Main App Routes - With navbar/footer */}
    </>
  );
}
