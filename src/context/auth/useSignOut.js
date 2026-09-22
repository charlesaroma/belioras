import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useToast } from "@/context/ToastContext";
import { useCustomerAuth, useStaffAuth } from "./useAuthRealm";

/**
 * Signs out, then says so.
 *
 * Leaves the guarded route before the session clears: clearing it while still
 * on /account or /dashboard re-renders RequireAuth, which sends the person to
 * the sign-in page they were walking away from.
 */
function useSignOutWith(logout, to) {
  const navigate = useNavigate();
  const { toast } = useToast();

  return useCallback(async () => {
    navigate(to, { replace: true });
    try {
      await logout?.();
      toast("You're signed out.", "success");
    } catch (err) {
      toast(err?.message ?? "Could not sign you out. Please try again.", "error");
    }
  }, [logout, navigate, to, toast]);
}

/** A shopper leaves for the home page. */
export function useCustomerSignOut() {
  return useSignOutWith(useCustomerAuth().logout, "/");
}

/** Staff leave for the atelier sign-in. */
export function useStaffSignOut() {
  return useSignOutWith(useStaffAuth().logout, "/atelier");
}
