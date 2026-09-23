/* Loading And Not Found */
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

export function ProductPageLoading() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      style={{ paddingTop: "var(--header-height, 138px)" }}
    >
      <Loader2 className="size-6 animate-spin text-gold-600" aria-label="Loading" />
    </div>
  );
}

export function ProductPageNotFound() {
  return (
    <div
      className="mx-auto max-w-3xl px-6 pb-32 text-center"
      // Offsets by the header's measured height, same as the loaded product
      // page — this state returns before that page's own wrapper is reached,
      // so without this it sat flush under the fixed navbar.
      style={{ paddingTop: "calc(var(--header-height, 138px) + 4rem)" }}
    >
      <h1 className="font-display text-3xl text-espresso">Piece not found</h1>
      <p className="mt-3 text-sm text-espresso-soft">
        It may have sold out or been retired from the collection.
      </p>
      <Link
        to="/shop"
        className="mt-6 inline-block text-[11px] uppercase tracking-widest text-gold-600 transition-colors hover:text-gold-700"
      >
        ← Back to the shop
      </Link>
    </div>
  );
}
