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

import { getState } from "../services/store/contentStore";
import { SECTIONS, levelIn } from "./permissions";

export const ROLES = {
  SUPER_ADMIN: "super-admin",
  STAFF: "staff",
  CUSTOMER: "customer",
};

/**
 * Roles are records the administrator edits (Team → Roles), each giving every
 * dashboard section a level — see permissions.js. Anyone whose role is not
 * "customer" and exists has some dashboard access.
 */
function roleRecord(roleId) {
  return getState("roles").items.find((r) => r.id === roleId) ?? null;
}

export function isAdminRole(role) {
  return Boolean(role) && role !== ROLES.CUSTOMER && Boolean(roleRecord(role));
}

/** "none", "view" or "edit" for one dashboard section. */
export function accessFor(roleId, section) {
  return levelIn(roleRecord(roleId), section);
}

export function canView(roleId, section) {
  return accessFor(roleId, section) !== "none";
}

export function canEdit(roleId, section) {
  return accessFor(roleId, section) === "edit";
}

/** The first section this role may open — where a sign-in lands. */
export function firstSection(roleId) {
  return SECTIONS.find((s) => canView(roleId, s.id))?.id ?? null;
}

export function roleName(roleId) {
  return roleRecord(roleId)?.name ?? (roleId === ROLES.CUSTOMER ? "Customer" : roleId);
}

/** Where a person belongs when no particular destination was requested. */
export function landingFor(user) {
  if (!isAdminRole(user?.role)) return "/account";
  const first = firstSection(user.role);
  return !first || first === "overview" ? "/dashboard" : `/dashboard/${first}`;
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

export function resolveLanding(user, from) {

  const fallback = landingFor(user);
  if (!from || typeof from !== "string" || !from.startsWith("/")) return fallback;

  // Never bounce back to an auth page; that loops.
  if (/^\/(login|signup|atelier|forgot-password)\b/.test(from)) return fallback;

  if (from.startsWith("/dashboard") && !isAdminRole(user?.role)) return fallback;

  return from;
}
