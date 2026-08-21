import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

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
    id, slug, name, price, originalPrice,
    images = [], rating, reviewCount,
    collectionId = "", stock = 0,
    sizes = [], colors = [], isNew,
  } = product;

  const wished = has(id);
  const soldOut = !stock || stock <= 0;
  const priceLabel = formatCurrency(convert(price), currency);
  const wasLabel = originalPrice ? formatCurrency(convert(originalPrice), currency) : null;
  const hoverImage = images.length > 1 ? images[1] : null;
  const discountPct = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

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
      className="group block cursor-pointer"
      aria-label={`${name}, ${priceLabel}`}
    >
      {/* ── Image container ── */}
      <div
        className={`relative aspect-[3/4] overflow-hidden rounded-xl bg-ivory-100 ${
          soldOut ? "opacity-60 saturate-50" : ""
        }`}
      >
        {/* Primary image */}
        <img
          src={images[0]}
          alt={name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 group-hover:scale-105 group-hover:opacity-0"
        />

        {/* Hover image (if exists) */}
        {hoverImage ? (
          <img
            src={hoverImage}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-top opacity-0 scale-110 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
          />
        ) : (
          /* Subtle warm overlay when no second image */
          <div className="absolute inset-0 bg-espresso/0 transition-all duration-500 group-hover:bg-espresso/10" />
        )}

        {/* Badges: New, Sale */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
          {isNew && (
            <span className="bg-ivory-50/95 backdrop-blur text-espresso text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
              New
            </span>
          )}
          {!soldOut && discountPct && (
            <span className="bg-gold-500 text-espresso text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          className={`absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full backdrop-blur shadow-sm transition-all duration-200 cursor-pointer hover:scale-110 ${
            wished
              ? "bg-gold-500/90 text-espresso"
              : "bg-ivory-50/90 text-espresso/60 hover:bg-ivory-50 hover:text-espresso"
          }`}
        >
          <Heart
            className="size-4"
            fill={wished ? "currentColor" : "none"}
          />
        </button>

        {/* ── Hover action panel (slides up from bottom) ── */}
        {!soldOut ? (
          <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
            <div className="bg-ivory-50/95 backdrop-blur px-4 py-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleQuickAdd}
                className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-espresso text-ivory-50 text-[11px] font-bold uppercase tracking-widest py-2.5 rounded-lg hover:bg-gold-700 hover:text-espresso transition-all duration-200"
              >
                <ShoppingBag className="size-3.5" />
                Quick Add
              </button>
              <Link
                to={`/product/${slug}`}
                onClick={(e) => e.stopPropagation()}
                aria-label={`View ${name}`}
                className="cursor-pointer flex size-10 items-center justify-center rounded-lg border border-umber-50 text-espresso/60 hover:border-espresso hover:text-espresso transition-all duration-200 shrink-0"
              >
                <Eye className="size-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="absolute inset-x-0 bottom-0 z-10 bg-ivory-50/90 backdrop-blur px-4 py-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-espresso/50">Sold Out</span>
          </div>
        )}
      </div>

      {/* ── Product info ── */}
      <div className="mt-3.5 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-700/80">
          {collectionId.charAt(0).toUpperCase() + collectionId.slice(1)}
        </p>
        <h3 className="text-sm font-medium leading-snug text-espresso group-hover:text-gold-700 transition-colors duration-200">
          {name}
        </h3>

        {/* Colors swatches preview */}
        {colors.length > 0 && (
          <div className="flex items-center gap-1 pt-0.5">
            {colors.slice(0, 4).map((c) => (
              <span
                key={c}
                title={c}
                className="size-3 rounded-full border border-black/10 shadow-inner"
                style={{
                  backgroundColor:
                    c === "Ebony" ? "#2d2a26" :
                    c === "Champagne" ? "#f2d680" :
                    c === "Burgundy" ? "#6b2d35" :
                    c === "Ivory" ? "#f8f5f0" :
                    c === "Blush" ? "#f4bfb2" :
                    c === "Sand" ? "#d4bc8f" :
                    c === "Forest" ? "#2d4a35" :
                    c === "Rosewood" ? "#b05b6f" :
                    c === "Gold" ? "#c9a84c" :
                    c === "Jet Black" ? "#111" :
                    c === "Natural Black" ? "#1c1a19" :
                    c === "Honey Blonde" ? "#d4a847" :
                    c === "Caramel" ? "#c07f40" :
                    c === "Chestnut" ? "#954535" :
                    c === "Dark Brown" ? "#3b1f0f" : "#ccc",
                }}
              />
            ))}
            {colors.length > 4 && (
              <span className="text-[9px] text-espresso/40 pl-0.5">+{colors.length - 4}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-0.5">
          <p className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-espresso">{priceLabel}</span>
            {wasLabel && (
              <span className="text-xs text-espresso/40 line-through">{wasLabel}</span>
            )}
          </p>
          <RatingStars rating={rating} count={reviewCount} />
        </div>
      </div>
    </Link>
  );
}
