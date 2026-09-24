/* Storefront Component: QuickView */
import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

import Modal from "../common/Modal";
import { useCurrency } from "../../context/CurrencyContext";
import ProductPageGallery from "../../pages/product/sections/ProductPageGallery";
import ProductBuyPanelActions from "../../pages/product/sections/productBuyPanel/ProductBuyPanelActions";
import ProductBuyPanelVariants from "../../pages/product/sections/productBuyPanel/ProductBuyPanelVariants";
import { useProductPurchase } from "../../pages/product/sections/productBuyPanel/useProductPurchase";
import { cn } from "../../utils/cn";
import { imagesForColor } from "../../utils/productColors";

/**
 * The piece in a dialog, without leaving the page: photos, colour, size and
 * add to bag — the same buying logic as the product page (useProductPurchase),
 * so the two agree — with a link through to the full page.
 *
 * Rendered into <body> so a transformed or clipped ancestor (a carousel) can
 * never trap it. `session` changes on every opening, which starts the choices
 * fresh each time.
 */
export default function QuickView({ product, open, session, onClose }) {
  return createPortal(
    <Modal open={open} onClose={onClose} title={product.name} width="max-w-4xl">
      <QuickViewBody key={session} product={product} onClose={onClose} />
    </Modal>,
    document.body,
  );
}

function QuickViewBody({ product, onClose }) {
  const { format } = useCurrency();
  const [color, setColor] = useState(product.colors?.[0] ?? null);
  const images = imagesForColor(product, color);

  // Closes first, so the bag drawer opens over the page and not the dialog.
  const buy = useProductPurchase({ product, color, onColorChange: setColor, images, onAdded: onClose });

  const onSale = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-10">
      <ProductPageGallery key={color} imageClassName="aspect-[4/3] md:aspect-[3/4]" images={images} name={color ? `${product.name} in ${color}` : product.name} />

      <div className="min-w-0">
        <div className="flex items-baseline gap-3">
          <span className={cn("text-xl tabular-nums", onSale ? "text-error" : "text-espresso")}>{format(product.price)}</span>
          {onSale && <span className="text-sm tabular-nums text-espresso/35 line-through">{format(product.originalPrice)}</span>}
        </div>

        {product.description && (
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-espresso-soft">{product.description}</p>
        )}

        {/* No size-guide link here: it is a second dialog on top of this one.
            The full page has it. */}
        <ProductBuyPanelVariants
          product={product}
          taxonomy={buy.taxonomy}
          color={color}
          onColorChange={buy.changeColor}
          size={buy.size}
          onSizeChange={buy.chooseSize}
          sizeError={buy.sizeError}
          needsSize={buy.needsSize}
          unavailable={buy.unavailable}
          chartKind={null}
        />

        <ProductBuyPanelActions
          product={product}
          qty={buy.qty}
          onQtyChange={buy.setQty}
          maxQty={buy.available}
          onAdd={buy.handleAdd}
          added={buy.added}
          soldOut={buy.soldOut}
          saved={buy.saved}
          onToggleSaved={buy.toggleSaved}
        />

        <Link
          to={`/product/${product.slug}${color ? `?color=${encodeURIComponent(color)}` : ""}`}
          onClick={onClose}
          className="mt-6 inline-block text-[11px] uppercase tracking-[0.18em] text-gold-700 underline underline-offset-4 transition-colors hover:text-espresso"
        >
          View full details
        </Link>
      </div>
    </div>
  );
}
