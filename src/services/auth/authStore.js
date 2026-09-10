/* Account Store Access */
import { getState } from "../contentStore";

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

export { userItems, publicUser, createToken, findByEmail };
