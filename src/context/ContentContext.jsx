/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

import * as contentStore from "../services/contentStore";

const ContentContext = createContext(null);

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

export function useContentVersion() {
  return useSyncExternalStore(
    contentStore.subscribe,
    contentStore.getVersion,
    contentStore.getVersion,
  );
}
