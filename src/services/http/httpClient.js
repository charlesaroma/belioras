/* Http Client */
import { apiTimeout, apiUrl } from "./apiConfig";
import { apiErrorFromBody, networkError } from "./apiError";
import { accessToken, refreshToken } from "./apiTokens";
import { refreshSession } from "./apiRefresh";

/**
 * Every call names its realm. There is no ambient "current user" here, because
 * a staff token reaching a storefront request is the bug this whole layer is
 * shaped to prevent.
 */

async function request(method, path, options = {}) {
  const { body, params, realm = "customer", headers, signal, retry = true } = options;
  const control = abortAfter(apiTimeout, signal);
  let response;

  try {
    response = await fetch(apiUrl(path, params), {
      method,
      signal: control.signal,
      headers: buildHeaders({ body, headers, realm }),
      body: serialize(body),
    });
  } catch (cause) {
    throw networkError(cause);
  } finally {
    control.done();
  }

  if (response.status === 401 && retry && refreshToken(realm)) {
    await refreshSession(realm);
    return request(method, path, { ...options, retry: false });
  }

  return unwrap(response);
}

function buildHeaders({ body, headers, realm }) {
  const token = accessToken(realm);
  return {
    Accept: "application/json",
    // FormData sets its own multipart boundary; naming a type here breaks it.
    ...(body && !(body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };
}

function serialize(body) {
  if (body === undefined || body === null) return undefined;
  return body instanceof FormData ? body : JSON.stringify(body);
}

/** The API answers `{ data }` on success and `{ error }` on failure. */
async function unwrap(response) {
  if (response.status === 204) return null;

  const body = await response.json().catch(() => null);
  if (!response.ok) throw apiErrorFromBody(response.status, body);
  return body?.data ?? body;
}

function abortAfter(ms, signal) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  signal?.addEventListener("abort", () => controller.abort(), { once: true });

  return { signal: controller.signal, done: () => clearTimeout(timer) };
}

export const http = {
  get: (path, options) => request("GET", path, options),
  post: (path, body, options) => request("POST", path, { ...options, body }),
  patch: (path, body, options) => request("PATCH", path, { ...options, body }),
  put: (path, body, options) => request("PUT", path, { ...options, body }),
  del: (path, options) => request("DELETE", path, options),
};
