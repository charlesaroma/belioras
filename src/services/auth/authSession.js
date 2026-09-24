/* Sign In Register Sign Out */
import { ApiError, mockApi } from "@/api/mock";
import { setState } from "../store/contentStore";
import { isAdminRole } from "../../utils/roles";
import { createToken, findByEmail, publicUser, userItems } from "./authStore";
import { logActivity } from "./activityApi";

export function login({ email, password, realm } = {}) {
  return mockApi(() => {

    const user = findByEmail(email);
    if (user?.status === "invited") {
      throw new ApiError("Finish setting up your account from the invitation link first.", 401);
    }
    if (!user || user.password !== password) {
      // Failed attempts at the staff door are what an IT person looks for first.
      if (realm === "staff") logActivity({ section: "auth", summary: "Failed sign-in", actor: null, email: String(email ?? "").trim().toLowerCase(), outcome: "failed" });
      throw new ApiError("Invalid email or password.", 401);
    }

    if (realm) {

      const isStaff = isAdminRole(user.role);

      const wrongDoor = realm === "staff" ? !isStaff : isStaff;
      if (wrongDoor) {
        if (realm === "staff") logActivity({ section: "auth", summary: "Failed sign-in (not on the team)", actor: null, email: user.email, outcome: "failed" });
        throw new ApiError("Invalid email or password.", 401);
      }
      if (realm === "staff") logActivity({ section: "auth", summary: "Signed in", actor: publicUser(user) });
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

/**
 * Always resolves, whether or not the address has an account. Reporting "no
 * such user" here would turn the reset form into the customer-list oracle the
 * signup form is already careful not to be.
 */
export function requestPasswordReset() {
  return mockApi(() => null, 600);
}
