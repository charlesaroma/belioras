import { Link } from "react-router-dom";
import { ArrowRight, Heart, MapPin, Package } from "lucide-react";

import Avatar from "../../components/account/Avatar";
import OrderTimeline from "../../components/account/OrderTimeline";
import StatusChip from "../../components/ui/StatusChip";
import EmptyState from "../../components/ui/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useScopedStorage } from "../../hooks/useScopedStorage";
import { getOrders } from "../../services/ordersApi";
import { getProducts } from "../../services/productsApi";
import { isOffTimeline } from "../../utils/orderStatus";

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
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Who you are */}
      <section className="flex flex-wrap items-center gap-4 border-b border-umber-50 pb-6">
        <Avatar user={user} size="lg" />
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl tracking-wide text-espresso">{user?.name}</h2>
          <p className="mt-0.5 text-[13px] text-espresso-soft">{user?.email}</p>
        </div>
        <dl className="flex gap-8">
          <Stat label="Orders" value={ordersLoading ? "—" : (orders?.length ?? 0)} />
          <Stat label="Saved" value={wishlistCount} />
          <Stat
            label="Member since"
            value={user?.createdAt ? new Date(user.createdAt).getFullYear() : "—"}
          />
        </dl>
      </section>

      {/* Where your order is */}
      <section>
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-xl tracking-wide text-espresso">Latest order</h2>
          {(orders?.length ?? 0) > 1 && (
            <Link to="/account/orders" className="eyebrow hover:opacity-70">
              All orders
            </Link>
          )}
        </div>

        {ordersLoading ? (
          <div className="skeleton h-32 w-full" />
        ) : !latest ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="When you order, this is where you will follow it."
            action={{ label: "Browse the collection", to: "/shop" }}
          />
        ) : (
          <Link
            to={`/account/orders/${latest.id}`}
            className="block border border-umber-50 p-5 transition-colors hover:border-espresso/25"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium tabular-nums text-espresso">{latest.id}</p>
                <p className="mt-0.5 text-[12px] text-espresso-soft">
                  {(latest.items ?? []).length}{" "}
                  {(latest.items ?? []).length === 1 ? "piece" : "pieces"} ·{" "}
                  {format(latest.total)}
                </p>
              </div>
              <StatusChip status={latest.status} />
            </div>

            {isOffTimeline(latest.status) ? (
              <p className="mt-4 text-[13px] text-espresso-soft">
                This order is closed. Open it for the details.
              </p>
            ) : (
              <OrderTimeline status={latest.status} bordered={false} className="mt-4" />
            )}
          </Link>
        )}
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Where it goes */}
        <section>
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-xl tracking-wide text-espresso">Delivers to</h2>
            <Link to="/account/addresses" className="eyebrow hover:opacity-70">
              Manage
            </Link>
          </div>

          {defaultAddress ? (
            <address className="border border-umber-50 p-5 text-[13px] not-italic leading-relaxed text-espresso-soft">
              <span className="block font-medium text-espresso">{defaultAddress.recipient}</span>
              {defaultAddress.line1}
              <br />
              {defaultAddress.city} {defaultAddress.postcode}
              <br />
              {defaultAddress.country}
            </address>
          ) : (
            <EmptyState
              icon={MapPin}
              title="No address saved"
              description="Add one and checkout becomes a step shorter."
              action={{ label: "Add an address", to: "/account/addresses" }}
            />
          )}
        </section>

        {/* What you kept */}
        <section>
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-xl tracking-wide text-espresso">Saved pieces</h2>
            {wishlistCount > 0 && (
              <Link to="/account/wishlist" className="eyebrow hover:opacity-70">
                All {wishlistCount}
              </Link>
            )}
          </div>

          {saved.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Nothing saved yet"
              description="Tap the heart on any piece to keep it here."
              action={{ label: "Discover the collection", to: "/shop" }}
            />
          ) : (
            <ul className="grid grid-cols-4 gap-2">
              {saved.map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/product/${product.slug}`}
                    className="block border border-umber-50 transition-opacity hover:opacity-80"
                  >
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      loading="lazy"
                      className="aspect-[3/4] w-full object-cover"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
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

function Stat({ label, value }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.18em] text-espresso-soft">{label}</dt>
      <dd className="mt-1 font-display text-2xl tabular-nums text-espresso">{value}</dd>
    </div>
  );
}
