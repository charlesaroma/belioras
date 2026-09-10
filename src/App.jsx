import { BrowserRouter, Navigate, Outlet, Route, Routes, useSearchParams } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ContentProvider } from "./context/ContentContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ProductDraftProvider } from "./context/ProductDraftContext";
import { ToastProvider } from "./context/ToastContext";
import { WishlistProvider } from "./context/WishlistContext";

import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/Footer";
import CookieConsent from "./components/layout/CookieConsent";
import BackToTop from "./components/layout/BackToTop";
import ScrollToTop from "./components/layout/ScrollToTop";
import RequireAuth from "./components/auth/RequireAuth";
import NotFound from "./components/layout/NotFound";
import ToastViewport from "./components/ui/ToastViewport";
import DraftDock from "./components/ui/DraftDock";

import HomePage from "./pages/1.home/home";
import ShopPage from "./pages/3.shop/shop";
import CatalogPage from "./pages/3.shop/CatalogPage";
import ProductPage from "./pages/product/product";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import CheckoutConfirmation from "./pages/checkout/Confirmation";

import LoginPage from "./pages/0.auth/customer/login";
import SignupPage from "./pages/0.auth/customer/signup";
import ForgotPasswordPage from "./pages/0.auth/customer/forgotpassword";
import AtelierLoginPage from "./pages/0.auth/admin/atelier";

import FAQPage from "./pages/FAQ/faq";
import AboutUsPage from "./pages/customer-support/about-us";
import ContactUsPage from "./pages/customer-support/contact-us";
import OrderTrackingPage from "./pages/customer-support/order-tracking";
import HairLengthGuidePage from "./pages/customer-support/hair-length-guide";
import ShoeSizeGuidePage from "./pages/customer-support/shoe-size-guide";

import PrivacyPolicyPage from "./pages/legal/privacy-policy";
import TermsOfServicePage from "./pages/legal/terms-of-service";
import ShippingPolicyPage from "./pages/legal/shipping-policy";
import ReturnAndRefundPolicyPage from "./pages/legal/return-and-refund-policy";
import CookiePolicyPage from "./pages/legal/cookie-policy";

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
} from "./Dashboard";
import ProductForm from "./Dashboard/pages/1.products/product-form";

import {
  AccountLayout,
  AccountProfile,
  AccountOrders,
  AccountOrderDetail,
  AccountAddresses,
  AccountWishlist,
  AccountSettings,
} from "./customerDashboard";
import { cn } from "./utils/cn";

/** Forwards /search?q=… to the real results surface, preserving the term. */
function SearchRedirect() {
  const [params] = useSearchParams();
  const q = params.get("q");
  return <Navigate to={q ? `/shop?q=${encodeURIComponent(q)}` : "/shop"} replace />;
}

function AppProviders({ children }) {
  return (
    <ContentProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                {/* Above BrowserRouter, so navigating away cannot unmount an
                    in-progress product draft. */}
                <ProductDraftProvider>
                  <ToastProvider>
                    {children}
                    {/* The render half of the toast system. Without it the
                        provider held state and ran timers while nothing was
                        ever drawn, so every toast() call was a silent no-op.
                        Uses no router hooks, so it is safe out here. */}
                    <ToastViewport />
                  </ToastProvider>
                </ProductDraftProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </ContentProvider>
  );
}

function Layout() {
  return (
    <div className={cn('flex', 'min-h-dvh', 'flex-col', 'bg-ivory-50', 'text-espresso')}>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <CookieConsent />
    </div>
  );
}

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <ScrollToTop />
        {/* Inside the router because Resume is a Link, but fed by a provider
            that sits outside it — so the draft itself survives navigation
            while the dock still renders app-wide, dashboard or storefront. */}
        <DraftDock />
        <Routes>
          {/* Auth Routes - Full screen without navbar/footer */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/*
            The staff door, deliberately separate from the shopper's. Linked
            from nowhere on the storefront. Both call the same login(); the
            split is about who each page is for, and it is where the backend
            will attach staff 2FA and tighter rate limiting.
          */}
          <Route path="/atelier" element={<AtelierLoginPage />} />

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
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/whats-new" element={<Navigate to="/new-arrivals" replace />} />
            <Route path="/shop" element={<ShopPage />} />

            {/*
              Splat per root rather than a route per dimension. The navigation
              data has leaves one, two and three segments deep, and a future
              dashboard-added item must produce a working URL without a code
              change. CatalogPage renders NotFound for anything the navigation
              tree does not contain, so garbage paths still 404.
            */}
            <Route path="/shop/*" element={<CatalogPage />} />
            <Route path="/new-arrivals/*" element={<CatalogPage />} />
            <Route path="/dresses/*" element={<CatalogPage />} />
            <Route path="/hair/*" element={<CatalogPage />} />
            <Route path="/accessories/*" element={<CatalogPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            {/*
              One results surface. /shop already filters on ?q= and carries the
              facets, sort and density a results page needs; /search was a stub
              that printed the term and no products. Redirecting rather than
              deleting keeps any existing link or bookmark working.
            */}
            <Route path="/search" element={<SearchRedirect />} />
            {/* Guest checkout by design — requiring registration before a
                first purchase is a well-known way to lose the purchase. */}
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/confirmed/:id" element={<CheckoutConfirmation />} />

            <Route path="/faq" element={<FAQPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
            <Route path="/order-tracking" element={<OrderTrackingPage />} />
            <Route path="/hair-length-guide" element={<HairLengthGuidePage />} />
            <Route path="/shoe-size-guide" element={<ShoeSizeGuidePage />} />
            {/*
              The account tree. Every one of these pages was written and none
              were routed, so /account — which NavActions, MobileMenu, the
              post-login redirect and RequireAuth's own non-admin fallback all
              point at — resolved to NotFound. A customer who signed in was
              sent straight to a 404.
            */}
            <Route
              path="/account"
              element={
                <RequireAuth>
                  <AccountLayout />
                </RequireAuth>
              }
            >
              <Route index element={<AccountProfile />} />
              <Route path="orders" element={<AccountOrders />} />
              <Route path="orders/:id" element={<AccountOrderDetail />} />
              <Route path="addresses" element={<AccountAddresses />} />
              <Route path="wishlist" element={<AccountWishlist />} />
              <Route path="settings" element={<AccountSettings />} />
            </Route>

            {/* One canonical URL for saved pieces. The header heart and any
                existing bookmark keep working. */}
            <Route path="/wishlist" element={<Navigate to="/account/wishlist" replace />} />

            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
            <Route path="/return-and-refund-policy" element={<ReturnAndRefundPolicyPage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;