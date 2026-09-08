import { Link, Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import Forbidden from "../layout/Forbidden";

/**
 * Route guard.
 *
 * Two failures, two different answers, which the previous version conflated:
 *
 *   Not signed in       → ask them to sign in, remembering where they were
 *                         going. Staff routes send them to the staff door, so
 *                         a bookmarked dashboard URL does not drop an admin on
 *                         the shopper's sign-in page.
 *   Signed in, refused  → say so. This used to be a silent redirect to
 *                         /account, which reads as the site malfunctioning
 *                         rather than as a boundary.
 *
 * `capability` is the finer check — "team" for managing accounts, "settings"
 * for store configuration — so staff can run the shop without being able to
 * grant themselves more access.
 */
export default function RequireAuth({ children, adminOnly = false, capability = null }) {
  const { isAuthenticated, isAdmin, can } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const door = adminOnly || capability ? "/atelier" : "/login";
    return <Navigate to={door} state={{ from: location.pathname + location.search }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Forbidden />;
  }

  if (capability && !can(capability)) {
    // Nested inside the dashboard shell, so the sidebar is still there and the
    // useful offer is the work they can do — not a link to the shop.
    return (
      <Forbidden
        standalone={false}
        title="Above your permissions"
        message={
          // Admin-tier but short of this capability means staff; the wording
          // tells them who to ask rather than leaving them stuck.
          isAdmin
            ? "This section is limited to administrators. Ask a Belioras administrator if you need access to it."
            : "Your account does not have access to this section."
        }
        actions={
          <>
            <Link to="/dashboard" className="btn btn-primary btn-md">
              Back to overview
            </Link>
            <Link to="/dashboard/orders" className="btn btn-secondary btn-md">
              Go to orders
            </Link>
          </>
        }
      />
    );
  }

  return children;
}
