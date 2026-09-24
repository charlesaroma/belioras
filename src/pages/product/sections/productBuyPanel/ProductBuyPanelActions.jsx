/* Quantity Add To Bag And Wishlist */
import { Heart } from "lucide-react";

import QuantitySelector from "../../../../components/shared/QuantitySelector";
import { useLanguage } from "../../../../context/LanguageContext";
import { cn } from "../../../../utils/cn";

export default function ProductBuyPanelActions({
  product,
  qty,
  onQtyChange,
  maxQty,
  onAdd,
  added,
  soldOut,
  saved,
  onToggleSaved,
  className = "mt-8",
}) {
  const { t } = useLanguage();

  return (
    // At 390px the stepper, the button and the heart left the button about
    // 100px, so "Add to bag" broke across three lines. Below sm the primary
    // action takes its own full-width row.
    <div className={cn(className, "flex flex-wrap items-center gap-3 sm:gap-5")}>
      <QuantitySelector large value={qty} onChange={onQtyChange} max={Math.max(maxQty ?? product.stock, 1)} />

      <button
        type="button"
        onClick={onAdd}
        disabled={soldOut}
        className="order-last w-full border border-espresso bg-espresso px-6 h-12 text-sm font-medium uppercase tracking-[0.18em] text-ivory-50 transition-colors hover:bg-espresso-600 disabled:cursor-not-allowed disabled:opacity-40 sm:order-none sm:w-auto sm:flex-1 sm:px-10"
      >
        {soldOut
          ? t("pdp.soldOut", "Sold out")
          : added
            ? t("common.added", "Added to your bag")
            : t("common.addToBag", "Add to bag")}
      </button>

      <button
        type="button"
        onClick={onToggleSaved}
        aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
        aria-pressed={saved}
        className={cn(
          "liquid-hover ml-auto flex size-12 shrink-0 items-center justify-center border transition-colors sm:ml-0",
          saved
            ? "border-espresso bg-espresso text-gold-400"
            : "border-umber-100 text-espresso-soft hover:border-espresso",
        )}
      >
        <Heart className={cn("liquid-icon size-5", saved && "fill-current")} aria-hidden="true" />
      </button>
    </div>
  );
}
