/* Layout Component: PageShell */
import { cn } from "../../utils/cn";

export default function PageShell({
  eyebrow,
  title,
  intro,
  meta,
  width = "prose",
  children,
}) {
  return (
    <div
      className="px-6 pb-24 md:px-10"
      style={{ paddingTop: "calc(var(--header-height, 138px) + 3rem)" }}
    >
      <div className={cn("mx-auto", width === "prose" ? "max-w-2xl" : "max-w-[1400px]")}>
        <header className="border-b border-umber-50 pb-8">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="mt-3 font-display text-4xl leading-tight text-espresso md:text-5xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-5 text-[15px] leading-relaxed text-espresso-soft">{intro}</p>
          )}
          {meta && (
            <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-espresso/40">{meta}</p>
          )}
        </header>

        <div className="pt-10">{children}</div>
      </div>
    </div>
  );
}

/* Section */
export function Section({ title, children }) {
  return (
    <section className="border-b border-umber-50/70 py-7 first:pt-0 last:border-b-0">
      {title && (
        <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-espresso">
          {title}
        </h2>
      )}
      <div className="space-y-3 text-[15px] leading-relaxed text-espresso-soft [&_a]:text-gold-700 [&_a]:underline [&_a]:underline-offset-4 [&_li]:mb-1.5 [&_strong]:font-medium [&_strong]:text-espresso [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}

/* Draft Notice */
export function DraftNotice({ children }) {
  return (
    <div className="mb-8 border-l-2 border-gold-500 py-3 pl-5">
      <p className="text-[13px] leading-relaxed text-espresso-soft">
        <strong className="font-medium text-espresso">Draft pending legal review.</strong>{" "}
        {children}
      </p>
    </div>
  );
}
