/* You May Also Like */
import ProductCard from "../../../components/storefront/ProductCard";

export default function ProductPageRelated({ products }) {
  if (!products.length) return null;

  return (
    <section className="mt-24" aria-labelledby="related-heading">
      <h2 id="related-heading" className="mb-8 font-display text-2xl text-espresso">
        You may also like
      </h2>
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
