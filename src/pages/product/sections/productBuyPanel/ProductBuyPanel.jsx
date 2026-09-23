/* Buy Panel */
import { useState } from "react";

import Modal from "../../../../components/common/Modal";
import SizeChart from "../../../../components/storefront/sizeChart/SizeChart";
import {
  sizeChartKindFor,
  sizeChartLabelFor,
} from "../../../../components/storefront/sizeChart/sizeChartKind";
import { useCart } from "../../../../context/CartContext";
import { useLanguage } from "../../../../context/LanguageContext";
import { useToast } from "../../../../context/ToastContext";
import { useWishlist } from "../../../../context/WishlistContext";
import { useAsyncData } from "../../../../hooks/useAsyncData";
import { getTaxonomy } from "../../../../services/catalog/navigationApi";
import { stockFor } from "../../../../utils/productColors";
import ProductBuyPanelVariants from "./ProductBuyPanelVariants";
import ProductBuyPanelActions from "./ProductBuyPanelActions";
import ProductPageAccordions from "../ProductPageAccordions";

const ADDED_FEEDBACK_MS = 1800;

export default function ProductBuyPanel({ product, color, onColorChange, images }) {
  const { addItem, openCart } = useCart();
  const { has, toggle } = useWishlist();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { data: taxonomy } = useAsyncData(getTaxonomy, []);

  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sizeError, setSizeError] = useState("");
  const [added, setAdded] = useState(false);

  const saved = has(product.id);
  const needsSize = product.sizes?.length > 1;

  // Which reference table this piece needs. null means there is nothing
  // useful to show, so no trigger is rendered.
  const chartKind = sizeChartKindFor(product);

  // A piece with a single size has no choice to make; that size stands in.
  const sizeKey = needsSize ? size : (product.sizes?.[0] ?? null);
  const available = stockFor(product, color, sizeKey);
  const soldOut = available === 0;

  // Sizes sold out in this colour, which may still be in stock in another.
  const unavailable = new Set(
    needsSize ? product.sizes.filter((s) => stockFor(product, color, s) === 0) : [],
  );

  const changeColor = (next) => {
    onColorChange(next);
    if (size && stockFor(product, next, size) === 0) setSize(null);
  };

  const handleAdd = () => {
    if (needsSize && !size) {
      setSizeError(t("pdp.selectSizeFirst", "Please select a size."));
      return;
    }
    setSizeError("");
    const ok = addItem(product, {
      size: size ?? product.sizes?.[0] ?? null,
      color,
      quantity: qty,
      // The bag shows the colourway that was bought, not the default photo.
      image: images?.[0],
      stock: available,
    });
    if (!ok) {
      toast(`There is no more stock of ${product.name} in that size.`, "error");
      return;
    }
    toast(`${product.name} added to your bag.`, "success");
    // The drawer itself is the confirmation shoppers actually look at; the
    // toast is there for anyone who dismissed or missed it.
    openCart();
    setAdded(true);
    setTimeout(() => setAdded(false), ADDED_FEEDBACK_MS);
  };

  const toggleSaved = () => {
    toggle(product.id);
    toast(saved ? `${product.name} removed from your wishlist.` : `${product.name} saved to your wishlist.`, saved ? "info" : "success");
  };

  return (
    <>
      <ProductBuyPanelVariants
        product={product}
        taxonomy={taxonomy}
        color={color}
        onColorChange={changeColor}
        size={size}
        onSizeChange={(s) => {
          setSize(s);
          setSizeError("");
        }}
        sizeError={sizeError}
        needsSize={needsSize}
        unavailable={unavailable}
        chartKind={chartKind}
        onOpenChart={() => setSizeGuideOpen(true)}
      />

      <ProductBuyPanelActions
        product={product}
        qty={qty}
        onQtyChange={setQty}
        maxQty={available}
        onAdd={handleAdd}
        added={added}
        soldOut={soldOut}
        saved={saved}
        onToggleSaved={toggleSaved}
      />

      <ProductPageAccordions product={product} />

      <Modal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        title={sizeChartLabelFor(chartKind)}
        // max-w-lg cuts the international table off; this holds six columns
        // and the measuring figure without scrolling sideways.
        width="max-w-2xl"
      >
        <SizeChart kind={chartKind ?? "garment"} />
      </Modal>
    </>
  );
}
