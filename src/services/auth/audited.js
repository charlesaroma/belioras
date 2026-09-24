import { ApiError } from "@/api/mock";
import { accessFor } from "../../utils/roles";
import { SECTIONS } from "../../utils/permissions";
import { currentActor, logActivity } from "./activityApi";

/**
 * Wraps a dashboard write. Before it runs, the signed-in person must have
 * "edit" on its section — the same check a backend makes, so a view-only role
 * cannot change anything whatever the screen offers. After it succeeds, the
 * change is written to the activity log: `describe(args, result)` returns the
 * sentence. `section` may be a function of the arguments.
 */
export function audited(section, describe, fn) {
  return (...args) => {
    const where = typeof section === "function" ? section(...args) : section;
    const actor = currentActor();
    if (!actor || accessFor(actor.role, where) !== "edit") {
      const label = SECTIONS.find((s) => s.id === where)?.label ?? where;
      return Promise.reject(new ApiError(`Your role can view ${label} but not change it. Ask an administrator for edit access.`, 403));
    }
    return fn(...args).then((result) => {
      try {
        logActivity({ section: where, summary: describe(args, result), actor });
      } catch {
        /* never let the log break the write */
      }
      return result;
    });
  };
}
