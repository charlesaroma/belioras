/* Dashboard Routes */
import { Navigate, Route } from "react-router-dom";

import RequireAuth from "../components/auth/RequireAuth";
import {
  DashboardLayout,
  DashOverview,
  DashProducts,
  DashInventory,
  DashCategories,
  DashSizes,
  DashMegaMenu,
  DashOrders,
  DashTransactions,
  DashCustomers,
  DashDiscounts,
  DashReviews,
  DashNewsletter,
  DashTeam,
  DashShipping,
  DashSettings,
} from "../AdminDashboard/DashboardPages";
import ProductForm from "../AdminDashboard/pages/3.products/product-form";

export default function dashboardRoutes() {
  return (
    <>
    {/* Guarded: RequireAuth — the admin area was reachable by anyone with the URL before this existed. */}
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
      {/* Product form is a page — linkable and refresh-safe, not a modal. */}
      <Route path="products/new" element={<ProductForm />} />
      <Route path="products/:id/edit" element={<ProductForm />} />
      <Route path="inventory" element={<DashInventory />} />
      <Route path="categories" element={<DashCategories />} />
      <Route path="sizes" element={<DashSizes />} />
      {/* Nav tree is the structural grouping shoppers move through — distinct from category vocabulary; previously conflated under Categories. */}
      <Route path="mega-menu" element={<DashMegaMenu />} />
      <Route path="reviews" element={<DashReviews />} />
      <Route path="orders" element={<DashOrders />} />
      {/* Finance: administrators only. */}
      <Route
        path="transactions"
        element={
          <RequireAuth adminOnly capability="payments">
            <DashTransactions />
          </RequireAuth>
        }
      />
      {/* Staff need the customers behind them — the combined Users page locked them out of the very records they served. */}
      <Route path="customers" element={<DashCustomers />} />
      <Route
        path="discounts"
        element={
          <RequireAuth adminOnly capability="marketing">
            <DashDiscounts />
          </RequireAuth>
        }
      />
      <Route
        path="newsletter"
        element={
          <RequireAuth adminOnly capability="marketing">
            <DashNewsletter />
          </RequireAuth>
        }
      />

      {/* Access management is a job for administrators — the grant control used to sit beside a shopper's delivery history, so staff could promote an account to super-admin. */}
      <Route
        path="team"
        element={
          <RequireAuth adminOnly capability="team">
            <DashTeam />
          </RequireAuth>
        }
      />

      {/* The old combined page, kept so a bookmark lands somewhere useful rather than on a 404. */}
      <Route path="users" element={<Navigate to="/dashboard/customers" replace />} />
      <Route
        path="shipping"
        element={
          <RequireAuth adminOnly capability="settings">
            <DashShipping />
          </RequireAuth>
        }
      />
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
