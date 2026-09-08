import users from "./users.json";

/**
 * Accounts, wrapped as a revisioned collection.
 *
 * Goes through the content store so a profile edit, a password change or an
 * admin's role change survives a reload. Registrations previously pushed onto
 * a module-level array and vanished with the next refresh.
 *
 * Bump `rev` when the user shape changes.
 */
export default {
  rev: 1,
  items: users,
};
