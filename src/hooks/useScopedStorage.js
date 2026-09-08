import { useEffect, useRef, useState } from "react";

/** Module-level, so it needs no memoisation and no dependency suppression. */
function read(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    // Private mode, disabled storage, or corrupt JSON.
    return fallback;
  }
}

function isEmpty(value) {
  if (Array.isArray(value)) return value.length === 0;
  return !value;
}

/**
 * localStorage scoped to the signed-in account.
 *
 * The wishlist and the address book were single device-global keys —
 * `belioras:wishlist`, `belioras:addresses` — not namespaced by user and not
 * cleared on sign-out. On a shared machine the next person to sign in
 * inherited the previous person's saved pieces and their home address. That is
 * a privacy problem, not a tidiness one.
 *
 * Signed out, the key is the bare base, so browsing anonymously still works.
 * Signed in, it becomes `base:<userId>`.
 *
 * On the first sign-in after building an anonymous list, that list is adopted
 * into the account rather than discarded — a shopper who saved six pieces and
 * then registered should not lose them. Adoption merges rather than replaces,
 * so an existing account list is never clobbered, and it happens once: the
 * anonymous key is cleared afterwards, so a later sign-out cannot re-adopt it
 * into a different person's account.
 */
export function useScopedStorage(baseKey, initialValue, userId, { merge } = {}) {
  const key = userId ? `${baseKey}:${userId}` : baseKey;

  const [value, setValue] = useState(() => read(key, initialValue));
  const activeKey = useRef(key);
  const fallback = useRef(initialValue);

  // Swap stores when the account changes: sign-in, sign-out, or a different
  // person signing in on the same browser.
  useEffect(() => {
    if (activeKey.current === key) return;
    const previousKey = activeKey.current;
    activeKey.current = key;

    let next = read(key, fallback.current);

    if (userId && merge && previousKey === baseKey) {
      const anonymous = read(baseKey, fallback.current);
      if (!isEmpty(anonymous)) {
        next = merge(next, anonymous);
        try {
          window.localStorage.removeItem(baseKey);
        } catch {
          // Storage unavailable; the merged value is still correct in memory.
        }
      }
    }

    setValue(next);
  }, [key, baseKey, userId, merge]);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Private mode or quota — state still works for this session.
    }
  }, [key, value]);

  return [value, setValue];
}
