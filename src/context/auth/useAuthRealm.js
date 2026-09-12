/* Auth Realm Hooks */
import { useContext } from "react";

import { CustomerAuthContext, StaffAuthContext } from "./authContexts";

/** The shopper's session. Never returns a member of staff. */
export function useCustomerAuth() {
  return useRealmContext(CustomerAuthContext, "useCustomerAuth", "CustomerAuthProvider");
}

/** The staff session behind the dashboard. Never returns a shopper. */
export function useStaffAuth() {
  return useRealmContext(StaffAuthContext, "useStaffAuth", "StaffAuthProvider");
}

function useRealmContext(context, hook, provider) {
  const ctx = useContext(context);
  if (!ctx) throw new Error(`${hook} must be used within ${provider}`);
  return ctx;
}
