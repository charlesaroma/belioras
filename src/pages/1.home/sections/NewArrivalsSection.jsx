import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import ProductGrid from "../../../components/storefront/ProductGrid";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getNewArrivals } from "../../../services/productsApi";

export default function NewArrivalsSection() {
  const { data: products = [], loading } = useAsyncData(getNewArrivals, []);

  return (
    <section
      aria-labelledby="new-arrivals-title"
      className="container-main py-section-mobile md:py-section-desktop"
    >
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow">New Arrivals</p>
          <h2
            id="new-arrivals-title"
            className="mt-3 font-display text-3xl tracking-wide text-espresso md:text-4xl"
          >
            What's new at the Maison
          </h2>
        </div>
        <Link
          to="/whats-new"
          className="hidden items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.12em] text-gold-700 transition hover:text-gold-800 sm:inline-flex"
        >
          View all
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <ProductGrid products={products} loading={loading} columns={4} />
    </section>
  );
}