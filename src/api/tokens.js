/* Access Tokens, Per Realm */

/**
 * Memory, not localStorage.
 *
 * A token in localStorage is readable by any injected script and outlives the
 * tab that earned it. Held here it dies with the page, which is why each realm
 * re-establishes itself from its refresh cookie on boot rather than reading a
 * session back off disk.
 *
 * Two realms, never one slot: a staff session and a customer session can exist
 * in the same browser at once, and neither may stand in for the other. The
 * refresh token itself carries the realm, so a staff cookie cannot mint a
 * customer session even if it reaches the wrong call.
 */

export const REALMS = ["customer", "staff"];

const tokens = new Map();
const listeners = new Set();

export function accessToken(realm) {
  return tokens.get(assertRealm(realm)) ?? null;
}

export function setAccessToken(realm, token) {
  assertRealm(realm);
  if (token) tokens.set(realm, token);
  else tokens.delete(realm);

  listeners.forEach((fn) => fn(realm, token ?? null));
}

export function clearAccessToken(realm) {
  setAccessToken(realm, null);
}

/** Lets an auth context drop its user when a refresh fails mid-flight. */
export function onTokenChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function assertRealm(realm) {
  if (!REALMS.includes(realm)) throw new Error(`Unknown auth realm: ${realm}`);
  return realm;
}
