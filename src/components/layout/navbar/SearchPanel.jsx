/* Layout Component: SearchPanel */
import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Search, X } from "lucide-react";

import { useAsyncData } from "../../../hooks/useAsyncData";
import { useContentVersion } from "../../../context/ContentContext";
import { useCurrency } from "../../../context/CurrencyContext";
import { useLanguage } from "../../../context/LanguageContext";
import { getProducts } from "../../../services/productsApi";
import { getTaxonomy } from "../../../services/navigationApi";
import { COLOR_NAME_TO_TAXONOMY } from "../../../utils/constants";
import { cn } from "../../../utils/cn";

import SearchPanelImageSearch from "./searchPanel/SearchPanelImageSearch";
import SearchPanelFacets from "./searchPanel/SearchPanelFacets";
import SearchPanelResults from "./searchPanel/SearchPanelResults";
import { useSearchPanelDismiss } from "./searchPanel/useSearchPanelDismiss";
import {
  nameSuggestions,
  searchResults,
  stockedColours,
  stockedSizes,
} from "./searchPanel/searchPanelQuery";

// A band beneath the header rather than a results page, so a shopper can look
// something up and carry on without losing their place. It reads the
// --header-height the navbar publishes, so it cannot drift out of sync.
export default function SearchPanel({ open, onClose, query, onQueryChange }) {
  const navigate = useNavigate();
  const { format } = useCurrency();
  const { t } = useLanguage();

  const { data: products } = useAsyncData(getProducts, []);
  const version = useContentVersion();
  const { data: taxonomy } = useAsyncData(getTaxonomy, [version]);

  const [imageSearchOpen, setImageSearchOpen] = useState(false);
  const [colours, setColours] = useState([]);
  const [sizes, setSizes] = useState([]);

  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const restoreFocusRef = useRef(null);

  const catalog = useMemo(() => products ?? [], [products]);
  const trimmed = query.trim();

  const close = useCallback(() => {
    onQueryChange("");
    setColours([]);
    setSizes([]);
    onClose?.();
  }, [onClose, onQueryChange]);

  useSearchPanelDismiss({ open, onDismiss: close, panelRef, inputRef, restoreFocusRef });

  const colourSwatches = useMemo(
    () => stockedColours(catalog, taxonomy, COLOR_NAME_TO_TAXONOMY),
    [catalog, taxonomy],
  );
  const sizeChips = useMemo(() => stockedSizes(catalog), [catalog]);
  const results = useMemo(
    () => searchResults(catalog, trimmed, colours, sizes, COLOR_NAME_TO_TAXONOMY),
    [catalog, trimmed, colours, sizes],
  );
  const suggestions = useMemo(() => nameSuggestions(results, trimmed), [results, trimmed]);

  const toggle = (setter) => (value) =>
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  const submit = () => {
    if (!trimmed) return;
    navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
    close();
  };

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
      style={{ top: "var(--header-height, 138px)" }}
    >
      <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
        <div className="flex items-center gap-4">
          {/* The navbar carries the field at lg and up; duplicating it here
              would put two search boxes on screen at once. */}
          <div className="flex flex-1 items-center gap-3 border border-umber-100 px-4 focus-within:border-espresso lg:hidden">
            <Search className="size-4 shrink-0 text-espresso/40" aria-hidden="true" />
            <label className="sr-only" htmlFor="site-search">
              Search the collection
            </label>
            <input
              id="site-search"
              ref={inputRef}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder={t("common.searchPlaceholder", "Search the collection…")}
              className="min-h-11 flex-1 bg-transparent text-sm tracking-wide text-espresso outline-none placeholder:text-espresso/35"
            />
          </div>

          <span className="hidden flex-1 lg:block" />

          <button
            type="button"
            onClick={() => setImageSearchOpen(true)}
            className="flex min-h-11 shrink-0 items-center gap-1.5 px-1 text-[11px] uppercase tracking-widest text-espresso-soft transition-colors hover:text-espresso"
          >
            <Camera className="size-4" strokeWidth={1.5} aria-hidden="true" />
            <span className="hidden sm:inline">Photo</span>
          </button>

          <button
            type="button"
            onClick={close}
            className="flex min-h-11 shrink-0 items-center gap-1.5 px-1 text-[11px] uppercase tracking-widest text-espresso-soft transition-colors hover:text-espresso"
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
                onClick={() => onQueryChange(s)}
                className="text-sm text-espresso-soft underline underline-offset-4 transition-colors hover:text-gold-700"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-[200px_1fr]">
          <SearchPanelFacets
            colourSwatches={colourSwatches}
            colours={colours}
            onToggleColour={toggle(setColours)}
            sizeChips={sizeChips}
            sizes={sizes}
            onToggleSize={toggle(setSizes)}
          />

          <SearchPanelResults
            results={results}
            trimmed={trimmed}
            notFound={Boolean(trimmed) && results.length === 0}
            format={format}
            onNavigate={close}
            onViewAll={submit}
          />
        </div>
      </div>

      <SearchPanelImageSearch
        open={imageSearchOpen}
        onClose={() => setImageSearchOpen(false)}
      />
    </div>
  );
}
