/* Usual Sizes */
import { useLanguage } from "../../../../context/LanguageContext";

const COLLECTION_LABEL = { dresses: "Dresses", hair: "Hair", accessories: "Accessories" };

// The single most useful thing a wardrobe can tell someone: what they
// actually take. Derived from what they bought and kept, not from a profile
// field nobody fills in.
export default function WardrobeSizes({ sizes, pieceCount }) {
  const { t } = useLanguage();
  if (!sizes.length) return null;

  return (
    <section className="border border-umber-50 bg-brown-50/40 p-6" aria-labelledby="sizes-heading">
      <p id="sizes-heading" className="eyebrow">
        {t("account.yourSizes", "Your sizes")}
      </p>

      <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-4">
        {sizes.map((s) => (
          <div key={s.collection}>
            <dt className="text-[11px] uppercase tracking-[0.16em] text-espresso-soft">
              {COLLECTION_LABEL[s.collection] ?? s.collection}
            </dt>
            <dd className="mt-1 font-display text-2xl uppercase text-espresso">{s.size}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-[12px] leading-relaxed text-espresso/45">
        Taken from {pieceCount} {pieceCount === 1 ? "piece" : "pieces"} you have ordered. We show
        this beside the size picker when you are choosing.
      </p>
    </section>
  );
}
