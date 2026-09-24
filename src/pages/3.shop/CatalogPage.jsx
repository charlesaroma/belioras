/* Page: Shop - CatalogPage */
import { useCallback } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { useAsyncData } from "../../hooks/useAsyncData";
import { useContentVersion } from "../../context/ContentContext";
import { getCatalog } from "../../services/catalog/catalogApi";
import NotFound from "../../components/layout/NotFound";
import Seo from "../../components/seo/Seo";
import { SITE_URL } from "../../seo/head";
import { catalogSeo } from "../../seo/seo";

import CatalogView from "./sections/CatalogView";

export default function CatalogPage() {
  const { pathname } = useLocation();

  const version = useContentVersion();

  const fetchCatalog = useCallback(() => getCatalog(pathname), [pathname]);
  const { data, loading, error } = useAsyncData(fetchCatalog, [pathname, version]);

  if (data?.redirectTo) return <Navigate to={data.redirectTo} replace />;

  // Hold the previous frame while the next path resolves rather than flashing
  // a 404 between routes.
  if (!loading && data && !data.valid) return <NotFound />;

  const resolved = data?.resolved;

  return (
    <>
    {resolved && (
      // Filters and sort live in the query string; the page itself is the path.
      <Seo {...catalogSeo(SITE_URL, { path: pathname.replace(/\/+$/, ""), label: resolved.label, trail: resolved.breadcrumb })} />
    )}
    <CatalogView
      products={data?.products}
      loading={loading}
      error={error}
      header={{
        title: resolved?.label ?? "Collection",
        breadcrumb: resolved?.breadcrumb ?? [],
      }}
      emptyState={
        resolved ? (
          <div className="container-main py-section-mobile text-center md:py-section-tablet">
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
    </>
  );
}
