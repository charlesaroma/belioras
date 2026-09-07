/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

import * as contentStore from "../services/contentStore";

const ContentContext = createContext(null);

/**
 * Thin React binding over the content store.
 *
 * The Dashboard uses `update` / `reset` to mutate content. The storefront only
 * ever reads `version` — a number it passes into useAsyncData's deps so its
 * service call re-runs after an edit. Storefront components never read content
 * through this context; they go through src/services as usual.
 */
export function ContentProvider({ children }) {
  const version = useSyncExternalStore(
    contentStore.subscribe,
    contentStore.getVersion,
    contentStore.getVersion,
  );

  const update = useCallback((domain, updater) => contentStore.setState(domain, updater), []);
  const reset = useCallback((domain) => contentStore.resetDomain(domain), []);
  const read = useCallback((domain) => contentStore.getState(domain), []);

  const value = useMemo(() => ({ version, update, reset, read }), [version, update, reset, read]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}

/**
 * Content revision counter for useAsyncData deps:
 *   const version = useContentVersion();
 *   const { data } = useAsyncData(getHeroSlides, [version]);
 *
 * This is the only coupling between the storefront and the content layer, and
 * it carries no content — just a number that changes when something was edited.
 */
export function useContentVersion() {
  return useSyncExternalStore(
    contentStore.subscribe,
    contentStore.getVersion,
    contentStore.getVersion,
  );
}
