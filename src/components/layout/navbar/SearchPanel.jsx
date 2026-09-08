import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

import { useAsyncData } from "../../../hooks/useAsyncData";
import { useCurrency } from "../../../context/CurrencyContext";
import { useLanguage } from "../../../context/LanguageContext";
import { getProducts } from "../../../services/productsApi";
import { getTaxonomy } from "../../../services/navigationApi";
import { COLOR_NAME_TO_TAXONOMY } from "../../../utils/constants";
import { cn } from "../../../utils/cn";

const DEFAULT_RESULTS = 6;

/**
 * Full-width search panel, in the pattern from the design prototype: the
 * header opens a band beneath itself rather than routing to a results page,
 * so a shopper can look something up and carry on without losing their place.
 *
 * Facets are derived from the catalog actually loaded, not from the taxonomy
 * wholesale — offering a colour nothing in stock carries is a dead end.
 *
 * Where the prototype tracked the header's position with a scroll listener and
 * getBoundingClientRect, this reads the --header-height the navbar already
 * publishes: one measurement, no listener, and it cannot drift out of sync.
 */
export default function SearchPanel({ open, onClose }) {
  const navigate = useNavigate();
  const { format } = useCurrency();
  const { t } = useLanguage();

  const { data: products } = useAsyncData(getProducts, []);
  const { data: taxonomy } = useAsyncData(getTaxonomy, []);

  const [query, setQuery] = useState("");
  const [colours, setColours] = useState([]);
  const [sizes, setSizes] = useState([]);

  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const restoreFocusRef = useRef(null);

  const catalog = useMemo(() => products ?? [], [products]);
  const trimmed = query.trim();

  const close = useCallback(() => {
    setQuery("");
    setColours([]);
    setSizes([]);
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;

    restoreFocusRef.current = document.activeElement;
    inputRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    const onPointerDown = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) close();
    };

    document.addEventListener("keydown", onKeyDown);
    // pointerdown rather than click: a click that starts inside the panel and
    // ends outside it should not count as clicking away.
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      restoreFocusRef.current?.focus?.();
    };
  }, [open, close]);

  /** Swatches for colours the catalog actually stocks, in taxonomy order. */
  const colourSwatches = useMemo(() => {
    const stocked = new Set(
      catalog.flatMap((p) => (p.colors ?? []).map((c) => COLOR_NAME_TO_TAXONOMY[c]).filter(Boolean)),
    );
    return (taxonomy?.color?.values ?? []).filter((v) => stocked.has(v.id));
  }, [catalog, taxonomy]);

  const sizeChips = useMemo(() => {
    const stocked = new Set(catalog.flatMap((p) => p.sizes ?? []));
    // "default" is the placeholder carried by one-size pieces, not a size.
    return [...stocked].filter((s) => s && s !== "default");
  }, [catalog]);

  const results = useMemo(() => {
    const base = trimmed
      ? catalog.filter((p) =>
          `${p.name} ${p.description ?? ""}`.toLowerCase().includes(trimmed.toLowerCase()),
        )
      : catalog.slice(0, DEFAULT_RESULTS);

    return base
      .filter((p) =>
        colours.length === 0
          ? true
          : (p.colors ?? []).some((c) => colours.includes(COLOR_NAME_TO_TAXONOMY[c])),
      )
      .filter((p) => (sizes.length === 0 ? true : (p.sizes ?? []).some((s) => sizes.includes(s))))
      .slice(0, 12);
  }, [catalog, trimmed, colours, sizes]);

  const suggestions = useMemo(() => {
    if (!trimmed) return [];
    return [...new Set(results.map((p) => p.name))].slice(0, 4);
  }, [results, trimmed]);

  const toggle = (setter) => (value) =>
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  const submit = () => {
    if (!trimmed) return;
    navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
    close();
  };

  const notFound = trimmed && results.length === 0;

  return (
    <div
      ref={panelRef}
      role="search"
      aria-hidden={!open}
      inert={!open || undefined}
      className={cn(
        "surface-header fixed inset-x-0 z-40 max-h-[85vh] overflow-y-auto border-b border-umber-50 shadow-large",
        "transition-all duration-300 ease-out motion-reduce:transition-none",
        open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
      )}
      // Sits directly beneath the header, using the height it measures itself.
      style={{ top: "var(--header-height, 138px)" }}
    >
      <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
        <div className="flex items-center gap-4">
          <div className="flex flex-1 items-center gap-3 border border-umber-100 px-4 py-3 focus-within:border-espresso">
            <Search className="size-4 shrink-0 text-espresso/40" aria-hidden="true" />
            <label className="sr-only" htmlFor="site-search">
              Search the collection
            </label>
            <input
              id="site-search"
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder={t("common.searchPlaceholder", "Search the collection…")}
              className="flex-1 bg-transparent py-0.5 text-sm tracking-wide text-espresso outline-none placeholder:text-espresso/35"
            />
          </div>

          <button
            type="button"
            onClick={close}
            className="flex shrink-0 items-center gap-1.5 text-[11px] uppercase tracking-widest text-espresso-soft transition-colors hover:text-espresso"
          >
            <X className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-umber-50 py-4 text-sm">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-espresso">
              Suggestions
            </span>
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="text-sm text-espresso-soft underline underline-offset-4 transition-colors hover:text-gold-700"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-[200px_1fr]">
          <div className="flex flex-row gap-10 lg:flex-col lg:gap-8">
            {colourSwatches.length > 0 && (
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-espresso">
                  Colour
                </p>
                <div className="flex max-w-[180px] flex-wrap gap-2">
                  {colourSwatches.map((c) => {
                    const active = colours.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggle(setColours)(c.id)}
                        aria-pressed={active}
                        aria-label={c.name}
                        title={c.name}
                        className={cn(
                          "size-7 border transition-all",
                          active
                            ? "border-transparent ring-2 ring-espresso ring-offset-1"
                            : "border-umber-100 hover:border-espresso/40",
                        )}
                        style={{ backgroundColor: c.hex }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {sizeChips.length > 0 && (
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-espresso">
                  Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizeChips.map((s) => {
                    const active = sizes.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggle(setSizes)(s)}
                        aria-pressed={active}
                        className={cn(
                          "flex h-8 min-w-[34px] items-center justify-center border px-2 text-xs uppercase transition-all",
                          active
                            ? "border-espresso bg-espresso text-ivory-50"
                            : "border-umber-100 text-espresso-soft hover:border-espresso",
                        )}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div>
            <p
              aria-live="polite"
              className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-espresso"
            >
              {trimmed ? `Results for “${trimmed}”` : "Featured"}
            </p>

            {notFound ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center bg-ivory-500 px-6 text-center">
                <p className="text-sm text-espresso-soft">
                  Nothing matches “{trimmed}”.
                </p>
                <Link
                  to="/shop"
                  onClick={close}
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
                    onClick={close}
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
                onClick={submit}
                className="mt-8 text-[11px] uppercase tracking-widest text-gold-700 transition-colors hover:text-espresso"
              >
                View all results for “{trimmed}” →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
