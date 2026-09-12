/* Auth Session State */
import { useCallback, useMemo, useState } from "react";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { can as canWithRole, isAdminRole } from "@/utils/roles";
import {
  changePassword as changePasswordApi,
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
  updateProfile as updateProfileApi,
  verifyPassword as verifyPasswordApi,
} from "@/services/authApi";

/**
 * One realm's session. Both providers run this; only the realm differs.
 *
 * The realm is fixed here rather than passed per call. It is what authApi
 * refuses a wrong-door sign-in on, and a caller free to choose it each time is
 * a caller free to choose it wrongly — which is the whole failure this split
 * exists to prevent.
 *
 * Still mock-backed and still persisted to localStorage. The in-memory access
 * token in src/api/tokens.js belongs with the switch to real HTTP; adopting it
 * now would sign a developer out on every reload and buy nothing, because the
 * mock session is not a credential.
 */
export function useAuthSession({ realm, storageKey }) {
  const [session, setSession] = useLocalStorage(storageKey, null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(
    async (credentials) => {
      setLoading(true);
      try {
        const result = await loginApi({ ...credentials, realm });
        setSession(result);
        return result;
      } finally {
        setLoading(false);
      }
    },
    [realm, setSession],
  );

  const register = useCallback(
    async (user) => {
      setLoading(true);
      try {
        const result = await registerApi(user);
        setSession(result);
        return result;
      } finally {
        setLoading(false);
      }
    },
    [setSession],
  );

  const logout = useCallback(async () => {
    await logoutApi();
    setSession(null);
  }, [setSession]);

  const userId = session?.user?.id ?? null;

  const updateProfile = useCallback(
    async (patch) => {
      if (!userId) throw new Error("Not signed in.");

      const updated = await updateProfileApi(userId, patch);
      setSession((prev) => (prev ? { ...prev, user: updated } : prev));
      return updated;
    },
    [userId, setSession],
  );

  const verifyPassword = useCallback(
    async (password) => {
      if (!userId) throw new Error("Not signed in.");
      return verifyPasswordApi(userId, password);
    },
    [userId],
  );

  const changePassword = useCallback(
    async (payload) => {
      if (!userId) throw new Error("Not signed in.");
      return changePasswordApi(userId, payload);
    },
    [userId],
  );

  return useMemo(
    () => ({
      realm,
      user: session?.user ?? null,
      role: session?.user?.role ?? null,
      // Derived once here rather than re-derived in every consumer, which is
      // how four copies of the rule appeared and one of them drifted.
      isAdmin: isAdminRole(session?.user?.role),
      can: (capability) => canWithRole(session?.user?.role, capability),
      token: session?.token ?? null,
      loading,
      isAuthenticated: Boolean(session?.token),
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      verifyPassword,
    }),
    [
      realm,
      session,
      loading,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      verifyPassword,
    ],
  );
}
