/* Context Provider: Staff Auth */
import { StaffAuthContext } from "./auth/authContexts";
import { useAuthSession } from "./auth/useAuthSession";

/**
 * A separate storage key, not a separate flag on one session. Two keys is what
 * makes signing out of the dashboard leave a shopper's basket alone, and what
 * stops a staff role leaking into a storefront read.
 */
export default function StaffAuthProvider({ children }) {
  const value = useAuthSession({ realm: "staff", storageKey: "belioras:auth:staff" });

  return <StaffAuthContext.Provider value={value}>{children}</StaffAuthContext.Provider>;
}
