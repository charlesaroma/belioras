import { useLocation } from "react-router-dom";

import { useAuth } from "../../../../context/AuthContext";
import { resolveLanding } from "../../../../utils/roles";

/**
 * Where to send someone who is already signed in, or null to stay put.
 *
 * `isAuthenticated` and `user` were destructured for this check and the check
 * itself was never written, so a signed-in shopper who clicked a stale /login
 * link was shown the sign-in form again as though their session had lapsed.
 */

export function useRedirectIfSignedIn() {
  const { isAuthenticated, user } = useAuth();

  const location = useLocation();
  return isAuthenticated ? resolveLanding(user, location.state?.from) : null;
}
