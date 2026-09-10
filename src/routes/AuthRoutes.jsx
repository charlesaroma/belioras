/* Auth Routes */
import { Route } from "react-router-dom";

import LoginPage from "../pages/0.auth/customer/login";
import SignupPage from "../pages/0.auth/customer/signup";
import ForgotPasswordPage from "../pages/0.auth/customer/forgotpassword";
import AtelierLoginPage from "../pages/0.auth/admin/atelier";

// Full screen, no navbar or footer. Returned as a fragment of <Route>
// elements so App keeps one <Routes> and the router still sees them directly.
export default function authRoutes() {
  return (
    <>
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
    </>
  );
}
