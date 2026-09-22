import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * List filters kept in the address, `?category=dresses,shoes&color=black`, so a
 * filtered view can be bookmarked or shared and Back returns to it.
 *
 * `keys` are the multi-value groups; `defaults` are single values such as a
 * status tab, left out of the address while they hold their default. History
 * is replaced rather than pushed, so ticking boxes does not fill Back.
 */
export function useUrlFilters(keys, defaults = {}) {
  const [params, setParams] = useSearchParams();
  const search = params.toString();
  const keyList = keys.join(",");
  const defaultList = JSON.stringify(defaults);

  const { filters, values } = useMemo(() => {
    const read = new URLSearchParams(search);
    const fallback = JSON.parse(defaultList);
    return {
      filters: readFilters(read, keyList),
      values: Object.fromEntries(Object.entries(fallback).map(([k, v]) => [k, read.get(k) ?? v])),
    };
  }, [search, keyList, defaultList]);

  // The address as last written. The router hands an updater the address of
  // the last render, so two ticks before a re-render each started from the
  // same one and the second undid the first; this starts each from the newest.
  const latest = useRef(search);
  useEffect(() => {
    latest.current = search;
  }, [search]);

  // `patch` may be a function of the current filters.
  const write = useCallback(
    (patch) => {
      const fallback = JSON.parse(defaultList);
      const next = new URLSearchParams(latest.current);
      const resolved = typeof patch === "function" ? patch(readFilters(next, keyList)) : patch;
      for (const [k, v] of Object.entries(resolved)) {
        const text = Array.isArray(v) ? v.join(",") : v;
        if (text && text !== fallback[k]) next.set(k, text);
        else next.delete(k);
      }
      latest.current = next.toString();
      setParams(next, { replace: true });
    },
    [setParams, defaultList, keyList],
  );

  // Every group is written, so "Clear all" (an empty object) clears them all.
  // Accepts a value or, like a state setter, a function of the current filters.
  const setFilters = useCallback(
    (next) =>
      write((current) => {
        const resolved = typeof next === "function" ? next(current) : next;
        return Object.fromEntries(keyList.split(",").map((k) => [k, resolved[k] ?? []]));
      }),
    [write, keyList],
  );
  const setValue = useCallback((k, v) => write({ [k]: v }), [write]);

  return { filters, setFilters, values, setValue };
}

function readFilters(params, keyList) {
  return Object.fromEntries(keyList.split(",").map((k) => [k, params.get(k)?.split(",").filter(Boolean) ?? []]));
}
