/* Auth Realm Contexts */
import { createContext } from "react";

/**
 * Two contexts, never one.
 *
 * A shopper and a member of staff can be signed in in the same browser, and
 * neither session may answer for the other. Kept in their own file so the
 * provider modules export only components and the hook module only hooks,
 * which is what keeps fast refresh working across all four.
 */

export const CustomerAuthContext = createContext(null);
export const StaffAuthContext = createContext(null);
