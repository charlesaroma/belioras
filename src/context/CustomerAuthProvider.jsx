/* Context Provider: Customer Auth */
import { CustomerAuthContext } from "./auth/authContexts";
import { useAuthSession } from "./auth/useAuthSession";

export default function CustomerAuthProvider({ children }) {
  const value = useAuthSession({ realm: "customer", storageKey: "belioras:auth:customer" });

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}
