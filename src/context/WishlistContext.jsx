/* Context Provider: WishlistContext */
import { createContext, useCallback, useContext, useMemo } from "react";

import { useAuth } from "./AuthContext";
import { useScopedStorage } from "../hooks/useScopedStorage";

const WishlistContext = createContext(null);

function mergeIds(accountIds = [], anonymousIds = []) {
  return [...new Set([...accountIds, ...anonymousIds])];
}

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [ids, setIds] = useScopedStorage("belioras:wishlist", [], user?.id, {
    merge: mergeIds,
  });

  const toggle = useCallback(
    (id) => {
      setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    },
    [setIds],
  );

  const remove = useCallback(
    (id) => setIds((prev) => prev.filter((x) => x !== id)),
    [setIds],
  );

  const clear = useCallback(() => setIds([]), [setIds]);

  const has = useCallback((id) => ids.includes(id), [ids]);

  const value = useMemo(
    () => ({ ids, toggle, remove, clear, has, count: ids.length }),
    [ids, toggle, remove, clear, has],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {

  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
