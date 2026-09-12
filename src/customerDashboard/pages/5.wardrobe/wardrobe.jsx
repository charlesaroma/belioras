/* Page: Account - Wardrobe */
import { useMemo } from "react";
import { Shirt } from "lucide-react";

import EmptyState from "../../../components/ui/EmptyState";
import { useCustomerAuth } from "@/context/auth/useAuthRealm";
import { useCart } from "../../../context/CartContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useToast } from "../../../context/ToastContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getOrders } from "../../../services/ordersApi";
import { getProducts } from "../../../services/productsApi";
import { ownedPieces, usualSizes } from "../../../utils/purchaseHistory";

import WardrobeSizes from "./sections/WardrobeSizes";
import WardrobeGrid from "./sections/WardrobeGrid";

/**
 * What a customer owns.
 *
 * Distinct from /account/orders, which answers "where is my parcel". This
 * answers "what do I have", which is the question a returning shopper brings
 * — re-order the size that fit, check the wardrobe before buying something
 * similar, find a piece from two seasons ago. Every figure is derived from
 * orders already fetched; nothing new is stored.
 */
export default function AccountWardrobe() {
  const { user } = useCustomerAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { locale } = useLanguage();

  const { data: orders, loading } = useAsyncData(() => getOrders(user?.id), [user?.id]);
  const { data: catalog } = useAsyncData(getProducts, []);

  const pieces = useMemo(() => ownedPieces(orders, catalog), [orders, catalog]);
  const sizes = useMemo(() => usualSizes(pieces), [pieces]);

  const dateFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: "short", year: "numeric" }),
    [locale],
  );

  const buyAgain = (piece) => {
    const added = addItem(piece.product, {
      size: piece.size,
      color: piece.color,
      quantity: 1,
    });
    toast(
      added === false
        ? `${piece.name} is not available in that size right now.`
        : `${piece.name} added to your bag.`,
      added === false ? "warning" : "success",
    );
  };

  if (loading) {
    return (
      <div className="space-y-6" aria-hidden="true">
        <div className="skeleton h-28 w-full" />
        <div className="skeleton h-72 w-full" />
      </div>
    );
  }

  if (!pieces.length) {
    return (
      <div className="space-y-6">
        <WardrobeHeading />
        <EmptyState
          icon={Shirt}
          title="Your wardrobe is empty"
          description="Pieces you order appear here, with the size you took and a way to buy them again."
          action={{ label: "Browse the collection", to: "/shop" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <WardrobeHeading count={pieces.length} />
      <WardrobeSizes sizes={sizes} pieceCount={pieces.length} />
      <WardrobeGrid pieces={pieces} dateFmt={dateFmt} onBuyAgain={buyAgain} />
    </div>
  );
}

function WardrobeHeading({ count }) {
  return (
    <div>
      <h2 className="font-display text-2xl tracking-wide text-espresso">Wardrobe</h2>
      <p className="mt-1 text-sm text-espresso-soft">
        {count
          ? `${count} ${count === 1 ? "piece" : "pieces"} you have ordered, newest first.`
          : "Everything you have ordered, in one place."}
      </p>
    </div>
  );
}
