/* Access Token Refresh */
import { apiUrl } from "./apiConfig";
import { ApiError, apiErrorFromBody } from "./apiError";
import { clearTokens, readTokens, writeTokens } from "./apiTokens";
import { routes } from "./apiRoutes";

/**
 * One refresh per realm at a time.
 *
 * A page that fires four requests on mount would otherwise send four refreshes
 * against the same expired token. The backend rotates refresh tokens, so the
 * three that lose the race present a token that has already been spent and the
 * session is logged out for no reason.
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
  const token = readTokens(realm)?.refreshToken;
  if (!token) throw new ApiError("Your session has expired.", 401);

  const response = await fetch(apiUrl(routes.auth.refresh), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ refreshToken: token }),
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    clearTokens(realm);
    throw apiErrorFromBody(response.status, body);
  }

  const tokens = body?.data ?? body;
  writeTokens(realm, tokens);
  return tokens;
}
