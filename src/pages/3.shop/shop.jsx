import { useAsyncData } from "../../hooks/useAsyncData";
import { getProducts } from "../../services/productsApi";

import CatalogView from "./sections/CatalogView";

/** /shop — the unfiltered catalog. Category routes use CatalogPage. */
export default function ShopPage() {
  const { data: products, loading, error } = useAsyncData(getProducts, []);

  return <CatalogView products={products} loading={loading} error={error} />;
}
