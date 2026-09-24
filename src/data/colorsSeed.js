import colors from "./colors.json";

/**
 * The shop's colour list, managed under Categories & Colours.
 *
 * Each colour is a boutique name shoppers see (Ebony, Champagne), a swatch,
 * and the filter family they find it under (Ebony → black). Seeded from the
 * two lookup tables the storefront used to hardcode, so every existing
 * product keeps its swatch and its filter.
 */
export default {
  rev: 3,
  items: colors,
};
