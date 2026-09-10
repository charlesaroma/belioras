import { ApiError, mockApi } from "./apiClient";
import { getState, setState } from "./contentStore";
import { can, isAdminRole } from "../utils/roles";

/**
 * Accounts.
 *
 * Still a mock: passwords are compared in plain text against a JSON fixture
 * and the session lives in localStorage. That is a stub standing in for the
 * backend `identity` module, and it must not survive to production — see the
 * note in the phase plan. What changed is persistence: users go through the
 * content store, so a registration, a renamed profile or a changed password
 * is still there after a reload, where previously all three lived in a
 * module-level array and vanished with the next refresh.
 */

function userItems() {
  return getState("users").items;
}

/**
 * The fields safe to put in a session.
 *
 * `password` is the one field that must never leave. `createdAt` used to be
 * stripped too, which is why the account page hardcoded "Member since 2026"
 * rather than showing the real date.
 */

function publicUser(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  void password;
  return rest;
}

function createToken(user) {
  return `tok_${user.id}_${Date.now().toString(36)}`;
}

function findByEmail(email) {

  const normalized = String(email ?? "").trim().toLowerCase();
  return userItems().find((u) => u.email.toLowerCase() === normalized);
}

/**
 * Sign in, optionally restricted to one realm.
 *
 * `realm` is "customer" or "staff". A door that passes it will not sign in an
 * account belonging to the other side: staff cannot use /login and shoppers
 * cannot use /atelier. The two realms stay separate at all times.
 *
 * The rejection is deliberately the same 401 with the same wording as a wrong
 * password. Saying "this is a staff account, use the other door" would turn
 * the public login form into a way of discovering which addresses belong to
 * staff, which is the first step of a targeted attack on the accounts that
 * matter most. A staff member who mistypes the door gets no hint — they are
 * expected to know their own entrance, and it costs an attacker nothing less.
 */

export function login({ email, password, realm } = {}) {
  return mockApi(() => {

    const user = findByEmail(email);
    if (!user || user.password !== password) {
      throw new ApiError("Invalid email or password.", 401);
    }

    if (realm) {

      const isStaff = isAdminRole(user.role);

      const wrongDoor = realm === "staff" ? !isStaff : isStaff;
      if (wrongDoor) throw new ApiError("Invalid email or password.", 401);
    }

    return { token: createToken(user), user: publicUser(user) };
  });
}

export function register({ name, email, password } = {}) {
  return mockApi(() => {
    if (findByEmail(email)) {
      throw new ApiError("An account with this email already exists.", 409);
    }

    const items = userItems();

    const highest = items.reduce((max, u) => {

      const n = Number(String(u.id).replace(/\D/g, "")) || 0;
      return n > max ? n : max;
    }, 0);

    const user = {
      id: `u${highest + 1}`,
      name,
      email: String(email).trim().toLowerCase(),
      password,
      role: "customer",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setState("users", (state) => ({ ...state, items: [...state.items, user] }));
    return { token: createToken(user), user: publicUser(user) };
  });
}

export function logout() {
  return mockApi(() => null, 120);
}

/** Every account, for the admin users page. Passwords are stripped. */
export function getUsers() {
  return mockApi(() => userItems().map(publicUser));
}

/**
 * Update a profile.
 *
 * No mutation of any kind existed before this — a grep for updateProfile or
 * changePassword across the whole repo returned nothing, so a customer had no
 * way to correct their own name.
 *
 * `role` is deliberately not accepted here: a customer editing their own
 * profile must not be able to promote themselves. Role changes go through
 * updateUserRole, which is an admin action.
 */

export function updateProfile(id, patch) {
  return mockApi(() => {

    const user = userItems().find((u) => u.id === id);
    if (!user) throw new ApiError("Account not found.", 404);

    if (patch.email) {

      const taken = findByEmail(patch.email);
      if (taken && taken.id !== id) {
        throw new ApiError("That email is already in use.", 409);
      }
    }

    const { role, password, id: _ignored, ...safe } = patch;
    void role;
    void password;
    void _ignored;

    const updated = {
      ...user,
      ...safe,
      email: patch.email ? String(patch.email).trim().toLowerCase() : user.email,
    };

    setState("users", (state) => ({
      ...state,
      items: state.items.map((u) => (u.id === id ? updated : u)),
    }));
    return publicUser(updated);
  });
}

/**
 * Confirm someone is who they say before a sensitive change.
 *
 * Separate from changePassword so the caller does not have to "change" a
 * password to itself just to check it — that performed a pointless write and
 * read as a trick rather than an intention.
 */

export function verifyPassword(id, password) {
  return mockApi(() => {

    const user = userItems().find((u) => u.id === id);
    if (!user || user.password !== password) {
      throw new ApiError("That is not your current password.", 401);
    }
    return true;
  });
}

export function changePassword(id, { currentPassword, newPassword } = {}) {
  return mockApi(() => {

    const user = userItems().find((u) => u.id === id);
    if (!user) throw new ApiError("Account not found.", 404);
    // Requires the current password, so a borrowed unlocked browser cannot be
    // used to lock the real owner out of their own account.
    if (user.password !== currentPassword) {
      throw new ApiError("That is not your current password.", 401);
    }
    if (!newPassword || newPassword.length < 6) {
      throw new ApiError("Choose a password of at least 6 characters.", 422);
    }

    setState("users", (state) => ({
      ...state,
      items: state.items.map((u) => (u.id === id ? { ...u, password: newPassword } : u)),
    }));
    return true;
  });
}

/**
 * Change an account's role. Administrator action.
 *
 * `actor` is who is asking. Without it this trusted any caller, so a member of
 * staff could reach the users page and promote a colleague — or an account
 * they controlled — to super-admin, escalating past their own permissions.
 *
 * The check is written here rather than only in the UI so the contract is
 * explicit and the backend enforces the same rule for real. While auth is
 * client-side this is a statement of intent, not a wall.
 */

export function updateUserRole(id, role, actor) {
  return mockApi(() => {
    if (!can(actor?.role, "team")) {
      throw new ApiError("Only an administrator can change roles.", 403);
    }

    if (!["super-admin", "staff", "customer"].includes(role)) {
      throw new ApiError(`Unknown role: ${role}`, 422);
    }

    if (actor?.id === id) {
      throw new ApiError("You cannot change your own role.", 403);
    }

    const user = userItems().find((u) => u.id === id);
    if (!user) throw new ApiError("Account not found.", 404);

    // Refuse to remove the last administrator — an unadministrable store is
    // not a state the UI should be able to reach.
    if (user.role === "super-admin" && role !== "super-admin") {

      const admins = userItems().filter((u) => u.role === "super-admin");
      if (admins.length <= 1) {
        throw new ApiError("This is the only administrator; promote another first.", 409);
      }
    }

    const updated = { ...user, role };
    setState("users", (state) => ({
      ...state,
      items: state.items.map((u) => (u.id === id ? updated : u)),
    }));
    return publicUser(updated);
  });
}
