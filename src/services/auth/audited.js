import { logActivity } from "./activityApi";

/**
 * Wraps a service write so its success is recorded in the activity log:
 * `describe(args, result)` returns the sentence. The write itself is untouched.
 */
export function audited(category, describe, fn) {
  return (...args) =>
    fn(...args).then((result) => {
      try {
        logActivity({ category, summary: describe(args, result) });
      } catch {
        /* never let the log break the write */
      }
      return result;
    });
}
