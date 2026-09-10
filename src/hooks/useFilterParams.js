import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Filter state, held in the URL rather than in component state.
 *
 * This is the piece everything else depends on. Keeping filters in the query
 * string means a filtered view can be shared and bookmarked ("burgundy satin
 * gowns under €300"), the browser back button steps through refinements the
 * way shoppers expect, and — most importantly — a mega-menu link and a filter
 * selection become the same operation rather than two vocabularies for it.
 *
 * Shape:  ?occasion=party,gala&color=black&min=100&max=400&sale=1&sort=price-low
 *
 * Multi-value dimensions are comma-joined rather than repeated keys: it reads
 * better when a customer sees or pastes the link, which is the whole point.
 */

/** Reserved keys are everything that is not a taxonomy dimension. */
const PRICE_MIN = "min";

/* PRICE MAX */
const PRICE_MAX = "max";

const SALE = "sale";

const SORT = "sort";

const QUERY = "q";

const RESERVED = new Set([PRICE_MIN, PRICE_MAX, SALE, SORT, QUERY]);

/* use Filter Params */
export function useFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {

    const dimensions = {};
    for (const [key, value] of searchParams.entries()) {
      if (RESERVED.has(key) || !value) continue;
      dimensions[key] = value.split(",").filter(Boolean);
    }

    const min = searchParams.get(PRICE_MIN);

    const max = searchParams.get(PRICE_MAX);

    return {
      dimensions,
      price: {
        min: min === null ? null : Number(min),
        max: max === null ? null : Number(max),
      },
      onSale: searchParams.get(SALE) === "1",
      sort: searchParams.get(SORT) ?? "newest",
      query: searchParams.get(QUERY) ?? "",
    };
  }, [searchParams]);

  /**
   * Writes params, dropping any that are empty so the URL stays readable —
   * a bar full of `&fabric=&color=` is noise the customer sees.
   *
   * `replace` is used for continuous controls like the price slider, so
   * dragging it does not stack fifty entries into the back button.
   */

  const commit = useCallback(
    (mutate, { replace = false } = {}) => {
      setSearchParams(
        (prev) => {

          const next = new URLSearchParams(prev);
          mutate(next);
          for (const [key, value] of [...next.entries()]) {
            if (!value) next.delete(key);
          }
          return next;
        },
        { replace, preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  const toggleValue = useCallback(
    (dimension, value) => {
      commit((params) => {

        const current = (params.get(dimension) ?? "").split(",").filter(Boolean);

        const next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        params.set(dimension, next.join(","));
      });
    },
    [commit],
  );

/* clear Dimension */
  const clearDimension = useCallback(
    (dimension) => commit((params) => params.delete(dimension)),
    [commit],
  );

  const setPrice = useCallback(
    ([min, max], bounds) => {
      commit(
        (params) => {
          // Only record a bound that actually narrows the set, so resetting the
          // slider to its extents leaves a clean URL rather than a redundant one.
          params.set(PRICE_MIN, bounds && min <= bounds[0] ? "" : String(min));
          params.set(PRICE_MAX, bounds && max >= bounds[1] ? "" : String(max));
        },
        { replace: true },
      );
    },
    [commit],
  );

  const setSale = useCallback(
    (on) => commit((params) => params.set(SALE, on ? "1" : "")),
    [commit],
  );

  const setQuery = useCallback(
    (value) => commit((params) => params.set(QUERY, value ?? "")),
    [commit],
  );

  const setSort = useCallback(
    (value) => commit((params) => params.set(SORT, value === "newest" ? "" : value)),
    [commit],
  );

  /** Clears filters but keeps sort and search — those are not refinements. */
  const clearAll = useCallback(() => {
    commit((params) => {
      for (const key of [...params.keys()]) {
        if (key !== SORT && key !== QUERY) params.delete(key);
      }
    });
  }, [commit]);

  const activeCount = useMemo(
    () =>
      Object.values(filters.dimensions).reduce((n, values) => n + values.length, 0) +
      (filters.onSale ? 1 : 0) +
      (filters.price.min !== null || filters.price.max !== null ? 1 : 0),
    [filters],
  );

  return {
    filters,
    activeCount,
    toggleValue,
    clearDimension,
    setPrice,
    setSale,
    setSort,
    setQuery,
    clearAll,
  };
}
