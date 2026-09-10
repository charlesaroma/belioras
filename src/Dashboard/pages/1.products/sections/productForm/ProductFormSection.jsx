
/* Form Section */
export default function FormSection({ title, hint, children }) {
  return (
    <section className="border border-umber-50 bg-ivory-50 p-5">
      <h2 className="font-display text-lg tracking-wide text-espresso">{title}</h2>
      {hint && <p className="mt-1 text-[12px] leading-relaxed text-espresso-soft">{hint}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
