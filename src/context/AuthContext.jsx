import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { useLocalStorage } from "../hooks/useLocalStorage";
import { login as loginApi, register as registerApi, logout as logoutApi } from "../services/authApi";

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

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      role: session?.user?.role ?? null,
      token: session?.token ?? null,
      loading,
      isAuthenticated: Boolean(session?.token),
      login,
      register,
      logout,
    }),
    [session, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}