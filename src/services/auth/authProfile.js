/* Profile And Credentials */
import { ApiError, mockApi } from "../apiClient";
import { setState } from "../contentStore";
import { findByEmail, publicUser, userItems } from "./authStore";

/** Every account, for the admin users page. Passwords are stripped. */
export function getUsers() {
  return mockApi(() => userItems().map(publicUser));
}

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
