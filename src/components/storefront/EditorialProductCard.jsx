import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

import { useCurrency } from "../../context/CurrencyContext";
import { useWishlist } from "../../context/WishlistContext";
import { cn } from "../../utils/cn";

/**
 * Lightweight product card for the homepage rails.
 *
 * Deliberately quieter than the catalog's ProductCard: image, name, price, and
 * nothing else. No rating stars, colour dots or quick-add.
 *
 * The two coexist on purpose. The design review recorded Belioras liking
 * colours, pricing and reviews on the *grid* cards, so those stay where a
 * shopper is comparing options. On the homepage the rails are an invitation
 * rather than a comparison, and the extra detail only competes with the
 * photography.
 *
 * Matches the prototype's card exactly, including the second image
 * cross-fading in on hover.
 */
export default function EditorialProductCard({ product }) {
  const { format } = useCurrency();
  const { has, toggle } = useWishlist();

  const saved = has(product.id);
  const onSale = product.originalPrice && product.originalPrice > product.price;

  return (
    <article className="group relative">
      <Link
        to={`/product/${product.slug}`}
        className="block overflow-hidden bg-ivory-200"
      >
        <div className="relative aspect-[3/4] w-full">
          <img
            src={product.images?.[0]}
            alt={product.name}
            loading="lazy"
            className={cn(
              "h-full w-full object-cover transition-all duration-700",
              // Only fade the first image out when there is a second to reveal.
              product.images?.[1]
                ? "group-hover:scale-[1.04] group-hover:opacity-0"
                : "group-hover:scale-[1.04]",
            )}
          />
          {product.images?.[1] && (
            <img
              src={product.images[1]}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}
        </div>

        {onSale ? (
          <span className="absolute left-3 top-3 bg-espresso px-2 py-1 text-[9px] uppercase tracking-widest text-champagne-300">
            Sale
          </span>
        ) : (
          product.isNew && (
            <span className="absolute left-3 top-3 bg-ivory-50 px-2 py-1 text-[9px] uppercase tracking-widest text-gold-600">
              New
            </span>
          )
        )}
      </Link>

      <button
        type="button"
        onClick={() => toggle(product.id)}
        aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
        aria-pressed={saved}
        className={cn(
          "absolute right-3 top-3 flex size-9 items-center justify-center rounded-full backdrop-blur transition-all",
          saved
            ? "bg-espresso/80 text-gold-400"
            : "bg-ivory-50/80 text-espresso-soft hover:text-espresso",
        )}
      >
        <Heart className={cn("size-4", saved && "fill-current")} aria-hidden="true" />
      </button>

      <div className="mt-3">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-sans text-sm leading-snug text-espresso transition-colors group-hover:text-gold-700">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-espresso-soft">{format(product.price)}</p>
        {onSale && (
          <p className="text-xs text-espresso-300 line-through">
            {format(product.originalPrice)}
          </p>
        )}
      </div>
    </article>
  );
}
