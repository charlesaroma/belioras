import { useMemo, useState } from "react";
import { Heart, PackageX } from "lucide-react";

import EmptyState from "../../components/ui/EmptyState";
import ProductCard from "../../components/storefront/ProductCard";
import GridViewSwitcher from "../../components/storefront/GridViewSwitcher";
import { useWishlist } from "../../context/WishlistContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { getProducts } from "../../services/productsApi";
import {
  COLUMN_CLASSES,
  COLUMN_GAP_CLASSES,
  DEFAULT_COLUMNS,
} from "../../utils/gridColumns";
import { cn } from "../../utils/cn";

/**
 * Saved pieces.
 *
 * Three things were wrong here. The page hand-rolled its own padding with no
 * header offset, so its <h1> rendered at y=48 while the fixed header ended at
 * 133 — the title was entirely behind the navbar, which is why the page read
 * as having none. It had no density control, unlike every other grid in the
 * shop. And ids for pieces that no longer exist were dropped silently by a
 * .filter(Boolean), so a wishlist could quietly shrink with no explanation.
 *
 * It now renders inside AccountLayout, which owns the offset, matches the
 * catalogue's toolbar and grid, and says so when something has gone.
 */
export default function Wishlist() {
  const { ids, remove } = useWishlist();
  const { data: products, loading } = useAsyncData(getProducts, []);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);

  const { items, missing } = useMemo(() => {
    if (!products) return { items: [], missing: [] };
    const found = [];
    const gone = [];
    for (const id of ids) {
      const product = products.find((p) => p.id === id);
      if (product) found.push(product);
      else gone.push(id);
    }
    return { items: found, missing: gone };
  }, [ids, products]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-umber-50 pb-4">
        <h2 className="font-display text-2xl tracking-wide text-espresso">Saved pieces</h2>
        <div className="flex items-center gap-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-espresso-soft">
            {loading ? "…" : `${items.length} ${items.length === 1 ? "piece" : "pieces"}`}
          </p>
          {items.length > 0 && (
            <GridViewSwitcher columns={columns} setColumns={setColumns} />
          )}
        </div>
      </div>

      {loading ? (
        <ul
          className={cn("grid pt-8", COLUMN_CLASSES[columns], COLUMN_GAP_CLASSES[columns])}
          aria-hidden="true"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i}>
              <div className="skeleton aspect-[3/4] w-full" />
              <div className="skeleton mt-3 h-3 w-2/3" />
              <div className="skeleton mt-2 h-3 w-1/3" />
            </li>
          ))}
        </ul>
      ) : items.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={Heart}
          title="Nothing saved yet"
          description="Tap the heart on any piece to keep it here. We will hold it in mind."
          action={{ label: "Discover the collection", to: "/shop" }}
        />
      ) : (
        <>
          <ul className={cn("grid pt-8", COLUMN_CLASSES[columns], COLUMN_GAP_CLASSES[columns])}>
            {items.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>

          {/* Previously these just disappeared. Saying so lets the shopper
              clear them deliberately rather than wonder what happened. */}
          {missing.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-umber-50 pt-5">
              <PackageX
                className="size-4 shrink-0 text-espresso-soft"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <p className="flex-1 text-[13px] text-espresso-soft">
                {missing.length} saved {missing.length === 1 ? "piece is" : "pieces are"} no longer
                available.
              </p>
              <button
                type="button"
                onClick={() => missing.forEach(remove)}
                className="text-[11px] uppercase tracking-[0.14em] text-gold-700 underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                Remove them
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
