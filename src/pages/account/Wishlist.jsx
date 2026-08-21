import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";

import ProductCard from "../../components/storefront/ProductCard";
import { useWishlist } from "../../context/WishlistContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { getProducts } from "../../services/productsApi";

export default function Wishlist() {
  const { ids } = useWishlist();
  const { data: products, loading } = useAsyncData(getProducts, []);

  const items = loading
    ? []
    : ids
        .map((id) => products?.find((p) => p.id === id))
        .filter(Boolean);

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-8 xl:px-16 2xl:px-24 py-12 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-medium tracking-wide">Wishlist</h1>
        <p className="mt-1 text-sm text-espresso-soft">
          {ids.length ? `${items.length} saved item${items.length === 1 ? "" : "s"}` : "Items you save for later"}
        </p>
      </div>

      {loading ? (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="animate-pulse" aria-hidden="true">
              <div className="aspect-[3/4] rounded-lg bg-brown-50" />
              <div className="mt-3 h-3 w-2/3 rounded bg-brown-50" />
              <div className="mt-2 h-3 w-1/3 rounded bg-brown-50" />
            </li>
          ))}
        </ul>
      ) : !items.length ? (
        <div className="rounded-2xl border border-umber-50 bg-white px-6 py-16 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-gold-500/15 text-gold-700">
            <Heart className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-5 font-display text-xl font-medium tracking-wide">Nothing saved yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-espresso-soft">
            Tap the heart on any product to keep it here for later. We will keep it in mind.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 text-sm font-medium text-ivory-50 transition-colors duration-200 hover:bg-umber-500 active:scale-[0.98]"
          >
            <ShoppingBag className="size-4" aria-hidden="true" />
            Discover the collection
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
          {items.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}