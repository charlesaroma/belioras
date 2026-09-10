/* Result Grid And Empty State */
import { Link } from "react-router-dom";

export default function SearchPanelResults({
  results,
  trimmed,
  notFound,
  format,
  onNavigate,
  onViewAll,
}) {
  return (
    <div>
      <p
        aria-live="polite"
        className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-espresso"
      >
        {trimmed ? `Results for “${trimmed}”` : "Featured"}
      </p>

      {notFound ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center bg-ivory-500 px-6 text-center">
          <p className="text-sm text-espresso-soft">Nothing matches “{trimmed}”.</p>
          <Link
            to="/shop"
            onClick={onNavigate}
            className="mt-4 text-[11px] uppercase tracking-widest text-gold-700 underline underline-offset-4 transition-colors hover:text-espresso"
          >
            Browse the collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          {results.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              onClick={onNavigate}
              className="group block"
            >
              <div className="aspect-[3/4] overflow-hidden bg-ivory-300">
                <img
                  src={product.images?.[0]}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-sm text-espresso transition-colors group-hover:text-gold-700">
                {product.name}
              </p>
              <p className="text-sm text-espresso-soft">{format(product.price)}</p>
            </Link>
          ))}
        </div>
      )}

      {trimmed && !notFound && (
        <button
          type="button"
          onClick={onViewAll}
          className="mt-8 text-[11px] uppercase tracking-widest text-gold-700 transition-colors hover:text-espresso"
        >
          View all results for “{trimmed}” →
        </button>
      )}
    </div>
  );
}
