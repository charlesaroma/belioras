/* Admin Dashboard Page: Newsletter - NewsletterEmailPreview */

const EUR = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });

/** Roughly how an email reads in an inbox, updated as it is written. */
export default function NewsletterEmailPreview({ subject, previewText, heading, body, products = [], cta, code }) {
  const paragraphs = String(body ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <figure className="border border-umber-50 bg-brown-50/40">
      <figcaption className="border-b border-umber-50 bg-ivory-50 px-4 py-3 text-[12px]">
        <p className="text-[10px] uppercase tracking-[0.18em] text-espresso-soft">Preview · from Belioras</p>
        <p className="mt-1 truncate font-medium text-espresso">{subject || "Subject line"}</p>
        {previewText && <p className="truncate text-espresso-soft">{previewText}</p>}
      </figcaption>

      <div className="p-4">
        <div className="mx-auto max-w-md bg-white px-6 py-8 text-center">
          <p className="font-display text-lg tracking-[0.3em] text-gold-700">BELIORAS</p>
          <span aria-hidden="true" className="mx-auto mt-3 block h-px w-10 bg-gold-500" />

          <h3 className="mt-6 text-balance font-display text-2xl leading-tight text-espresso">
            {heading || "Your heading"}
          </h3>
          <div className="mt-4 space-y-3 text-left text-[13px] leading-relaxed text-espresso-soft">
            {paragraphs.length ? paragraphs.map((p, i) => <p key={i}>{p}</p>) : <p>Your message appears here.</p>}
          </div>

          {code && (
            <div className="mt-6 border border-dashed border-gold-500 px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-espresso-soft">Your welcome code</p>
              <p className="mt-2 font-display text-2xl tracking-[0.2em] text-espresso">{code}</p>
            </div>
          )}

          {products.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-3 text-left">
              {products.map((p) => (
                <div key={p.id}>
                  {p.images?.[0] && <img src={p.images[0]} alt="" className="aspect-[3/4] w-full object-cover" />}
                  <p className="mt-2 truncate text-[12px] text-espresso">{p.name}</p>
                  <p className="text-[11px] text-espresso-soft">{EUR.format(p.price)}</p>
                </div>
              ))}
            </div>
          )}

          {cta?.label && (
            <span className="mt-7 inline-block bg-espresso px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory-50">
              {cta.label}
            </span>
          )}

          <p className="mt-8 border-t border-umber-50 pt-4 text-[10px] leading-relaxed text-espresso-soft">
            You are receiving this because you joined the Belioras Letter.{" "}
            <span className="underline">Unsubscribe</span> in one click · <span className="underline">Privacy policy</span>
          </p>
        </div>
      </div>
    </figure>
  );
}
