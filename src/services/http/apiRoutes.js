/* Api Route Map */

/**
 * Where each backend module mounts, agreed before the module exists so a
 * service is written against the same path the API will serve.
 *
 * `identity` mounts at /auth: the module is named for the domain it owns, the
 * route for what a client calls. The rest are reserved namespaces — nothing
 * answers on them yet, and their services still run on mocks.
 */

export const API_NAMESPACES = {
  identity: "auth",
  catalog: "catalog",
  content: "content",
  inventory: "inventory",
  pricing: "pricing",
  cart: "cart",
  checkout: "checkout",
  orders: "orders",
  payments: "payments",
  customers: "customers",
  behavior: "behavior",
  reviews: "reviews",
  media: "media",
  notifications: "notifications",
  search: "search",
  analytics: "analytics",
};

/** Live endpoints. Everything absent from here is still a mock. */
export const routes = {
  health: "health",

  auth: {
    register: "auth/register",
    login: "auth/login",
    refresh: "auth/refresh",
    logoutAll: "auth/logout-all",
    me: "auth/me",
    preferences: "auth/me/preferences",
  },
};
