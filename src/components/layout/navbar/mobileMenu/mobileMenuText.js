/* Mobile Menu Text */

// Nav labels are stored uppercase for the header; the drawer's display serif
// wants sentence case.
export function titleCase(label) {
  return label.toLowerCase().replace(/(^|\s|&\s)([a-z])/g, (m) => m.toUpperCase());
}
