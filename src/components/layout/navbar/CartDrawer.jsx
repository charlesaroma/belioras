import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag, Trash2, X } from "lucide-react";

import { useCart } from "../../../context/CartContext";
import { useCurrency } from "../../../context/CurrencyContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getSettings } from "../../../services/settingsApi";
import { formatCurrency } from "../../../utils/formatCurrency";
import QuantitySelector from "../../shared/QuantitySelector";

export default function CartDrawer({ open, onClose }) {
  const { items, subtotal, count, updateQty, removeItem } = useCart();
  const { currency, convert } = useCurrency();
  const { data: settings } = useAsyncData(getSettings, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const euZone = settings?.shippingZones?.find((z) => z.id === "eu");
  const threshold = euZone ? convert(euZone.freeThreshold ?? 150) : convert(150);
  const convertedSubtotal = convert(subtotal);
  const remainingForFree = Math.max(0, threshold - convertedSubtotal);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[60]"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping cart"
        >
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 cursor-default bg-espresso/40 backdrop-blur-sm"
            aria-label="Close cart"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-y-0 right-0 flex w-[min(92vw,420px)] flex-col bg-ivory-50 shadow-large"
          >
            <div className="flex items-center justify-between border-b border-umber-50 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-espresso">
                <ShoppingBag className="size-4" aria-hidden="true" />
                Cart ({count})
              </h2>
              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-full text-espresso hover:bg-brown-50"
                aria-label="Close cart"
                onClick={onClose}
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <p className="font-display text-xl text-espresso">Your cart is empty</p>
                <p className="text-sm text-espresso/60">
                  Discover this season's pieces and add something to keep.
                </p>
                <Link to="/shop" onClick={onClose} className="btn btn-primary mt-2">
                  Start shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="border-b border-umber-50 px-5 py-3">
                  {remainingForFree > 0 ? (
                    <p className="text-sm text-espresso/70">
                      You are{" "}
                      <span className="font-semibold text-gold-700">
                        {formatCurrency(remainingForFree, currency)}
                      </span>{" "}
                      away from free shipping
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-gold-700">
                      You've unlocked free shipping
                    </p>
                  )}
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-brown-50">
                    <div
                      className="h-full rounded-full bg-gold-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (convertedSubtotal / Math.max(threshold, 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <ul className="flex-1 divide-y divide-umber-50 overflow-y-auto px-5">
                  {items.map((item, index) => (
                    <li key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 py-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="aspect-[4/5] w-16 shrink-0 rounded-lg object-cover"
                        loading="lazy"
                      />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <Link
                          to={`/product/${item.slug}`}
                          onClick={onClose}
                          className="truncate text-sm font-medium text-espresso hover:text-gold-700"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-espresso/50">
                          {[item.color, item.size && `Size ${item.size}`].filter(Boolean).join(" · ")}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <QuantitySelector
                            value={item.quantity}
                            max={99}
                            onChange={(q) => updateQty(index, q)}
                          />
                          <p className="text-sm font-semibold tabular-nums text-espresso">
                            {formatCurrency(convert(item.price * item.quantity), currency)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="flex size-8 shrink-0 items-center justify-center self-start rounded-full text-espresso/50 hover:bg-brown-50 hover:text-error"
                        aria-label={`Remove ${item.name} from cart`}
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-umber-50 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-[0.14em] text-espresso/60">
                      Subtotal
                    </span>
                    <span className="font-display text-xl text-espresso">
                      {formatCurrency(convertedSubtotal, currency)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-espresso/50">
                    Shipping calculated at checkout · All prices include 20% VAT
                  </p>
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="btn btn-primary btn-lg mt-4 w-full"
                  >
                    Checkout
                  </Link>
                  <button
                    type="button"
                    className="btn btn-ghost mt-2 w-full"
                    onClick={onClose}
                  >
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}