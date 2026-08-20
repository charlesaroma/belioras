import usersSeed from "../data/users.json";

import { ApiError, mockApi } from "./apiClient";

const users = [...usersSeed];

function publicUser({ id, name, email, role }) {
  return { id, name, email, role };
}

function createToken(user) {
  return `tok_${user.id}_${Date.now().toString(36)}`;
}

export function login({ email, password } = {}) {
  return mockApi(() => {
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === String(email ?? "").trim().toLowerCase() &&
        u.password === password
    );
    if (!user) throw new ApiError("Invalid email or password.", 401);
    return { token: createToken(user), user: publicUser(user) };
  });
}

export function register({ name, email, password } = {}) {
  return mockApi(() => {
    const normalized = String(email ?? "").trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === normalized)) {
      throw new ApiError("An account with this email already exists.", 409);
    }
    const user = {
      id: `u${users.length + 100}`,
      name,
      email: normalized,
      password,
      role: "customer",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    users.push(user);
    return { token: createToken(user), user: publicUser(user) };
  });
}

export function logout() {
  return mockApi(() => null, 120);
}