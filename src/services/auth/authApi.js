/* Accounts API */

// Split by concern: the store accessors, the session doors, profile and
// credential edits, and role changes. updateUserRole carries the
// privilege-escalation guard and is easier to audit on its own. This file
// stays the public entry point.
export { login, register, logout, requestPasswordReset } from "./authSession";
export { getUsers, updateProfile, verifyPassword, changePassword } from "./authProfile";
export { updateUserRole } from "./authRoles";
