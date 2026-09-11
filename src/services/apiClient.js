/* Mock Transport */

/**
 * The storefront still answers from fixtures. Services import `mockApi` here
 * and will import `http` from `./http` instead, one module at a time, as the
 * backend starts serving each route.
 *
 * `ApiError` is re-exported rather than redefined so both transports throw the
 * same type: a page that catches an ApiError today keeps working unchanged
 * after its service moves onto HTTP.
 */

export { ApiError } from "./http/apiError";

export function mockDelay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockApi(resolver, ms = 250) {
  await mockDelay(ms);
  return resolver();
}
