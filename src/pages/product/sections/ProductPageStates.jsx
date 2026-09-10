/* Loading And Not Found */
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

export function ProductPageLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="size-6 animate-spin text-gold-600" aria-label="Loading" />
    </div>
  );
}

export function ProductPageNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-32 text-center">
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
