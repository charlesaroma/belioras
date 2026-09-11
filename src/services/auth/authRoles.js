/* Role Changes */
import { ApiError, mockApi } from "@/api/mock";
import { setState } from "../contentStore";
import { can } from "../../utils/roles";
import { publicUser, userItems } from "./authStore";

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
