/* Storefront Routes */
import { Navigate, Route } from "react-router-dom";

import StorefrontLayout from "../app/StorefrontLayout";
import RequireAuth from "../components/auth/RequireAuth";
import NotFound from "../components/layout/NotFound";
import SearchRedirect from "./SearchRedirect";

import HomePage from "../pages/1.home/home";
import ShopPage from "../pages/3.shop/shop";
import CatalogPage from "../pages/3.shop/CatalogPage";
import ProductPage from "../pages/product/product";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import CheckoutConfirmation from "../pages/checkout/Confirmation";
import FAQPage from "../pages/FAQ/faq";
import AboutUsPage from "../pages/customer-support/about-us";
import ContactUsPage from "../pages/customer-support/contact-us";
import OrderTrackingPage from "../pages/customer-support/order-tracking";
import HairLengthGuidePage from "../pages/customer-support/hair-length-guide";
import ShoeSizeGuidePage from "../pages/customer-support/shoe-size-guide";
import PrivacyPolicyPage from "../pages/legal/privacy-policy";
import TermsOfServicePage from "../pages/legal/terms-of-service";
import CookiePolicyPage from "../pages/legal/cookie-policy";
import ShippingPolicyPage from "../pages/legal/shipping-policy";
import ReturnAndRefundPolicyPage from "../pages/legal/return-and-refund-policy";
import {
  AccountLayout,
  AccountProfile,
  AccountOrders,
  AccountOrderDetail,
  AccountWishlist,
  AccountWardrobe,
  AccountAddresses,
  AccountSettings,
} from "../customerDashboard";

export default function storefrontRoutes() {
  return (
    <>
    <Route element={<StorefrontLayout />}>
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
        <Route path="wardrobe" element={<AccountWardrobe />} />
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
    </>
  );
}
