/* Storefront Component: ProductCard */
import { useState } from "react";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useToast } from "../../context/ToastContext";
import { useWishlist } from "../../context/WishlistContext";
import { cn } from "../../utils/cn";
import { imagesForColor, stockFor } from "../../utils/productColors";
import QuickView from "./QuickView";

const ACTION =
  "flex size-11 items-center justify-center rounded-full backdrop-blur transition-[color,background-color,scale] duration-200 hover:text-espresso active:scale-90";

export default function ProductCard({ product }) {
  const { format } = useCurrency();
  const { has, toggle } = useWishlist();
  const { toast } = useToast();
  const { addItem, openCart } = useCart();

  const { id, slug, name, price, originalPrice, images = [], isNew, stock = 0 } = product;

  const saved = has(id);

  const onSale = originalPrice && originalPrice > price;

  const soldOut = stock === 0;

  const secondImage = images[1];

  // Not mounted until first asked for: a grid holds dozens of cards, and each
  // dialog is markup that would otherwise sit in the page for nothing.
  const [quick, setQuick] = useState({ open: false, session: 0, used: false });
  const openQuick = () => setQuick((q) => ({ open: true, session: q.session + 1, used: true }));

  // A piece with one size and one colour has nothing to choose, so the bag
  // button adds it straight away; otherwise it opens the quick view to choose.
  const needsChoice = (product.sizes?.length ?? 0) > 1 || (product.colors?.length ?? 0) > 1;
  const quickAdd = () => {
    if (needsChoice) return openQuick();
    const color = product.colors?.[0] ?? null;
    const size = product.sizes?.[0] ?? null;
    const ok = addItem(product, {
      size, color, quantity: 1, image: imagesForColor(product, color)?.[0], stock: stockFor(product, color, size),
    });
    if (!ok) return toast(`There is no more stock of ${name}.`, "error");
    toast(`${name} added to your bag.`, "success");
    openCart();
  };

  return (
    <article className="group relative">
      <div className="relative overflow-hidden">
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

      {/* One column of round buttons, top right: save, quick view, add to
          bag. Permanent on touch; from md up they appear on hover or focus,
          and stay reachable by keyboard. */}
      <div
        className={cn(
          "absolute right-2 top-2 flex flex-col gap-2 transition-opacity duration-300",
          "md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100",
          saved && "md:opacity-100",
        )}
      >
        <button
          type="button"
          onClick={() => {
            toggle(id);
            toast(saved ? `${name} removed from your wishlist.` : `${name} saved to your wishlist.`, saved ? "info" : "success");
          }}
          aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name}`}
          aria-pressed={saved}
          className={cn(ACTION, saved ? "bg-espresso/80 text-gold-400" : "bg-ivory-50/80 text-espresso-soft")}
        >
          <Heart className={cn("size-4", saved && "fill-current")} aria-hidden="true" />
        </button>

        <button type="button" onClick={openQuick} aria-label={`Quick view ${name}`} className={cn(ACTION, "bg-ivory-50/80 text-espresso-soft")}>
          <Eye className="size-4" aria-hidden="true" />
        </button>

        {!soldOut && (
          <button
            type="button"
            onClick={quickAdd}
            aria-label={needsChoice ? `Choose options for ${name}` : `Add ${name} to bag`}
            className={cn(ACTION, "bg-ivory-50/80 text-espresso-soft")}
          >
            <ShoppingBag className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
      </div>

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
      {quick.used && <QuickView product={product} open={quick.open} session={quick.session} onClose={() => setQuick((q) => ({ ...q, open: false }))} />}
    </article>
  );
}
