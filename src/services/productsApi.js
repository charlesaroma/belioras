/* Catalogue API */

// Split by concern rather than one 309-line module: reads, writes, the store
// accessors both share, and the pure slug/tag derivation. This file stays the
// public entry point, so nothing that imports the catalogue had to change.
export {
  getProducts,
  getProduct,
  getProductsByCollection,
  getNewArrivals,
  searchProducts,
  getFeaturedProducts,
  getBestSellers,
} from "./products/productCatalog";

export {
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
} from "./products/productWrites";

export { slugify } from "./products/productSlug";
