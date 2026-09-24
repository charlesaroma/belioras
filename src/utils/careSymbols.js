/**
 * Care instructions as a fixed vocabulary, so the product page can show the
 * symbol a shopper knows from a garment label (ISO 3758 style) and the admin
 * picks from a list instead of typing variations of the same sentence.
 *
 * A product's `care` holds these ids; any other string in it is shown as a
 * plain note under the symbols.
 */
export const CARE_GROUPS = [
  { id: "wash", label: "Washing" },
  { id: "dry", label: "Drying" },
  { id: "iron", label: "Ironing" },
  { id: "clean", label: "Dry cleaning" },
  { id: "store", label: "Storing and handling" },
  { id: "hair", label: "Hair" },
];

export const CARE_SYMBOLS = [
  { id: "hand-wash", group: "wash", label: "Hand wash cold", icon: "hand-wash" },
  { id: "machine-30", group: "wash", label: "Machine wash at 30°", icon: "wash-30" },
  { id: "no-wash", group: "wash", label: "Do not wash", icon: "no-wash" },
  { id: "no-bleach", group: "wash", label: "Do not bleach", icon: "no-bleach" },
  { id: "hang-dry", group: "dry", label: "Hang to dry", icon: "hang-dry" },
  { id: "dry-flat", group: "dry", label: "Dry flat", icon: "dry-flat" },
  { id: "air-dry", group: "dry", label: "Air dry", icon: "hang-dry" },
  { id: "no-tumble", group: "dry", label: "Do not tumble dry", icon: "no-tumble" },
  { id: "iron-low", group: "iron", label: "Low iron, on the reverse", icon: "iron-1" },
  { id: "iron-medium", group: "iron", label: "Medium iron", icon: "iron-2" },
  { id: "iron-high", group: "iron", label: "Hot iron", icon: "iron-3" },
  { id: "steam", group: "iron", label: "Steam, do not iron", icon: "steam" },
  { id: "no-iron", group: "iron", label: "Do not iron", icon: "no-iron" },
  { id: "dry-clean", group: "clean", label: "Dry clean only", icon: "dry-clean" },
  { id: "no-dry-clean", group: "clean", label: "Do not dry clean", icon: "no-dry-clean" },
  { id: "padded-hanger", group: "store", label: "Store on a padded hanger", icon: "hanger" },
  { id: "dust-bag", group: "store", label: "Store in its dust bag", icon: "bag" },
  { id: "keep-dry", group: "store", label: "Keep away from damp", icon: "drop-off" },
  { id: "wipe-clean", group: "store", label: "Wipe with a soft dry cloth", icon: "cloth" },
  { id: "polish", group: "store", label: "Polish with a soft cloth", icon: "sparkle" },
  { id: "no-perfume", group: "store", label: "Keep away from perfume", icon: "no-spray" },
  { id: "sulfate-free", group: "hair", label: "Wash with sulphate-free shampoo", icon: "drop" },
  { id: "detangle", group: "hair", label: "Detangle gently from the ends", icon: "comb" },
  { id: "wig-stand", group: "hair", label: "Store on a wig stand", icon: "stand" },
  { id: "low-heat-styling", group: "hair", label: "Style on low heat only", icon: "iron-1" },
];

const BY_ID = new Map(CARE_SYMBOLS.map((s) => [s.id, s]));

export function careSymbol(id) {
  return BY_ID.get(id) ?? null;
}

/** A product's care, split into known symbols and free-text notes. */
export function splitCare(care = []) {
  return {
    symbols: care.map(careSymbol).filter(Boolean),
    notes: care.filter((c) => !BY_ID.has(c)),
  };
}
