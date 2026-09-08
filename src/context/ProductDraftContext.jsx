import { createContext, useCallback, useContext, useMemo } from "react";

import { useLocalStorage } from "../hooks/useLocalStorage";

const ProductDraftContext = createContext(null);

const STORAGE_KEY = "belioras:draft:product";

/** updatedAt changes by definition, so it is excluded from the comparison. */
function sameExceptTimestamp(a, b) {
  const strip = (draft) => {
    const rest = { ...draft };
    delete rest.updatedAt;
    return JSON.stringify(rest);
  };
  return strip(a) === strip(b);
}

/**
 * In-progress product uploads, held above the router.
 *
 * The requirement: open the upload modal, close it or navigate away, and the
 * work keeps going in a corner rather than being thrown out.
 *
 * That means the state cannot live in the form, or in the dashboard layout —
 * leaving /dashboard for the storefront would unmount either one. It sits in
 * AppProviders, outside BrowserRouter, so no navigation can touch it, and is
 * mirrored to localStorage so a reload does not lose it either.
 *
 * Keyed rather than a single slot, so an admin can have more than one draft
 * going and the dock can stack them.
 */
export function ProductDraftProvider({ children }) {
  const [drafts, setDrafts] = useLocalStorage(STORAGE_KEY, {});

  const startDraft = useCallback(
    (key, data) => {
      setDrafts((prev) => {
        const existing = prev[key];
        // Replace rather than merge: a cleared field or a removed image has to
        // actually disappear from the draft, which a shallow merge would keep.
        const next = { ...data, key, updatedAt: Date.now() };

        // Bail out when nothing meaningful changed. This runs from an effect
        // watching the whole form, so writing an identical object would
        // re-render every consumer on each keystroke. updatedAt is excluded
        // from the comparison because it changes by definition.
        if (existing && sameExceptTimestamp(existing, next)) return prev;
        return { ...prev, [key]: next };
      });
    },
    [setDrafts],
  );

  const updateDraft = useCallback(
    (key, patch) => {
      setDrafts((prev) => (prev[key] ? { ...prev, [key]: { ...prev[key], ...patch } } : prev));
    },
    [setDrafts],
  );

  const clearDraft = useCallback(
    (key) => {
      setDrafts((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [setDrafts],
  );

  const draftFor = useCallback((key) => drafts[key] ?? null, [drafts]);

  const value = useMemo(
    () => ({
      drafts: Object.values(drafts),
      startDraft,
      updateDraft,
      clearDraft,
      draftFor,
    }),
    [drafts, startDraft, updateDraft, clearDraft, draftFor],
  );

  return <ProductDraftContext.Provider value={value}>{children}</ProductDraftContext.Provider>;
}

export function useProductDraft() {
  const ctx = useContext(ProductDraftContext);
  if (!ctx) throw new Error("useProductDraft must be used within ProductDraftProvider");
  return ctx;
}
