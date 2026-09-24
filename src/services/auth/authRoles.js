/* Team, Roles And Invitations */
import { ApiError, mockApi } from "@/api/mock";
import { getState, setState } from "../store/contentStore";
import { ROLES, accessFor, roleName } from "../../utils/roles";
import { LEVELS, SECTIONS, levelIn, rank } from "../../utils/permissions";
import { slugify } from "../catalog/products/productSlug";
import { findByEmail, publicUser, userItems } from "./authStore";
import { audited } from "./audited";
import { currentActor } from "./activityApi";
import { queueEmail } from "../notifications/emailsApi";

/**
 * Who is on the team, what each role may do, and how people join.
 *
 * Three rules hold everywhere here, so the team can never lock itself out or
 * hand out more than it has: the last Administrator stays one; nobody changes
 * their own role; and nobody grants a level they do not hold themselves.
 */

function roleItems() {
  return getState("roles").items;
}

function writeUsers(fn) {
  setState("users", (state) => ({ ...state, items: fn(state.items) }));
}

function inviteToken() {
  return `inv_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

/** Refuses a role that reaches further than the person assigning it. */
function assertWithinReach(role, actor) {
  if (role.locked && actor?.role !== ROLES.SUPER_ADMIN) {
    throw new ApiError("Only an Administrator can make someone an Administrator.", 403);
  }
  for (const s of SECTIONS) {
    if (rank(levelIn(role, s.id)) > rank(accessFor(actor?.role, s.id))) {
      throw new ApiError(`You can't give ${s.label} access beyond your own.`, 403);
    }
  }
}

/* ---------------------------------------------------------------- Roles */

export function getRoles() {
  return mockApi(() => {
    const counts = {};
    for (const u of userItems()) counts[u.role] = (counts[u.role] ?? 0) + 1;
    return roleItems().map((r) => ({ ...r, members: counts[r.id] ?? 0 }));
  }, 0);
}

function cleanRole({ name, description, permissions } = {}, existingId = null) {
  const trimmed = String(name ?? "").trim();
  if (!trimmed) throw new ApiError("Give the role a name.", 422);
  if (roleItems().some((r) => r.id !== existingId && r.name.toLowerCase() === trimmed.toLowerCase())) {
    throw new ApiError(`There is already a role called ${trimmed}.`, 409);
  }
  const clean = {};
  for (const s of SECTIONS) {
    const level = LEVELS.includes(permissions?.[s.id]) ? permissions[s.id] : "none";
    if (level !== "none") clean[s.id] = s.readOnly && level === "edit" ? "view" : level;
  }
  if (!Object.keys(clean).length) throw new ApiError("Give the role access to at least one section.", 422);
  return { name: trimmed, description: String(description ?? "").trim(), permissions: clean };
}

function createRole$raw(input) {
  return mockApi(() => {
    const fields = cleanRole(input);
    assertWithinReach(fields, currentActor());
    const base = slugify(fields.name) || "role";
    let id = base;
    for (let n = 2; roleItems().some((r) => r.id === id) || id === ROLES.CUSTOMER; n += 1) id = `${base}-${n}`;
    const role = { id, ...fields };
    setState("roles", (state) => ({ ...state, items: [...state.items, role] }));
    return role;
  });
}

function updateRole$raw(id, input) {
  return mockApi(() => {
    const existing = roleItems().find((r) => r.id === id);
    if (!existing) throw new ApiError("That role no longer exists.", 404);
    if (existing.locked) throw new ApiError("The Administrator role always has everything and can't be edited.", 403);
    const actor = currentActor();
    if (actor?.role === id) throw new ApiError("You can't edit the role you hold yourself.", 403);
    const fields = cleanRole(input, id);
    assertWithinReach(fields, actor);
    const updated = { ...existing, ...fields };
    setState("roles", (state) => ({ ...state, items: state.items.map((r) => (r.id === id ? updated : r)) }));
    return updated;
  });
}

function deleteRole$raw(id) {
  return mockApi(() => {
    const role = roleItems().find((r) => r.id === id);
    if (!role) throw new ApiError("That role no longer exists.", 404);
    if (role.locked) throw new ApiError("The Administrator role can't be deleted.", 403);
    const holders = userItems().filter((u) => u.role === id).length;
    if (holders) {
      throw new ApiError(`${holders} ${holders === 1 ? "person has" : "people have"} this role. Give them another role first.`, 409);
    }
    setState("roles", (state) => ({ ...state, items: state.items.filter((r) => r.id !== id) }));
    return role;
  });
}

/* --------------------------------------------------------------- Members */

function updateUserRole$raw(id, role, actor = currentActor()) {
  return mockApi(() => {
    const target = role === ROLES.CUSTOMER ? null : roleItems().find((r) => r.id === role);
    if (role !== ROLES.CUSTOMER && !target) throw new ApiError("Choose a role that exists.", 422);
    if (actor?.id === id) throw new ApiError("You cannot change your own role.", 403);

    const user = userItems().find((u) => u.id === id);
    if (!user) throw new ApiError("Account not found.", 404);
    if (target) assertWithinReach(target, actor);

    // An unadministrable store is not a state the UI should be able to reach.
    if (user.role === ROLES.SUPER_ADMIN && role !== ROLES.SUPER_ADMIN) {
      if (actor?.role !== ROLES.SUPER_ADMIN) throw new ApiError("Only an Administrator can change another Administrator.", 403);
      const admins = userItems().filter((u) => u.role === ROLES.SUPER_ADMIN && u.status !== "invited");
      if (admins.length <= 1) throw new ApiError("This is the only administrator; make someone else one first.", 409);
    }

    const updated = { ...user, role };
    writeUsers((items) => items.map((u) => (u.id === id ? updated : u)));
    return publicUser(updated);
  });
}

/**
 * Adds someone to the team. A new email gets an account waiting for them and
 * an invitation link, where they choose their own password — nobody else ever
 * knows it. An email that already has a customer account is given access at
 * once and signs in as before.
 */
function addTeamMember$raw({ name, email, role = ROLES.STAFF } = {}) {
  return mockApi(() => {
    const actor = currentActor();
    const target = roleItems().find((r) => r.id === role);
    if (!target) throw new ApiError("Choose a role.", 422);
    assertWithinReach(target, actor);

    const address = String(email ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) throw new ApiError("Enter a valid email address.", 422);

    const existing = findByEmail(address);
    if (existing) {
      if (existing.role !== ROLES.CUSTOMER) throw new ApiError(`${existing.name} is already on the team.`, 409);
      const updated = { ...existing, role };
      writeUsers((items) => items.map((u) => (u.id === existing.id ? updated : u)));
      return { user: publicUser(updated), invited: false };
    }

    if (!String(name ?? "").trim()) throw new ApiError("Give them a name.", 422);
    const highest = userItems().reduce((max, u) => Math.max(max, Number(String(u.id).replace(/\D/g, "")) || 0), 0);
    const user = {
      id: `u${highest + 1}`,
      name: String(name).trim(),
      email: address,
      password: null,
      role,
      status: "invited",
      inviteToken: inviteToken(),
      invitedAt: new Date().toISOString(),
      invitedBy: actor?.name ?? null,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    writeUsers((items) => [...items, user]);
    queueEmail({ type: "team-invitation", to: user.email, subject: "You're invited to the Belioras atelier", data: { token: user.inviteToken, role: roleName(role), invitedBy: user.invitedBy } });
    return { user: publicUser(user), invited: true, token: user.inviteToken };
  });
}

/** A fresh link for someone who has not accepted yet; the old one stops working. */
function renewInvite$raw(id) {
  return mockApi(() => {
    const user = userItems().find((u) => u.id === id);
    if (!user || user.status !== "invited") throw new ApiError("That invitation is no longer open.", 404);
    const updated = { ...user, inviteToken: inviteToken(), invitedAt: new Date().toISOString() };
    writeUsers((items) => items.map((u) => (u.id === id ? updated : u)));
    queueEmail({ type: "team-invitation", to: user.email, subject: "Your new Belioras atelier invitation", data: { token: updated.inviteToken, role: roleName(user.role), renewed: true } });
    return { user: publicUser(updated), token: updated.inviteToken };
  });
}

/** Withdraws an invitation nobody accepted: the waiting account goes. */
function cancelInvite$raw(id) {
  return mockApi(() => {
    const user = userItems().find((u) => u.id === id);
    if (!user || user.status !== "invited") throw new ApiError("That invitation is no longer open.", 404);
    writeUsers((items) => items.filter((u) => u.id !== id));
    return publicUser(user);
  });
}

/* ---------------------------------------------------- The invitation page */

/** What the invitation page shows before a password is chosen. */
export function getInvite(token) {
  return mockApi(() => {
    const user = userItems().find((u) => u.status === "invited" && u.inviteToken === token);
    if (!user) throw new ApiError("This invitation link has expired or was already used.", 404);
    return { name: user.name, email: user.email, roleName: roleName(user.role), invitedBy: user.invitedBy };
  }, 200);
}

export function acceptInvite(token, password) {
  return mockApi(() => {
    const user = userItems().find((u) => u.status === "invited" && u.inviteToken === token);
    if (!user) throw new ApiError("This invitation link has expired or was already used.", 404);
    if (String(password ?? "").length < 8) throw new ApiError("Choose a password of at least 8 characters.", 422);
    const updated = { ...user, password, status: "active", inviteToken: null, joinedAt: new Date().toISOString() };
    const { inviteToken: _drop, ...rest } = updated;
    void _drop;
    writeUsers((items) => items.map((u) => (u.id === user.id ? rest : u)));
    return publicUser(rest);
  });
}

/* Checked against the signed-in person's Team access, and recorded in the activity log. */
const nameOf = (id) => userItems().find((u) => u.id === id)?.name ?? "someone";
export const createRole = audited("team", (_, r) => `Created the role ${r.name}`, createRole$raw);
export const updateRole = audited("team", (_, r) => `Edited the role ${r.name}`, updateRole$raw);
export const deleteRole = audited("team", (_, r) => `Deleted the role ${r.name}`, deleteRole$raw);
export const updateUserRole = audited(
  "team",
  ([, role], r) => (role === ROLES.CUSTOMER ? `Removed ${r.name}'s dashboard access` : `Made ${r.name} ${roleName(role)}`),
  updateUserRole$raw,
);
export const addTeamMember = audited(
  "team",
  (_, r) => (r.invited ? `Invited ${r.user.name} (${r.user.email}) as ${roleName(r.user.role)}` : `Gave ${r.user.name} ${roleName(r.user.role)} access`),
  addTeamMember$raw,
);
export const renewInvite = audited("team", ([id]) => `Sent ${nameOf(id)} a new invitation link`, renewInvite$raw);
export const cancelInvite = audited("team", (_, r) => `Withdrew the invitation for ${r.name}`, cancelInvite$raw);
