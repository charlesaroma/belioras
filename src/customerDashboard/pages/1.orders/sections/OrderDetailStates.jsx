/* Customer Dashboard Page: Orders - OrderDetailStates */
import { Link } from "react-router-dom";
import { ArrowLeft, PackageX } from "lucide-react";

/* Order Skeleton */
export function OrderSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="h-4 w-40 animate-pulse rounded bg-brown-50" />
      <div className="animate-pulse rounded-2xl border border-umber-50 bg-white p-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="mb-4 flex gap-4">
            <div className="size-16 rounded-xl bg-brown-50" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-2/3 rounded bg-brown-50" />
              <div className="h-3 w-1/3 rounded bg-brown-50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Order Not Found */
export function OrderNotFound() {
  return (
    <div className="rounded-2xl border border-umber-50 bg-white px-6 py-16 text-center">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-rose-50 text-rose-700">
        <PackageX className="size-6" aria-hidden="true" />
      </span>
      <h2 className="mt-5 font-display text-xl font-medium tracking-wide">Order not found</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-espresso-soft">
        We could not find this order. It may have been removed, or the link may be incorrect.
      </p>
      <Link
        to="/account/orders"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 text-sm font-medium text-ivory-50 transition-colors duration-200 hover:bg-umber-500 active:scale-[0.98]"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to orders
      </Link>
    </div>
  );
}
