/* Api Base Url And Version */

/**
 * The version lives in the URL, not a header, because the backend mounts it
 * that way: `/api/v1/...`. Keeping it a separate variable from the host means
 * a client can be pinned to v1 while another is moved to v2, without either
 * hardcoding the full prefix.
 */

/**
 * The base URL is empty by default, making every call relative: Netlify
 * proxies /api to the API in production and Vite's dev proxy does the same
 * locally. One origin means no preflight, and a refresh cookie that stays
 * first-party — Safari drops it otherwise. Set the variable only to address an
 * API directly.
 */
const DEFAULTS = {
  VITE_API_BASE_URL: "",
  VITE_API_VERSION: "v1",
  VITE_API_TIMEOUT: "15000",
};

function read(key) {
  const value = import.meta.env?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : DEFAULTS[key];
}

export const apiBaseUrl = read("VITE_API_BASE_URL").replace(/\/+$/, "");
export const apiVersion = read("VITE_API_VERSION");
export const apiTimeout = Number(read("VITE_API_TIMEOUT"));

/** Everything the storefront calls sits under this. */
export const apiRoot = `${apiBaseUrl}/api/${apiVersion}`;

/**
 * Mocks stay on until a module is actually wired to the API. Flipping this to
 * "false" before the backend serves a route would break every page that reads
 * it, so services opt in one at a time rather than the flag switching all of
 * them at once.
 */
export const useMockApi = (import.meta.env?.VITE_API_MOCKS ?? "true") !== "false";

export function apiUrl(path, params) {
  const url = `${apiRoot}/${String(path).replace(/^\/+/, "")}`;
  const query = toQuery(params);
  return query ? `${url}?${query}` : url;
}

function toQuery(params) {
  if (!params) return "";
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) value.forEach((v) => search.append(key, v));
    else search.append(key, String(value));
  }

  return search.toString();
}
