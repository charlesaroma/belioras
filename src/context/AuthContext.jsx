import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { useLocalStorage } from "../hooks/useLocalStorage";
import { can as canWithRole, isAdminRole } from "../utils/roles";
import {
  changePassword as changePasswordApi,
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
  updateProfile as updateProfileApi,
  verifyPassword as verifyPasswordApi,
} from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useLocalStorage("belioras:auth", null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(
    async (credentials) => {
      setLoading(true);
      try {
        const result = await loginApi(credentials);
        setSession(result);
        return result;
      } finally {
        setLoading(false);
      }
    },
    [setSession]
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
    [setSession]
  );

  const logout = useCallback(async () => {
    await logoutApi();
    setSession(null);
  }, [setSession]);

  /**
   * Save profile changes and reflect them in the live session.
   *
   * Without the second half the name in the header would stay stale until the
   * next sign-in, which reads as the save having failed.
   */
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

  const value = useMemo(
    () => ({
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
    [session, loading, login, register, logout, updateProfile, changePassword, verifyPassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}