/* Staff Activity Log */
import { mockApi } from "@/api/mock";
import { getState, setState } from "../store/contentStore";

/** The log keeps the most recent entries; a backend would page and archive instead. */
const MAX_ENTRIES = 1000;

/** Who is signed in to the dashboard right now, read from the staff session. */
export function currentActor() {
  try {
    const raw = window.localStorage.getItem("belioras:auth:staff");
    const user = raw ? JSON.parse(raw)?.user : null;
    return user ? { id: user.id, name: user.name, email: user.email, role: user.role } : null;
  } catch {
    return null;
  }
}

/**
 * Records one thing a staff member did. `category` groups the log's filter
 * (auth, team, catalogue, inventory, orders, marketing, settings, content);
 * `summary` is the sentence shown. Never throws — a log that breaks the action
 * it describes would be worse than no log.
 */
export function logActivity({ category, summary, actor = currentActor(), email = null }) {
  try {
    const entry = {
      id: `act_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      at: new Date().toISOString(),
      actorId: actor?.id ?? null,
      actorName: actor?.name ?? null,
      actorEmail: actor?.email ?? email,
      actorRole: actor?.role ?? null,
      category,
      summary,
    };
    setState("activity", (state) => ({ ...state, items: [entry, ...state.items].slice(0, MAX_ENTRIES) }));
  } catch {
    /* logging must never break the action */
  }
}

/** Newest first. */
export function getActivity() {
  return mockApi(() => getState("activity").items.map((e) => ({ ...e })), 0);
}

/** When each person last signed in, keyed by user id. */
export function lastSignIns() {
  return mockApi(() => {
    const map = {};
    for (const e of getState("activity").items) {
      if (e.category === "auth" && e.summary === "Signed in" && e.actorId && !map[e.actorId]) map[e.actorId] = e.at;
    }
    return map;
  }, 0);
}
