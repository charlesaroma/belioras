/* Catalogue Store Access */
import { getState } from "../../store/contentStore";
import { expandColorways } from "./productColorways";
import { deriveTags } from "./productSlug";

function catalogItems() {
  return getState("products").items;
}

function normalize(product) {
  const expanded = expandColorways(product);
  return { ...product, ...expanded, tags: deriveTags(product, expanded.colorFamilies) };
}

export { catalogItems, normalize };
