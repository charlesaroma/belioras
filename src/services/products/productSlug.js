/* Slug And Tag Derivation */
import { LEGACY_CATEGORY_TOKENS } from "../../utils/constants";

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

// Colour families come from the managed colour list, resolved by the caller.
function deriveTags(product, colorFamilies = []) {

  const tags = new Set(product.tags ?? []);

  if (product.collectionId) tags.add(`cat:${product.collectionId}`);
  if (product.type) tags.add(`type:${product.type}`);
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

  for (const family of colorFamilies) tags.add(`color:${family}`);

  return [...tags];
}

export { deriveTags };
