/* Role Changes */
import { ApiError, mockApi } from "@/api/mock";
import { setState } from "../store/contentStore";
import { can } from "../../utils/roles";
import { findByEmail, publicUser, userItems } from "./authStore";
import { audited } from "./audited";

function updateUserRole$raw(id, role, actor) {
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

/**
 * Adds someone to the team.
 *
 * A new person gets an account made here, with the temporary password the
 * administrator chose, flagged so a real backend can require a change at
 * first sign-in (and send an invitation instead of showing a password). An
 * email that already has a customer account is simply given access — nobody
 * has to register first.
 */
function addTeamMember$raw({ name, email, role = "staff", password } = {}, actor) {
  return mockApi(() => {
    if (!can(actor?.role, "team")) {
      throw new ApiError("Only an administrator can add team members.", 403);
    }
    if (!["staff", "super-admin"].includes(role)) throw new ApiError("Choose Staff or Administrator.", 422);

    const address = String(email ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) throw new ApiError("Enter a valid email address.", 422);

    const existing = findByEmail(address);
    if (existing) {
      if (existing.role !== "customer") throw new ApiError(`${existing.name} is already on the team.`, 409);
      const updated = { ...existing, role };
      setState("users", (state) => ({ ...state, items: state.items.map((u) => (u.id === existing.id ? updated : u)) }));
      return { user: publicUser(updated), created: false };
    }

    if (!String(name ?? "").trim()) throw new ApiError("Give them a name.", 422);
    if (String(password ?? "").length < 8) throw new ApiError("The temporary password needs at least 8 characters.", 422);

    const highest = userItems().reduce((max, u) => Math.max(max, Number(String(u.id).replace(/\D/g, "")) || 0), 0);
    const user = {
      id: `u${highest + 1}`,
      name: String(name).trim(),
      email: address,
      password,
      role,
      mustChangePassword: true,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setState("users", (state) => ({ ...state, items: [...state.items, user] }));
    return { user: publicUser(user), created: true };
  });
}

/* Recorded in the staff activity log. */
export const addTeamMember = audited("team", (_, r) => r.created ? `Added ${r.user.name} to the team as ${r.user.role}` : `Gave ${r.user.name} ${r.user.role} access`, addTeamMember$raw);
export const updateUserRole = audited("team", ([, role], r) => `Changed ${r.name}'s role to ${role}`, updateUserRole$raw);
