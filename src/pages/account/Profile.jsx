import { Link } from "react-router-dom";
import { MapPin, Package, ShoppingBag } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { getOrders } from "../../services/ordersApi";

const QUICK_LINKS = [
  { to: "/account/orders", label: "Orders", description: "Track and review past orders", icon: Package },
  { to: "/account/addresses", label: "Addresses", description: "Manage delivery addresses", icon: MapPin },
  { to: "/account/wishlist", label: "Wishlist", description: "Items you have saved", icon: ShoppingBag },
];

export default function Profile() {
  const { user } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const { data: orders, loading } = useAsyncData(() => getOrders(user?.id), [user?.id]);

  const firstName = (user?.name ?? "").split(" ")[0] || "there";
  const roleLabel = user?.role === "super-admin" ? "Administrator" : user?.role === "staff" ? "Staff" : "Customer";

  return (
    <div className="space-y-6">
      <section
        className="rounded-2xl border border-umber-50 bg-white p-6 sm:p-8"
        aria-labelledby="profile-greeting"
      >
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gold-500 text-xl font-semibold text-espresso">
            {(user?.name ?? user?.email ?? "U").slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <h1 id="profile-greeting" className="font-display text-2xl font-medium tracking-wide">
              Welcome back, {firstName}
            </h1>
            <p className="mt-0.5 text-sm text-espresso-soft">{user?.email}</p>
          </div>
          <span className="rounded-full bg-brown-50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-gold-700">
            {roleLabel}
          </span>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-umber-50 pt-6 sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wider text-espresso-soft">Orders</dt>
            <dd className="mt-1 text-2xl font-semibold text-espresso">
              {loading ? "—" : (orders?.length ?? 0)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-espresso-soft">Wishlist</dt>
            <dd className="mt-1 text-2xl font-semibold text-espresso">{wishlistCount}</dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-xs uppercase tracking-wider text-espresso-soft">Member since</dt>
            <dd className="mt-1 text-2xl font-semibold text-espresso">2026</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="quick-links-title" className="grid gap-4 sm:grid-cols-3">
        <h2 id="quick-links-title" className="sr-only">
          Quick links
        </h2>
        {QUICK_LINKS.map(({ to, label, description, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-2xl border border-umber-50 bg-white p-5 transition-colors hover:border-gold-500/60"
          >
            <Icon
              className="size-5 text-gold-700"
              aria-hidden="true"
            />
            <p className="mt-3 font-semibold text-espresso group-hover:text-gold-700">{label}</p>
            <p className="mt-1 text-sm text-espresso-soft">{description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}