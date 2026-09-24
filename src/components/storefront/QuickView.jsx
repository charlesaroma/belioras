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
import { useAsyncData } from "../../hooks/useAsyncData";
import { getSettings } from "../../services/content/settingsApi";
import { cn } from "../../utils/cn";
import { imagesForColor, videoForColor } from "../../utils/productColors";

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
    <Modal open={open} onClose={onClose} title={product.name} width="max-w-5xl" bare>
      <QuickViewBody key={session} product={product} onClose={onClose} />
    </Modal>,
    document.body,
  );
}

const LOW_STOCK = 3;

function QuickViewBody({ product, onClose }) {
  const { format } = useCurrency();
  const { data: settings } = useAsyncData(getSettings, []);
  const [color, setColor] = useState(product.colors?.[0] ?? null);
  const images = imagesForColor(product, color);

  // Closes first, so the bag drawer opens over the page and not the dialog.
  const buy = useProductPurchase({ product, color, onColorChange: setColor, images, onAdded: onClose });

  const onSale = product.originalPrice && product.originalPrice > product.price;
  const percentOff = onSale ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  // Read from Settings, so the line changes when shipping does.
  const freeFrom = settings?.shipping?.zones?.find((z) => z.freeThreshold)?.freeThreshold;
  const vat = settings?.tax?.rate ? `${Math.round(settings.tax.rate * 100)}% VAT included` : "VAT included";
  const shipping =
    freeFrom && product.price >= freeFrom
      ? "Free shipping across the EU on this piece"
      : freeFrom
        ? `Free shipping in Germany · free across the EU over ${format(freeFrom)}`
        : null;

  const lowStock = buy.available > 0 && buy.available <= LOW_STOCK && (!buy.needsSize || buy.size);

  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-10">
      <ProductPageGallery key={color} imageClassName="aspect-square md:aspect-[3/4]" images={images} video={videoForColor(product, color)} name={color ? `${product.name} in ${color}` : product.name} />

      <div className="min-w-0 md:pr-6">
        <p className="font-display text-2xl leading-tight text-espresso md:pr-8">{product.name}</p>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className={cn("text-xl tabular-nums", onSale ? "text-error" : "text-espresso")}>{format(product.price)}</span>
          {onSale && <span className="text-sm tabular-nums text-espresso/45 line-through">{format(product.originalPrice)}</span>}
          {onSale && percentOff > 0 && (
            <span className="bg-espresso px-2 py-1 text-[10px] uppercase tracking-widest text-champagne-300">−{percentOff}%</span>
          )}
          <span className="text-xs text-espresso-soft">{vat}</span>
        </div>

        {product.description && (
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-espresso-soft">{product.description}</p>
        )}

        <Link
          to={`/product/${product.slug}${color ? `?color=${encodeURIComponent(color)}` : ""}`}
          onClick={onClose}
          className="mt-3 inline-block text-[11px] uppercase tracking-[0.18em] text-espresso underline decoration-gold-600 decoration-2 underline-offset-4 transition-colors hover:text-gold-700"
        >
          View full details
        </Link>

        {/* The size guide is a second dialog on top of this one, so the link
            here goes to the full page, which has it. */}
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

        {lowStock && <p className="mt-4 text-xs font-medium text-error">Only {buy.available} left</p>}

        {/* On a phone the bar stays pinned to the foot of the sheet. */}
        <div className="mt-6 max-md:sticky max-md:-bottom-5 max-md:-mx-5 max-md:-mb-5 max-md:border-t max-md:border-umber-50 max-md:bg-ivory-50 max-md:px-5 max-md:py-3">
          <ProductBuyPanelActions
            className=""
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
        </div>

        {shipping && (
          <p className="mt-4 text-xs leading-relaxed text-espresso-soft">
            {shipping} · 14-day returns on unworn pieces
          </p>
        )}
      </div>
    </div>
  );
}
