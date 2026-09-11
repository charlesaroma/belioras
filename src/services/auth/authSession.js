/* Sign In Register Sign Out */
import { ApiError, mockApi } from "@/api/mock";
import { setState } from "../contentStore";
import { isAdminRole } from "../../utils/roles";
import { createToken, findByEmail, publicUser, userItems } from "./authStore";

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
