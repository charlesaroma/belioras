import { mockApi } from "@/api/mock";
import { getState, setState } from "./contentStore";

/**
 * Store settings.
 *
 * Read through the content store rather than straight from the seed, so what
 * the dashboard saves is what the storefront reads. It previously returned a
 * deep clone of the JSON fixture, which meant the settings page could not
 * change anything even in principle.
 */

export function getSettings() {
  return mockApi(() => structuredClone(getState("settings")), 0);
}

/**
 * Merge a patch into settings.
 *
 * Section-wise rather than a whole-document replace, so two people editing
 * different panels do not overwrite each other's work, and so a patch that
 * omits a section leaves it intact.
 */

export function updateSettings(patch) {
  return mockApi(() => {

    const next = setState("settings", (state) => {

      const merged = { ...state };
      for (const [key, value] of Object.entries(patch)) {
        merged[key] =
          value && typeof value === "object" && !Array.isArray(value)
            ? { ...state[key], ...value }
            : value;
      }
      return merged;
    });
    return structuredClone(next);
  });
}
