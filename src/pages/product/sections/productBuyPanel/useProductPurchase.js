/* Product Purchase State */
import { useState } from "react";

import { sizeChartKindFor } from "../../../../components/storefront/sizeChart/sizeChartKind";
import { useCart } from "../../../../context/CartContext";
import { useLanguage } from "../../../../context/LanguageContext";
import { useToast } from "../../../../context/ToastContext";
import { useWishlist } from "../../../../context/WishlistContext";
import { useAsyncData } from "../../../../hooks/useAsyncData";
import { getTaxonomy } from "../../../../services/catalog/navigationApi";
import { stockFor } from "../../../../utils/productColors";

const ADDED_FEEDBACK_MS = 1800;

/**
 * Everything about buying one piece — size, quantity, stock in the chosen
 * colour, adding to the bag, saving — shared by the product page and the
 * quick view so the two cannot drift apart. The chosen colour stays with the
 * caller (the page keeps it in the URL, the quick view in state).
 *
 * `onAdded` runs after a successful add; the quick view uses it to close
 * before the bag opens, the page opens the bag directly.
 */
export function useProductPurchase({ product, color, onColorChange, images, onAdded }) {
  const { addItem, openCart } = useCart();
  const { has, toggle } = useWishlist();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { data: taxonomy } = useAsyncData(getTaxonomy, []);

  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState("");
  const [added, setAdded] = useState(false);

  const saved = has(product.id);
  const needsSize = product.sizes?.length > 1;
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

  const chooseSize = (s) => {
    setSize(s);
    setSizeError("");
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
    onAdded?.();
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

  return {
    taxonomy, size, qty, setQty, sizeError, added, saved, needsSize, chartKind,
    available, soldOut, unavailable, changeColor, chooseSize, handleAdd, toggleSaved,
  };
}
