import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { useCurrency } from "../../../context/CurrencyContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { useScopedStorage } from "../../../hooks/useScopedStorage";
import { getOrders } from "../../../services/ordersApi";
import { getProducts } from "../../../services/productsApi";

import ProfileHeader from "./sections/ProfileHeader";
import LatestOrder from "./sections/ProfileLatestOrder";
import DeliversTo from "./sections/ProfileDeliversTo";
import SavedPieces from "./sections/ProfileSavedPieces";

/** How many saved pieces the overview previews before linking onward. */
const PREVIEW_COUNT = 4;

/**
 * The account overview.
 *
 * This used to repeat three links the left rail already showed two inches
 * away, and offer nothing else — a landing page whose entire content was
 * navigation the reader had just walked past.
 *
 * It answers the three questions a customer actually arrives with: where is my
 * order, where is it going, and what did I save. Everything shown is already
 * available from the services the other pages use; nothing new is fetched.
 *
 * Headings here are h2. AccountLayout owns the page's only h1 — it previously
 * rendered the customer's first name as an h1 and this page rendered "Welcome
 * back, <name>" as a second one directly beneath it.
 */
export default function Profile() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const { ids: wishlistIds, count: wishlistCount } = useWishlist();

  const { data: orders, loading: ordersLoading } = useAsyncData(
    () => getOrders(user?.id),
    [user?.id],
  );
  const { data: products } = useAsyncData(getProducts, []);
  const [addresses] = useScopedStorage("belioras:addresses", [], user?.id);

  const latest = [...(orders ?? [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  )[0];

  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0] ?? null;

  const saved = (wishlistIds ?? [])
    .map((id) => products?.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, PREVIEW_COUNT);

  return (
    <div className="space-y-8">
      <ProfileHeader
        user={user}
        orderCount={orders?.length ?? 0}
        wishlistCount={wishlistCount}
        loading={ordersLoading}
      />

      <LatestOrder
        order={latest}
        loading={ordersLoading}
        totalOrders={orders?.length ?? 0}
        format={format}
      />

      <div className="grid gap-8 md:grid-cols-2">
        <DeliversTo address={defaultAddress} />
        <SavedPieces pieces={saved} total={wishlistCount} />
      </div>

      <Link
        to="/account/settings"
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-espresso-soft transition-colors hover:text-gold-700"
      >
        Account settings
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}
