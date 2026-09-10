/* Catalogue Store Access */
import { getState } from "../contentStore";
import { deriveTags } from "./productSlug";

function catalogItems() {
  return getState("products").items;
}

function normalize(product) {
  return { ...product, images: product.images ?? [], tags: deriveTags(product) };
}

export { catalogItems, normalize };
