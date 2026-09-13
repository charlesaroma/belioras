/* Preload Images */
import { useEffect } from "react";

/**
 * Starts downloading photographs the page is about to need.
 *
 * A colour swatch points the gallery at a photograph the browser has never
 * fetched, so each first click showed an empty frame while it downloaded.
 * Fetching every colourway's lead photograph as the page opens makes the
 * switch immediate.
 */
export function usePreloadImages(urls) {
  const key = urls.join("|");

  useEffect(() => {
    if (!key) return;
    for (const src of key.split("|")) {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    }
  }, [key]);
}
