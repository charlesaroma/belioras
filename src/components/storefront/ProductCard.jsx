import { Heart, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import RatingStars from "../shared/RatingStars";
import SaleBadge from "../shared/SaleBadge";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useToast } from "../../context/ToastContext";
import { useWishlist } from "../../context/WishlistContext";
import { formatCurrency } from "../../utils/formatCurrency";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { currency, convert } = useCurrency();
  const { toast } = useToast();
  const { has, toggle } = useWishlist();

  if (!product) return null;

  const {
    id,
    slug,
    name,
    price,
    originalPrice,
    images = [],
    rating,
    reviewCount,
    collectionId = "",
    stock = 0,
    sizes = [],
    colors = [],
  } = product;

  const wished = has(id);
  const soldOut = !stock || stock <= 0;
  const collectionLabel = collectionId
    ? collectionId.charAt(0).toUpperCase() + collectionId.slice(1)
    : "";
  const priceLabel = formatCurrency(convert(price), currency);
  const wasLabel = originalPrice ? formatCurrency(convert(originalPrice), currency) : null;
  const hoverImage = images.length > 1 ? images[1] : null;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (soldOut) return;
    addItem(product, { size: sizes[0], color: colors[0] ?? "Default" });
    toast(`${name} added to bag`, "success");
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggle(id);
  };

  return (
    <Link
      to={`/product/${slug}`}
      className="group block"
      aria-label={`${name}, ${priceLabel}`}
    >
      <div
        className={`relative aspect-[3/4] overflow-hidden rounded-lg border border-umber-100 bg-ivory-100 ${
          soldOut ? "opacity-70 saturate-50" : ""
        }`}
      >
        <img
          src={images[0]}
          alt={name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        {hoverImage && (
          <img
            src={hoverImage}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {!soldOut && <SaleBadge product={product} className="absolute left-3 top-3" />}

        <button
          type="button"
          onClick={handleWishlist}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-ivory-50/90 shadow-sm backdrop-blur transition hover:scale-105"
        >
          <Heart
            className={`size-4 ${wished ? "text-gold-700" : "text-espresso-soft"}`}
            fill={wished ? "currentColor" : "none"}
          />
        </button>

        {soldOut ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="status-chip status-chip--sold-out">Sold out</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label={`Quick add ${name} to bag`}
            className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full bg-ivory-50 text-espresso shadow-sm transition hover:bg-gold-600 hover:text-ivory-50 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
          >
            <Plus className="size-4" />
          </button>
        )}
      </div>

      <div className="mt-3 space-y-1">
        {collectionLabel && (
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold-700">
            {collectionLabel}
          </p>
        )}
        <h3 className="font-medium leading-snug text-espresso">{name}</h3>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="flex items-baseline gap-2">
            <span
              className="text-sm font-semibold text-espresso"
              title={
                wasLabel ? `Was ${wasLabel} · Sale price, lowest in 30 days` : undefined
              }
            >
              {priceLabel}
            </span>
            {wasLabel && (
              <span
                className="text-sm text-espresso-soft line-through"
                aria-label={`Original price ${wasLabel}`}
              >
                {wasLabel}
              </span>
            )}
          </p>
          <RatingStars rating={rating} count={reviewCount} />
        </div>
      </div>
    </Link>
  );
}