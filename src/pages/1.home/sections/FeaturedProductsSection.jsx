import ProductGrid from "../../../components/storefront/ProductGrid";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getFeaturedProducts } from "../../../services/productsApi";

export default function FeaturedProductsSection() {
  const { data: products = [], loading } = useAsyncData(getFeaturedProducts, []);

  return (
    <section
      aria-labelledby="bestsellers-title"
      className="bg-ivory-100 py-section-mobile md:py-section-desktop"
    >
      <div className="container-main">
        <div className="mb-10 text-center">
          <p className="eyebrow">Bestsellers</p>
          <h2
            id="bestsellers-title"
            className="mt-3 font-display text-3xl tracking-wide text-espresso md:text-4xl"
          >
            Most-loved pieces
          </h2>
        </div>

        <ProductGrid products={products} loading={loading} columns={4} />
      </div>
    </section>
  );
}