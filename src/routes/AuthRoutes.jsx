/* Auth Routes */
import { Route } from "react-router-dom";

import LoginPage from "../pages/0.auth/customer/login";
import SignupPage from "../pages/0.auth/customer/signup";
import ForgotPasswordPage from "../pages/0.auth/customer/forgotpassword";
import AtelierLoginPage from "../pages/0.auth/admin/atelier";
import AtelierInvitePage from "../pages/0.auth/admin/atelierInvite";
import InvoicePage from "../pages/invoice/InvoicePage";

// Full screen, returned as a fragment so App keeps one <Routes>.
export default function authRoutes() {
  return (
    <>
        {/* Auth Routes - Full screen without navbar/footer */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Staff door: admin login, separate from shopper's — where 2FA and rate limiting attach. */}
        <Route path="/atelier" element={<AtelierLoginPage />} />
        {/* Where an invited team member chooses their own password. */}
        <Route path="/atelier/invite" element={<AtelierInvitePage />} />

        {/* An order's invoice, full screen so it prints clean. The page checks who may read it. */}
        <Route path="/invoice/:id" element={<InvoicePage />} />
    </>
  );
}
