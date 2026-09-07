import { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { useAsyncData } from "../../hooks/useAsyncData";
import { useContentVersion } from "../../context/ContentContext";
import { getCatalog } from "../../services/catalogApi";
import NotFound from "../../components/layout/NotFound";

import CatalogView from "./sections/CatalogView";

/**
 * Every category route — /shop/occasion/party, /hair/wigs/straight,
 * /accessories/bags/clutch, and the bare roots.
 *
 * Mounted behind splat routes so it handles all three URL depths present in the
 * navigation data without the router enumerating dimensions. Validity comes
 * from the navigation tree itself (see catalogApi), so a path the mega menu
 * links to can never 404, and an invented one always does.
 */
export default function CatalogPage() {
  const { pathname } = useLocation();
  const version = useContentVersion();

  const fetchCatalog = useCallback(() => getCatalog(pathname), [pathname]);
  const { data, loading, error } = useAsyncData(fetchCatalog, [pathname, version]);

  // Hold the previous frame while the next path resolves rather than flashing
  // a 404 between routes.
  if (!loading && data && !data.valid) return <NotFound />;

  const resolved = data?.resolved;

  return (
    <CatalogView
      products={data?.products}
      loading={loading}
      error={error}
      showCategoryTabs={false}
      header={{
        eyebrow: resolved?.rootLabel ?? "The Belioras Edit",
        title: resolved?.label ?? "Collection",
        subtitle: null,
        breadcrumb: resolved?.breadcrumb ?? [],
      }}
      emptyState={
        resolved ? (
          <div className="container-main px-4 py-section-mobile text-center md:py-section-tablet">
            <p className="eyebrow">Coming soon</p>
            <h2 className="mt-3 font-display text-2xl text-espresso md:text-3xl">
              This edit is being curated
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-espresso-soft">
              We&rsquo;re finishing the {resolved.label.toLowerCase()} selection. In the meantime,
              the rest of the collection is ready for you.
            </p>
            <Link
              to={resolved.rootUrl}
              className="btn btn-md btn-primary mt-8 inline-flex"
            >
              Browse all {resolved.rootLabel.toLowerCase()}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        ) : null
      }
    />
  );
}
