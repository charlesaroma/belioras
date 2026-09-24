# 13 — SEO: Titles, Structured Data, Sitemap

Every public page gives search engines and link previews its own title, description, canonical address, preview image and structured data. The same code runs in the browser and at build time, so the two can't disagree.

## How it works

| Piece | Where | What it does |
|---|---|---|
| Page descriptions | `src/seo/seo.js` | Pure functions, no imports. `STATIC_PAGES` covers fixed pages. `homeSeo`, `catalogSeo` and `productSeo` build the rest. `headTags` turns a page's meta into tags. |
| In the browser | `src/seo/head.js`, `components/seo/RouteSeo.jsx`, `components/seo/Seo.jsx` | `RouteSeo` (in `App.jsx`, before `<Routes>`) sets fixed pages, marks private areas noindex and resets anything else to the defaults. The product page, catalogue page and both 404s render `<Seo … />` once their data has loaded. Every tag carries `data-seo`, and each change replaces the whole set. |
| At build | `scripts/seo/vitePluginSeo.js` (registered in `vite.config.js`) | Writes one HTML file per public page (`dist/product/<slug>.html`, `dist/dresses/…/mini-dresses.html` and so on) with that page's tags filled in, plus `sitemap.xml`, `robots.txt` and `app.html`. |
| Fallback | `public/_redirects` | Netlify serves a page's own file first. Any other address (account, checkout, a menu page added since the last build) gets `app.html`, the neutral shell with no canonical. |

Link previews on WhatsApp, Facebook, iMessage and LinkedIn never run JavaScript, so the static files are what they show. Google renders the page and sees the same tags again.

## What each page says

- **Home:** `OnlineStore` (name, logo, address and social links from Settings, 14-day return policy) and `WebSite`.
- **Product** (`/product/<slug>`):
  - Canonical: the plain product address. `?color=` is never in it.
  - `Product` with every colour's photos, SKU, brand, category and materials.
  - `Offer` in EUR with availability and a strikethrough price when on sale.
  - `AggregateRating` only when published reviews exist.
  - `BreadcrumbList`, plus `og:type=product` and price tags for Pinterest and Facebook.
- **Menu pages:** the title is the link's name, with its root added when the name alone is vague ("Full Collection — New Arrivals"). They carry a `BreadcrumbList`. Filters and sort live in the query string, so the canonical is the path alone.
- **Private areas** (`PRIVATE_PREFIXES`: dashboard, account, checkout, atelier, auth, invoices, newsletter links, search): disallowed in `robots.txt`, and also `noindex` in case a link reaches them.
- **404s** (unknown address, unknown product): `noindex`, so a missing page served with status 200 never gets listed.
- **Preview image:** `public/og-image.jpg` (1200 × 630). Products use their first photo.

## Site address

The build uses `SITE_URL`, then Netlify's `URL` (the site's primary domain), then `https://belioras.netlify.app`. The browser uses `VITE_SITE_URL`, or failing that the address it's served from. When the custom domain goes live, make it the primary domain in Netlify. Set `VITE_SITE_URL` too if the site stays reachable at more than one address.

## With the backend

- Read products, the menu, categories, reviews and settings from the API in `collectPages()` instead of `src/data`.
- Add a Netlify build hook, and call it when a product is published or unpublished, a price changes or the menu is saved. The static files and sitemap then follow.
- Add `updatedAt` to products. It becomes the sitemap's `lastmod`.

## Not yet covered

- **Languages:** the language choice lives in the browser, not the address, so only English is indexable. Indexing French, German and the others needs language paths (`/fr/…`) with `hreflang` links, and translated titles and descriptions.
- **Search Console:** after launch, verify the domain in Google Search Console and submit `/sitemap.xml`.
- **Checking the markup:** test a product address with Google's Rich Results Test.
