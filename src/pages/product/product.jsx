/* Page: Product */
import { useEffect } from "react";

import { useAsyncData } from "../../hooks/useAsyncData";
import { getProduct, getProductsByCollection } from "../../services/productsApi";

import ProductPageGallery from "./sections/ProductPageGallery";
import ProductPageHeader from "./sections/ProductPageHeader";
import ProductPageSummary from "./sections/ProductPageSummary";
import ProductPageRelated from "./sections/ProductPageRelated";
import { ProductPageLoading, ProductPageNotFound } from "./sections/ProductPageStates";
import ProductBuyPanel from "./sections/productBuyPanel/ProductBuyPanel";
import { useParams } from "react-router-dom";

const RELATED_COUNT = 4;

export default function ProductPage() {
  const { slug } = useParams();
  const { data: product, loading, error } = useAsyncData(() => getProduct(slug), [slug]);

  const { data: related } = useAsyncData(
    () =>
      product?.collectionId ? getProductsByCollection(product.collectionId) : Promise.resolve([]),
    [product?.collectionId],
  );

  // Syncing the document title is a genuine external-system effect. The
  // variant state this used to reset alongside it lives in a keyed child.
  useEffect(() => {
    if (product) document.title = `${product.name} | Belioras`;
  }, [product]);

  if (loading) return <ProductPageLoading />;
  if (error || !product) return <ProductPageNotFound />;

  const suggestions = (related ?? []).filter((p) => p.id !== product.id).slice(0, RELATED_COUNT);

  return (
    <div
      className="mx-auto max-w-7xl px-6 pb-24"
      // Offsets by the header's measured height rather than a guessed value,
      // with a fallback for the first paint before the observer reports.
      style={{ paddingTop: "calc(var(--header-height, 138px) + 2rem)" }}
    >
      <ProductPageHeader product={product} />

      <div className="grid gap-12 lg:grid-cols-2">
        <ProductPageGallery images={product.images} name={product.name} />

        <div>
          <ProductPageSummary product={product} />
          {/* Keyed by product id so navigating from one piece to another
              remounts it — colour, size and quantity reset because the
              component is new, not because an effect cleared them. */}
          <ProductBuyPanel key={product.id} product={product} />
        </div>
      </div>

      <ProductPageRelated products={suggestions} />
    </div>
  );
}
