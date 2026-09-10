/**
 * Body and garment measurement helpers.
 *
 * The size guides used to carry both units as hand-written pairs, which is how
 * the hair guide came to list 12 inches as 30 cm (it is 30.48). Centimetres are
 * the stored unit everywhere; inches are derived, so the two can never drift.
 */

const CM_PER_INCH = 2.54;

export const UNITS = ["cm", "in"];

/** Centimetres to inches. */
export function cmToIn(cm) {
  return cm / CM_PER_INCH;
}

/**
 * One measurement in the requested unit.
 *
 * Body measurements read as whole centimetres — nobody measures a bust to the
 * millimetre with a tape. Foot length passes `decimals: 1`, because half a
 * centimetre there is the difference between two shoe sizes: rounding 22.5 to
 * 23 quietly moved EU 36 onto EU 37's length.
 */
export function formatMeasurement(cm, unit, { decimals = 0 } = {}) {
  if (cm == null) return "—";
  if (unit === "in") return `${round(cmToIn(cm), 1)}"`;
  return `${round(cm, decimals)}`;
}

/**
 * A range, as the charts show it: "86–90".
 *
 * Takes a `[min, max]` pair or a single number. The unit is written once in
 * the column header rather than on every cell, so this returns bare values —
 * except inches, where the mark disambiguates a column of small numbers.
 */
export function formatRange(value, unit) {
  if (Array.isArray(value)) {
    const [min, max] = value;
    if (unit === "in") return `${round(cmToIn(min), 1)}–${round(cmToIn(max), 1)}"`;
    return `${Math.round(min)}–${Math.round(max)}`;
  }
  return formatMeasurement(value, unit);
}

/** Inches as stored for hair, where the trade quotes whole inches. */
export function formatInches(inches, unit) {
  if (inches == null) return "—";
  return unit === "cm" ? `${Math.round(inches * CM_PER_INCH)}` : `${inches}"`;
}

/** Label for a unit column header. */
export function unitLabel(unit) {
  return unit === "in" ? "in" : "cm";
}

/** Trims float noise without dragging in a formatting library. */
function round(value, places) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}
