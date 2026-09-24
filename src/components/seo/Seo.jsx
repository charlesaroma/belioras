/* SEO Component: a page's title, description and structured data */
import { useEffect } from "react";

import { applyHead } from "../../seo/head";

/**
 * Renders nothing; sets the head for the page it sits in. Rendered only once
 * the page's data has loaded, so a half-loaded page never claims a title.
 * Meta objects are rebuilt on each render, hence the serialised dependency.
 */
export default function Seo(meta) {
  const key = JSON.stringify(meta);
  useEffect(() => {
    applyHead(JSON.parse(key));
  }, [key]);
  return null;
}
