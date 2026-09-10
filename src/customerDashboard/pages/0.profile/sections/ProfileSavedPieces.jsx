import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

import EmptyState from "../../../../components/ui/EmptyState";

/** "What did I save" — a strip of thumbnails through to the full wishlist. */
export default function SavedPieces({ pieces, total }) {
  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-xl tracking-wide text-espresso">Saved pieces</h2>
        {total > 0 && (
          <Link to="/account/wishlist" className="eyebrow hover:opacity-70">
            All {total}
          </Link>
        )}
      </div>

      {pieces.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Nothing saved yet"
          description="Tap the heart on any piece to keep it here."
          action={{ label: "Discover the collection", to: "/shop" }}
        />
      ) : (
        <ul className="grid grid-cols-4 gap-2">
          {pieces.map((product) => (
            <li key={product.id}>
              <Link
                to={`/product/${product.slug}`}
                className="block border border-umber-50 transition-opacity hover:opacity-80"
              >
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
