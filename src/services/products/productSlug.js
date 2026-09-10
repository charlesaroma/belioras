/* Slug And Tag Derivation */
import { COLOR_NAME_TO_TAXONOMY, LEGACY_CATEGORY_TOKENS } from "../../utils/constants";

const LIGATURES = {
  œ: "oe",
  æ: "ae",
  ø: "o",
  ß: "ss",
  đ: "d",
  ð: "d",
  þ: "th",
  ł: "l",
};

/** Slugify a product name for its URL. */
export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[œæøßđðþł]/g, (ch) => LIGATURES[ch] ?? ch)
    // Split accented letters into base + combining mark, then drop the marks.
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function deriveTags(product) {

  const tags = new Set(product.tags ?? []);

  if (product.collectionId) tags.add(`cat:${product.collectionId}`);
  if (product.isNew) tags.add("tag:new");
  if (product.bestseller) tags.add("tag:bestseller");
  if (product.featured) tags.add("tag:featured");

  for (const category of product.categories ?? []) {

    const token = LEGACY_CATEGORY_TOKENS[category];
    if (token) tags.add(token);
    // Keep the raw value too, so a menu leaf whose slug already matches a
    // category (e.g. jumpsuits) resolves without a map entry.
    tags.add(`cat:${category}`);
  }

  for (const color of product.colors ?? []) {

    const swatch = COLOR_NAME_TO_TAXONOMY[color];
    if (swatch) tags.add(`color:${swatch}`);
  }

  return [...tags];
}

export { deriveTags };
