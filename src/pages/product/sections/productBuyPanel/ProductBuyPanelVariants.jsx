/* Colour And Size Pickers */
import { useLanguage } from "../../../../context/LanguageContext";
import { sizeChartLabelFor } from "../../../../components/storefront/sizeChart/sizeChartKind";
import ProductBuyPanelColors from "./ProductBuyPanelColors";
import ProductBuyPanelSizes from "./ProductBuyPanelSizes";

export default function ProductBuyPanelVariants({
  product,
  color,
  onColorChange,
  size,
  onSizeChange,
  sizeError,
  needsSize,
  chartKind,
  onOpenChart,
}) {
  const { t } = useLanguage();

  return (
    <>
      {product.colors?.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-espresso">
            {t("pdp.selectColour", "Select colour")}
          </p>
          <ProductBuyPanelColors options={product.colors} value={color} onChange={onColorChange} />
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
                onClick={onOpenChart}
                className="text-[11px] uppercase tracking-widest text-gold-600 underline underline-offset-4 transition-colors hover:text-gold-700"
              >
                {sizeChartLabelFor(chartKind)}
              </button>
            )}
          </div>
          <ProductBuyPanelSizes options={product.sizes} value={size} onChange={onSizeChange} />
          {sizeError && (
            <p className="mt-2 text-xs text-error" role="alert">
              {sizeError}
            </p>
          )}
        </div>
      )}

      {/* One-size pieces render no size block, so their guide needs its own
          way in — every hair product had none at all before this. */}
      {!needsSize && chartKind && (
        <button
          type="button"
          onClick={onOpenChart}
          className="mt-7 text-[11px] uppercase tracking-widest text-gold-600 underline underline-offset-4 transition-colors hover:text-gold-700"
        >
          {sizeChartLabelFor(chartKind)}
        </button>
      )}
    </>
  );
}
