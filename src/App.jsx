import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { ToastProvider } from "./context/ToastContext";
import { WishlistProvider } from "./context/WishlistContext";
import WishlistPage from "./pages/account/Wishlist";

import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/Footer";
import CookieConsent from "./components/layout/CookieConsent";
import FlashSalePopup from "./components/layout/FlashSalePopup";
import ScrollToTop from "./components/layout/ScrollToTop";
import NotFound from "./components/layout/NotFound";

import HomePage from "./pages/1.home/home";
import WhatsNewPage from "./pages/2.whatsNew/whatsNew";
import ShopPage from "./pages/3.shop/shop";
import CategoryPage from "./pages/3.shop/CategoryPage";
import DressesPage from "./pages/4.dresses/DressesPage";
import HairPage from "./pages/5.hair/HairPage";
import AccessoriesPage from "./pages/6.accessories/AccessoriesPage";
import ProductPage from "./pages/product/product";
import SearchPage from "./pages/search/SearchPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";

import LoginPage from "./pages/0.auth/login";
import SignupPage from "./pages/0.auth/signup";
import ForgotPasswordPage from "./pages/0.auth/forgotpassword";

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

function AppProviders({ children }) {
  return (
    <CurrencyProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>{children}</ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </CurrencyProvider>
  );
}

function Layout() {
  return (
    <div className="flex min-h-dvh flex-col bg-ivory-50 text-espresso">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
      <FlashSalePopup />
    </div>
  );
}

/**
 * Dashboard and protected-area routes are intentionally commented out while
 * the storefront is built first. They will be mounted under /dashboard with
 * <RequireAuth> once the auth pass lands.
 */
function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/whats-new" element={<WhatsNewPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:category" element={<CategoryPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            <Route path="/faq" element={<FAQPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
            <Route path="/order-tracking" element={<OrderTrackingPage />} />
            <Route path="/hair-length-guide" element={<HairLengthGuidePage />} />
            <Route path="/shoe-size-guide" element={<ShoeSizeGuidePage />} />
            <Route path="/wishlist" element={<WishlistPage />} />

            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
            <Route path="/return-and-refund-policy" element={<ReturnAndRefundPolicyPage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />

            <Route path="*" element={<NotFound />} />
          </Route>

          {/* <Route path="/dashboard" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
            <Route index element={<DashboardHome />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
            <Route path="addresses" element={<AddressesPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
          </Route> */}
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;