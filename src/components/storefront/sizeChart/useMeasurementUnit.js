import { useState } from "react";

/**
 * The chart's cm/inch preference.
 *
 * Deliberately per-session rather than persisted: a shopper who switches to
 * inches on one product almost always wants it on the next, but this is a
 * reference table rather than a setting, and the storefront already has a
 * settings surface for anything that should outlive a visit.
 */

export function useMeasurementUnit(initial = "cm") {
  const [unit, setUnit] = useState(initial);
  return { unit, setUnit };
}
