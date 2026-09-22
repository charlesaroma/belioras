/* Page: Legal - LegalFacts */

/** The row of key facts at the top of a legal page: "Framework · GDPR", "Withdrawal · 14 days". */
export default function LegalFacts({ facts }) {
  return (
    <dl className="mb-8 grid gap-px border border-umber-50 bg-umber-50 sm:grid-cols-2 lg:grid-cols-4">
      {facts.map((f) => (
        <div key={f.label} className="bg-ivory-50 px-4 py-4">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-espresso-soft">{f.label}</dt>
          <dd className="mt-1.5 text-[15px] text-espresso">{f.value}</dd>
          {f.note && <dd className="text-[12px] text-espresso-soft">{f.note}</dd>}
        </div>
      ))}
    </dl>
  );
}
