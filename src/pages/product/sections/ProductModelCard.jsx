/* Page: Product - ProductModelCard */
import { Link } from "react-router-dom";

import { useAsyncData } from "../../../hooks/useAsyncData";
import { getModels } from "../../../services/catalog/modelsApi";
import { sizeLabel } from "../../../utils/sizeLabel";

const inches = (cm) => `${(cm / 2.54).toFixed(1)}″`;
function feet(cm) {
  const total = Math.round(cm / 2.54);
  return `${Math.floor(total / 12)}′${total % 12}″`;
}

/**
 * Who is wearing the piece, and her measurements in centimetres and inches —
 * the quickest way for a shopper to judge fit against their own. Links to
 * everything else she wears.
 */
export default function ProductModelCard({ product, taxonomy }) {
  const { data: models } = useAsyncData(getModels, []);
  const fit = product.modelFit;
  const model = (models ?? []).find((m) => m.id === fit?.modelId);
  if (!model || !fit?.size) return null;

  const rows = [
    ["Height", model.heightCm, feet],
    ["Bust", model.bustCm, inches],
    ["Waist", model.waistCm, inches],
    ["Hip", model.hipCm, inches],
  ].filter(([, cm]) => cm);

  return (
    <section aria-label="The model" className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5 bg-ivory-200 p-5 sm:p-6">
      {model.photo ? (
        <img src={model.photo} alt={model.name} className="size-24 shrink-0 rounded-full object-cover object-top sm:size-28" />
      ) : (
        <span aria-hidden="true" className="flex size-24 shrink-0 items-center justify-center rounded-full bg-umber-50 font-display text-3xl text-espresso-soft">
          {model.name.slice(0, 1)}
        </span>
      )}
      <div className="min-w-0">
        <p className="font-display text-3xl uppercase tracking-wide text-espresso">{model.name}</p>
        <p className="mt-1 text-[12px] uppercase tracking-[0.18em] text-espresso-soft">
          Wears size <strong className="font-semibold text-espresso">{sizeLabel(taxonomy, fit.size)}</strong>
        </p>
        <Link to={`/shop?model=${model.id}`} className="mt-2 inline-block text-[12px] text-espresso underline decoration-gold-600 underline-offset-4 hover:text-gold-700">
          Shop this edit →
        </Link>
      </div>
      {rows.length > 0 && (
        <dl className="ml-auto grid grid-cols-[auto_auto_auto] gap-x-5 gap-y-1 text-[14px] tabular-nums">
          {rows.map(([label, cm, imperial]) => (
            <div key={label} className="contents">
              <dt className="text-right font-medium text-espresso">{label}</dt>
              <dd className="text-right text-espresso">{cm} cm</dd>
              <dd className="text-right text-espresso-soft">{imperial(cm)}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
