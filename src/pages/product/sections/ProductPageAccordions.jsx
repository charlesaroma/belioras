/* Details Care And Shipping */
import { useLanguage } from "../../../context/LanguageContext";

export default function ProductPageAccordions({ product }) {
  const { t } = useLanguage();

  return (
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
  );
}

// Native <details>, so it works before hydration and needs no open state.
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
