/* Access Token Refresh */
import { apiUrl } from "./config";
import { apiErrorFromBody } from "./error";
import { clearAccessToken, setAccessToken } from "./tokens";
import { routes } from "./routes";

/**
 * One refresh per realm at a time.
 *
 * A page that fires four requests on mount would otherwise send four refreshes
 * against the same cookie. The server rotates refresh tokens, so the three
 * that lose the race present a token that has already been spent — and a spent
 * token is indistinguishable from a stolen one, which revokes every session
 * the user has. Deduping here is what keeps a normal page load from looking
 * like an attack.
 */

const pending = new Map();

export function refreshSession(realm) {
  if (!pending.has(realm)) {
    pending.set(
      realm,
      run(realm).finally(() => pending.delete(realm)),
    );
  }
  return pending.get(realm);
}

async function run(realm) {
  // The refresh token is an httpOnly cookie, so it is never read here — it
  // rides along because of `credentials`. The header is what tells the server
  // which realm's cookie to honour when a browser holds both.
  const response = await fetch(apiUrl(routes.auth.refresh), {
    method: "POST",
    credentials: "include",
    headers: { Accept: "application/json", "X-Auth-Realm": realm },
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    clearAccessToken(realm);
    throw apiErrorFromBody(response.status, body);
  }

  const session = body?.data ?? body;
  setAccessToken(realm, session?.accessToken ?? null);
  return session;
}
