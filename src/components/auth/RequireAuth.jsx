import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const ADMIN_ROLES = new Set(["super-admin", "staff"]);

export default function RequireAuth({ children, adminOnly = false }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />
    );
  }

  if (adminOnly && !ADMIN_ROLES.has(user?.role)) {
    return <Navigate to="/account" replace />;
  }

  return children;
}