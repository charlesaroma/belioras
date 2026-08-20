import { createContext, useCallback, useContext, useMemo } from "react";

import { useLocalStorage } from "../hooks/useLocalStorage";

const CartContext = createContext(null);

function clampQty(qty, stock) {
  return Math.min(Math.max(1, Math.floor(qty)), Math.max(0, stock));
}

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage("belioras:cart", []);

  const addItem = useCallback(
    (product, { size, color, quantity = 1 } = {}) => {
      if (!product || product.stock <= 0) return false;
      const qty = clampQty(quantity, product.stock);
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.id === product.id && i.size === size && i.color === color
        );
        if (existing) {
          const merged = clampQty(existing.quantity + qty, product.stock);
          return prev.map((i) => (i === existing ? { ...i, quantity: merged } : i));
        }
        return [
          ...prev,
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.images?.[0],
            size,
            color,
            quantity: qty,
          },
        ];
      });
      return true;
    },
    [setItems]
  );

  const updateQty = useCallback(
    (index, quantity) => {
      setItems((prev) => {
        const item = prev[index];
        if (!item) return prev;
        const next = clampQty(quantity, 99);
        return next <= 0 ? prev.filter((_, i) => i !== index) : prev.map((i, idx) => (idx === index ? { ...i, quantity: next } : i));
      });
    },
    [setItems]
  );

  const removeItem = useCallback(
    (index) => setItems((prev) => prev.filter((_, i) => i !== index)),
    [setItems]
  );

  const clear = useCallback(() => setItems([]), [setItems]);

  const isInCart = useCallback((productId) => items.some((i) => i.id === productId), [items]);

  const value = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    return { items, subtotal, count, addItem, updateQty, removeItem, clear, isInCart };
  }, [items, addItem, updateQty, removeItem, clear, isInCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}