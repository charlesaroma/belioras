/* Navbar Menu Items */

/** A top-level item opens the mega menu only when it has links to show. */
export function hasMegaMenu(item) {
  return (item?.sections ?? []).some((section) => (section.items ?? []).length > 0);
}

/**
 * The shipped items carry a translation key, so the language selector still
 * translates them. An item the admin added, or renamed, shows as written.
 */
export function menuLabel(item, t) {
  return item.i18nKey ? t(item.i18nKey, item.label) : item.label;
}
