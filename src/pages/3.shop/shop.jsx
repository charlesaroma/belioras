/* Page: Shop - shop */
import { useSearchParams } from "react-router-dom";

import { useAsyncData } from "../../hooks/useAsyncData";
import { getProducts } from "../../services/productsApi";

import CatalogView from "./sections/CatalogView";

export default function ShopPage() {
  const { data: products, loading, error } = useAsyncData(getProducts, []);
  const [params] = useSearchParams();

  const query = params.get("q")?.trim();

  return (
    <CatalogView
      products={products}
      loading={loading}
      error={error}
      // Landing here from search with the heading still reading "All
      // Collections" gave no sign the results were narrowed.
      header={query ? { title: `“${query}”` } : {}}
    />
  );
}
