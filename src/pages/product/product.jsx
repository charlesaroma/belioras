import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Loader2, Share2 } from "lucide-react";

import { useAsyncData } from "../../hooks/useAsyncData";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../../context/ToastContext";
import { useWishlist } from "../../context/WishlistContext";
import { getProduct, getProductsByCollection } from "../../services/productsApi";
import ColorSelector from "../../components/product/ColorSelector";
import SizeSelector from "../../components/product/SizeSelector";
import QuantitySelector from "../../components/shared/QuantitySelector";
import ProductCard from "../../components/storefront/ProductCard";
import Modal from "../../components/common/Modal";
import SizeChart from "../../components/storefront/sizeChart/SizeChart";
import {
  sizeChartKindFor,
  sizeChartLabelFor,
} from "../../components/storefront/sizeChart/sizeChartKind";
import { cn } from "../../utils/cn";

import ProductGallery from "./sections/ProductGallery";

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: product, loading, error } = useAsyncData(() => getProduct(slug), [slug]);
  const { format } = useCurrency();
  const { toast } = useToast();
  const { t } = useLanguage();

  const { data: related } = useAsyncData(
    () =>
      product?.collectionId ? getProductsByCollection(product.collectionId) : Promise.resolve([]),
    [product?.collectionId],
  );

  // Syncing the document title is a genuine external-system effect. The variant
  // state this used to reset alongside it now lives in a keyed child instead.
  useEffect(() => {
    if (product) document.title = `${product.name} | Belioras`;
  }, [product]);

  const suggestions = (related ?? []).filter((p) => p.id !== product?.id).slice(0, 4);

  /**
   * A product page is frequently the entry point — a shared link, an ad, a
   * search result — and navigate(-1) from there either does nothing or throws
   * the visitor off the site. React Router marks the first entry in a session
   * with key "default", so fall back to the product's collection instead.
   */
  const cameFromWithinSite = location.key !== "default";
  const collectionPath = product?.collectionId ? `/${product.collectionId}` : "/shop";

  /**
   * Native share sheet where the browser offers one — it exposes the platforms
   * the visitor actually uses rather than a fixed row of icons that goes stale
   * — falling back to copying the link, which works everywhere.
   */
  const handleShare = async () => {
    const url = window.location.href;
    const payload = { title: product.name, text: product.description, url };

    if (navigator.share && navigator.canShare?.(payload) !== false) {
      try {
        await navigator.share(payload);
      } catch {
        // Dismissing the sheet rejects; that is not an error worth surfacing.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      toast(t("pdp.linkCopied", "Link copied to clipboard."), "success");
    } catch {
      toast(t("pdp.linkCopyFailed", "Could not copy the link."), "error");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-gold-600" aria-label="Loading" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-display text-3xl text-espresso">Piece not found</h1>
        <p className="mt-3 text-sm text-espresso-soft">
          It may have sold out or been retired from the collection.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-block text-[11px] uppercase tracking-widest text-gold-600 transition-colors hover:text-gold-700"
        >
          ← Back to the shop
        </Link>
      </div>
    );
  }

  const onSale = product.originalPrice && product.originalPrice > product.price;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div
      className="mx-auto max-w-7xl px-6 pb-24"
      // Offsets by the header's measured height rather than a guessed value,
      // with a fallback for the first paint before the observer reports.
      style={{ paddingTop: "calc(var(--header-height, 138px) + 2rem)" }}
    >
      <button
        type="button"
        onClick={() => (cameFromWithinSite ? navigate(-1) : navigate(collectionPath))}
        className="group mb-6 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-espresso-soft transition-colors hover:text-espresso"
      >
        <ArrowLeft
          className="size-4 transition-transform group-hover:-translate-x-0.5"
          aria-hidden="true"
        />
        Back
      </button>

      <nav
        aria-label="Breadcrumb"
        className="mb-8 text-[11px] uppercase tracking-widest text-espresso/40"
      >
        <Link to="/" className="transition-colors hover:text-espresso">
          Home
        </Link>{" "}
        · <span className="text-espresso-soft">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl leading-tight text-espresso md:text-4xl">
              {product.name}
            </h1>

            <button
              type="button"
              onClick={handleShare}
              aria-label={t("pdp.share", "Share this piece")}
              title={t("pdp.share", "Share this piece")}
              className="-mr-2.5 mt-1 flex size-11 shrink-0 items-center justify-center text-espresso-soft transition-colors hover:text-espresso"
            >
              <Share2 className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className={cn("text-xl tabular-nums", onSale ? "text-error" : "text-espresso")}>
              {format(product.price)}
            </span>
            {onSale && (
              <span className="text-sm tabular-nums text-espresso/35 line-through">
                {format(product.originalPrice)}
              </span>
            )}
            {lowStock && (
              <span className="ml-auto text-[10px] uppercase tracking-widest text-warning">
                Only {product.stock} left
              </span>
            )}
          </div>

          <p className="mt-5 max-w-lg text-sm leading-relaxed text-espresso-soft">
            {product.description}
          </p>

          {/*
            Keyed by product id so navigating from one piece to another remounts
            it — colour, size and quantity reset because the component is new,
            not because an effect reached in and cleared them.
          */}
          <BuyPanel key={product.id} product={product} />
        </div>
      </div>

      {suggestions.length > 0 && (
        <section className="mt-24" aria-labelledby="related-heading">
          <h2 id="related-heading" className="mb-8 font-display text-2xl text-espresso">
            You may also like
          </h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {suggestions.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/** Variant selection and everything downstream of it. */
function BuyPanel({ product }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { t } = useLanguage();

  const [color, setColor] = useState(product.colors?.[0] ?? null);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sizeError, setSizeError] = useState("");
  const [added, setAdded] = useState(false);

  const saved = has(product.id);
  const soldOut = product.stock === 0;
  const needsSize = product.sizes?.length > 1;
  // Which reference table this piece needs — garment, footwear or hair.
  // null means there is nothing useful to show, so no trigger is rendered.
  const chartKind = sizeChartKindFor(product);

  const handleAdd = () => {
    if (needsSize && !size) {
      setSizeError(t("pdp.selectSizeFirst", "Please select a size."));
      return;
    }
    setSizeError("");
    addItem(product, { size: size ?? product.sizes?.[0] ?? null, color, quantity: qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <>
      {product.colors?.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-espresso">
            {t("pdp.selectColour", "Select colour")}
          </p>
          <ColorSelector options={product.colors} value={color} onChange={setColor} />
        </div>
      )}

      {needsSize && (
        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-espresso">
              {t("pdp.selectSize", "Select size")}
            </p>
            {chartKind && (
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="text-[11px] uppercase tracking-widest text-gold-600 underline underline-offset-4 transition-colors hover:text-gold-700"
              >
                {t("pdp.sizeGuide", sizeChartLabelFor(chartKind))}
              </button>
            )}
          </div>
          <SizeSelector
            options={product.sizes}
            value={size}
            onChange={(s) => {
              setSize(s);
              setSizeError("");
            }}
          />
          {sizeError && (
            <p className="mt-2 text-xs text-error" role="alert">
              {sizeError}
            </p>
          )}
        </div>
      )}

      {/* One-size pieces never render the block above, so their guide would
          be unreachable — which is how every hair product ended up with no
          route to the length and texture guide at all. */}
      {!needsSize && chartKind && (
        <button
          type="button"
          onClick={() => setSizeGuideOpen(true)}
          className="mt-7 text-[11px] uppercase tracking-widest text-gold-600 underline underline-offset-4 transition-colors hover:text-gold-700"
        >
          {sizeChartLabelFor(chartKind)}
        </button>
      )}

      {/* At 390px the quantity stepper, the button and the heart left the
          button about 100px, so "Add to bag" broke across three lines. Below
          sm the primary action takes its own full-width row. */}
      <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-5">
        <QuantitySelector value={qty} onChange={setQty} max={Math.max(product.stock, 1)} />

        <button
          type="button"
          onClick={handleAdd}
          disabled={soldOut}
          className="order-last w-full border border-espresso bg-espresso px-6 py-4 text-sm font-medium uppercase tracking-[0.18em] text-ivory-50 transition-colors hover:bg-espresso-600 disabled:cursor-not-allowed disabled:opacity-40 sm:order-none sm:w-auto sm:flex-1 sm:px-10"
        >
          {soldOut
            ? t("pdp.soldOut", "Sold out")
            : added
              ? t("common.added", "Added to your bag")
              : t("common.addToBag", "Add to bag")}
        </button>

        <button
          type="button"
          onClick={() => toggle(product.id)}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={saved}
          className={cn(
            "ml-auto flex size-12 shrink-0 items-center justify-center border transition-all sm:ml-0",
            saved
              ? "border-espresso bg-espresso text-gold-400"
              : "border-umber-100 text-espresso-soft hover:border-espresso",
          )}
        >
          <Heart className={cn("size-5", saved && "fill-current")} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-10 divide-y divide-umber-50 border-y border-umber-50">
        <Accordion title={t("pdp.details", "Details & composition")}>
          <ul className="list-disc space-y-1 pl-5">
            {[...(product.details ?? []), ...(product.materials ?? [])].map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </Accordion>

        {product.care?.length > 0 && (
          <Accordion title={t("pdp.care", "Care")}>
            <ul className="list-disc space-y-1 pl-5">
              {product.care.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </Accordion>
        )}

        <Accordion title={t("pdp.shipping", "Shipping & returns")}>
          <p className="leading-relaxed">
            {t(
              "pdp.shippingBody",
              "Complimentary EU shipping on orders over €150, tracked and insured. Unworn pieces may be returned within 14 days.",
            )}
          </p>
        </Accordion>
      </div>

      <Modal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        title={sizeChartLabelFor(chartKind)}
        // The default max-w-lg cuts the international table off; this holds
        // six columns and the measuring figure without scrolling sideways.
        width="max-w-2xl"
      >
        <SizeChart kind={chartKind ?? "garment"} />
      </Modal>
    </>
  );
}

/**
 * Built on <details> so it works before hydration and is reachable by the
 * browser's find-in-page, which a div-based accordion is not.
 */
function Accordion({ title, children }) {
  return (
    <details className="group py-4">
      <summary className="flex cursor-pointer list-none items-center text-[11px] font-semibold uppercase tracking-[0.22em] text-espresso marker:hidden">
        <span
          aria-hidden="true"
          className="mr-2 inline-block transition-transform duration-200 group-open:rotate-45"
        >
          +
        </span>
        {title}
      </summary>
      <div className="mt-3 text-sm text-espresso-soft">{children}</div>
    </details>
  );
}
