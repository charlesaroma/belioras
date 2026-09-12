/* Customer Dashboard Page: Profile - profile */
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { useCustomerAuth } from "@/context/auth/useAuthRealm";
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

/* PREVIEW COUNT */
const PREVIEW_COUNT = 4;

export default function Profile() {
  const { user } = useCustomerAuth();
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
