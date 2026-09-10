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
import { useWishlist } from "../../../../context/WishlistContext";
import ProductBuyPanelVariants from "./ProductBuyPanelVariants";
import ProductBuyPanelActions from "./ProductBuyPanelActions";
import ProductPageAccordions from "../ProductPageAccordions";

const ADDED_FEEDBACK_MS = 1800;

export default function ProductBuyPanel({ product }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { t } = useLanguage();

  const [color, setColor] = useState(product.colors?.[0] ?? null);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sizeError, setSizeError] = useState("");
  const [added, setAdded] = useState(false);

  const saved = has(product.id);
  const soldOut = product.stock === 0;
  const needsSize = product.sizes?.length > 1;

  // Which reference table this piece needs. null means there is nothing
  // useful to show, so no trigger is rendered.
  const chartKind = sizeChartKindFor(product);

  const handleAdd = () => {
    if (needsSize && !size) {
      setSizeError(t("pdp.selectSizeFirst", "Please select a size."));
      return;
    }
    setSizeError("");
    addItem(product, { size: size ?? product.sizes?.[0] ?? null, color, quantity: qty });
    setAdded(true);
    setTimeout(() => setAdded(false), ADDED_FEEDBACK_MS);
  };

  return (
    <>
      <ProductBuyPanelVariants
        product={product}
        color={color}
        onColorChange={setColor}
        size={size}
        onSizeChange={(s) => {
          setSize(s);
          setSizeError("");
        }}
        sizeError={sizeError}
        needsSize={needsSize}
        chartKind={chartKind}
        onOpenChart={() => setSizeGuideOpen(true)}
      />

      <ProductBuyPanelActions
        product={product}
        qty={qty}
        onQtyChange={setQty}
        onAdd={handleAdd}
        added={added}
        soldOut={soldOut}
        saved={saved}
        onToggleSaved={() => toggle(product.id)}
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
