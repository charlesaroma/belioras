/**
 * Who can do what.
 *
 * "Admin" was defined in four places — RequireAuth, AccountMenu, AccountLayout
 * and AuthLayout — and the fourth also tested for a role named "admin", which
 * does not exist in users.json. Four copies of a security rule is four chances
 * for one of them to drift, and one already had.
 *
 * Capabilities rather than role checks at the call site: the question a
 * component wants to ask is "may this person manage the team", not "is this
 * person one of the following two role strings". When a fourth role appears,
 * the map changes and no component does.
 */

export const ROLES = {
  SUPER_ADMIN: "super-admin",
  STAFF: "staff",
  CUSTOMER: "customer",
};

/** Roles with any access to the atelier dashboard at all. */
export const ADMIN_ROLES = new Set([ROLES.SUPER_ADMIN, ROLES.STAFF]);

/**
 * Capability grants.
 *
 * Staff run the shop — catalogue, orders, content. They deliberately do not
 * hold `team` or `settings`: staff could previously open the users page and
 * promote a colleague, or an account they controlled, to super-admin. Store
 * settings are excluded for the same reason — legal entity, tax rate and the
 * published contact addresses are not day-to-day operations.
 */

export const CAPABILITIES = {
  [ROLES.SUPER_ADMIN]: new Set(["catalog", "orders", "content", "settings", "team"]),
  [ROLES.STAFF]: new Set(["catalog", "orders", "content"]),
  [ROLES.CUSTOMER]: new Set(),
};

/* is Admin Role */
export function isAdminRole(role) {
  return ADMIN_ROLES.has(role);
}

export function can(role, capability) {
  return CAPABILITIES[role]?.has(capability) ?? false;
}

/** Where a person belongs when no particular destination was requested. */
export function landingFor(user) {
  return isAdminRole(user?.role) ? "/dashboard" : "/account";
}

/**
 * Where to send someone after they sign in.
 *
 * `from` is the page they were trying to reach before being asked to sign in.
 * RequireAuth has always recorded it and nothing ever read it, so a customer
 * who followed a link to a specific order was signed in and then dumped on the
 * account overview, having lost what they came for.
 *
 * It is only honoured when the person is actually allowed there. An
 * unauthenticated visitor typing /dashboard/users is bounced to /login with
 * that path saved; if they then sign in as a customer, following it blindly
 * would land them on a 403 — which reads as a broken sign-in rather than as
 * the correct refusal it is.
 */

/* resolve Landing */
export function resolveLanding(user, from) {

  const fallback = landingFor(user);
  if (!from || typeof from !== "string" || !from.startsWith("/")) return fallback;

  // Never bounce back to an auth page; that loops.
  if (/^\/(login|signup|atelier|forgot-password)\b/.test(from)) return fallback;

  if (from.startsWith("/dashboard") && !isAdminRole(user?.role)) return fallback;

  return from;
}
