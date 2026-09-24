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
    {/* Guarded: RequireAuth — admin area was open before guard. */}
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
      {/* Product form: page, not modal. */}
      <Route path="products/new" element={<ProductForm />} />
      <Route path="products/:id/edit" element={<ProductForm />} />
      <Route path="inventory" element={<DashInventory />} />
      <Route path="categories" element={<DashCategories />} />
      <Route path="sizes" element={<DashSizes />} />
      {/* Nav tree: shopper grouping, distinct from categories. */}
      <Route path="mega-menu" element={<DashMegaMenu />} />
      <Route path="reviews" element={<DashReviews />} />
      <Route path="orders" element={<DashOrders />} />
      {/* Finance: admins only. */}
      <Route
        path="transactions"
        element={
          <RequireAuth adminOnly capability="payments">
            <DashTransactions />
          </RequireAuth>
        }
      />
      {/* Staff: Users page locks them out of served records. */}
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

      {/* Access mgmt: grant control beside delivery history, enables super-admin promote. */}
      <Route
        path="team"
        element={
          <RequireAuth adminOnly capability="team">
            <DashTeam />
          </RequireAuth>
        }
      />

      {/* Old combined page: bookmark lands useful, not 404. */}
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
