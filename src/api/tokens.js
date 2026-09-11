/* Access And Refresh Token Storage */

/**
 * Two realms, two keys, no shared slot.
 *
 * A staff session and a customer session can exist in the same browser at the
 * same time, and neither may stand in for the other. Storing both under one
 * key is what lets an admin's token travel with a storefront request — so the
 * realm is part of the key, and every read is scoped to one.
 */

export const REALMS = ["customer", "staff"];

const KEY = { customer: "belioras:session:customer", staff: "belioras:session:staff" };

const listeners = new Set();

export function readTokens(realm) {
  try {
    const raw = window.localStorage.getItem(keyFor(realm));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeTokens(realm, tokens) {
  try {
    if (tokens) window.localStorage.setItem(keyFor(realm), JSON.stringify(tokens));
    else window.localStorage.removeItem(keyFor(realm));
  } catch {
    /* Private browsing refuses the write; the session stays in memory */
  }
  listeners.forEach((fn) => fn(realm, tokens));
}

export function clearTokens(realm) {
  writeTokens(realm, null);
}

export function accessToken(realm) {
  return readTokens(realm)?.accessToken ?? null;
}

export function refreshToken(realm) {
  return readTokens(realm)?.refreshToken ?? null;
}

/** Lets an auth context drop its user when a refresh fails mid-flight. */
export function onTokenChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function keyFor(realm) {
  const key = KEY[realm];
  if (!key) throw new Error(`Unknown auth realm: ${realm}`);
  return key;
}
