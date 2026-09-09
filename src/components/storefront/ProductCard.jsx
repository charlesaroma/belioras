import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

import { useCurrency } from "../../context/CurrencyContext";
import { useWishlist } from "../../context/WishlistContext";
import { cn } from "../../utils/cn";

/**
 * Product card.
 *
 * Name and price, nothing else. No colour dots, no rating stars, no quick-add
 * button — the restraint is the point. On a luxury catalogue the photograph is
 * the argument; chrome stacked underneath it competes with the thing being
 * sold and makes an edit of considered pieces read like a marketplace listing.
 *
 * Hover behaviour, following the interaction guidance:
 *  - Only transform and opacity animate. Nothing that triggers layout, so a
 *    grid of forty cards stays smooth.
 *  - The image swap is slow (700ms) because it is a large surface and reads as
 *    considered; the text and chrome move at 200-300ms, which is where
 *    feedback stops feeling sluggish.
 *  - Every transition is a plain CSS transition, so it reverses on its own if
 *    the pointer leaves mid-animation rather than sticking.
 *  - The wishlist control is always visible below `md`. Hover is not available
 *    on touch, so hiding a real action behind it would remove it entirely on
 *    phones.
 */
export default function ProductCard({ product }) {
  const { format } = useCurrency();
  const { has, toggle } = useWishlist();

  const { id, slug, name, price, originalPrice, images = [], isNew, stock = 0 } = product;

  const saved = has(id);
  const onSale = originalPrice && originalPrice > price;
  const soldOut = stock === 0;
  const secondImage = images[1];

  return (
    <article className="group relative">
      <Link to={`/product/${slug}`} className="block overflow-hidden bg-ivory-200">
        <div className="relative aspect-[3/4] w-full">
          <img
            src={images[0]}
            alt={name}
            loading="lazy"
            className={cn(
              "h-full w-full object-cover transition-all duration-700 ease-out",
              secondImage ? "group-hover:opacity-0" : "group-hover:scale-[1.03]",
            )}
          />
          {secondImage && (
            <img
              src={secondImage}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
            />
          )}

          {soldOut && (
            <span className="absolute inset-x-0 bottom-0 bg-ivory-50/90 py-2 text-center text-[10px] uppercase tracking-[0.2em] text-espresso backdrop-blur">
              Sold out
            </span>
          )}
        </div>

        {/* One badge only. Two competing labels on a photograph is clutter. */}
        {!soldOut &&
          (onSale ? (
            <span className="absolute left-3 top-3 bg-espresso px-2 py-1 text-[9px] uppercase tracking-widest text-champagne-300">
              Sale
            </span>
          ) : (
            isNew && (
              <span className="absolute left-3 top-3 bg-ivory-50 px-2 py-1 text-[9px] uppercase tracking-widest text-gold-600">
                New
              </span>
            )
          ))}
      </Link>

      <button
        type="button"
        onClick={() => toggle(id)}
        aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name}`}
        aria-pressed={saved}
        className={cn(
          "absolute right-2 top-2 flex size-11 items-center justify-center rounded-full backdrop-blur",
          "transition-all duration-300",
          saved ? "bg-espresso/80 text-gold-400" : "bg-ivory-50/80 text-espresso-soft",
          // Revealed on hover at desktop widths, permanent on touch, and always
          // present once focused so the keyboard never loses it.
          "md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100",
          saved && "md:opacity-100",
        )}
      >
        <Heart className={cn("size-4", saved && "fill-current")} aria-hidden="true" />
      </button>

      <div className="mt-3">
        <h3>
          <Link
            to={`/product/${slug}`}
            className="font-sans text-sm leading-snug text-espresso transition-colors duration-200 group-hover:text-gold-700"
          >
            {name}
          </Link>
        </h3>

        <p className="mt-1 flex items-baseline gap-2 text-sm">
          <span className={cn("tabular-nums", onSale ? "text-espresso" : "text-espresso-soft")}>
            {format(price)}
          </span>
          {onSale && (
            <span className="text-xs tabular-nums text-espresso/35 line-through">
              {format(originalPrice)}
            </span>
          )}
        </p>
      </div>
    </article>
  );
}
