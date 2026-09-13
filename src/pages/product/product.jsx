/* Page: Product */
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { useAsyncData } from "../../hooks/useAsyncData";
import { usePreloadImages } from "../../hooks/usePreloadImages";
import { getProduct, getProductsByCollection } from "../../services/productsApi";
import { colorFromParam, imagesForColor } from "../../utils/productColors";

import ProductPageGallery from "./sections/ProductPageGallery";
import ProductPageHeader from "./sections/ProductPageHeader";
import ProductPageSummary from "./sections/ProductPageSummary";
import ProductPageRelated from "./sections/ProductPageRelated";
import { ProductPageLoading, ProductPageNotFound } from "./sections/ProductPageStates";
import ProductBuyPanel from "./sections/productBuyPanel/ProductBuyPanel";

const RELATED_COUNT = 4;

export default function ProductPage() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
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

  usePreloadImages(
    Object.values(product?.colorImages ?? {})
      .map((photos) => photos[0])
      .filter(Boolean),
  );

  if (loading) return <ProductPageLoading />;
  if (error || !product) return <ProductPageNotFound />;

  const suggestions = (related ?? []).filter((p) => p.id !== product.id).slice(0, RELATED_COUNT);

  // The chosen colour is URL state, not component state: the gallery and the
  // buy panel both follow it, a colourway can be linked to, and replace keeps
  // swatch clicks out of the back button's history.
  const color = colorFromParam(product, params.get("color"));
  const images = imagesForColor(product, color);
  const selectColor = (next) =>
    setParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        nextParams.set("color", next);
        return nextParams;
      },
      { replace: true },
    );

  return (
    <div
      className="mx-auto max-w-7xl px-6 pb-24"
      // Offsets by the header's measured height rather than a guessed value,
      // with a fallback for the first paint before the observer reports.
      style={{ paddingTop: "calc(var(--header-height, 138px) + 2rem)" }}
    >
      <ProductPageHeader product={product} />

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Keyed by colour so the thumbnail strip starts again at the first
            photograph of the new colourway. */}
        <ProductPageGallery
          key={`${product.id}:${color}`}
          images={images}
          name={color ? `${product.name} in ${color}` : product.name}
        />

        <div>
          <ProductPageSummary product={product} />
          {/* Keyed by product id so navigating from one piece to another
              remounts it — colour, size and quantity reset because the
              component is new, not because an effect cleared them. */}
          <ProductBuyPanel
            key={product.id}
            product={product}
            color={color}
            onColorChange={selectColor}
            images={images}
          />
        </div>
      </div>

      <ProductPageRelated products={suggestions} />
    </div>
  );
}
