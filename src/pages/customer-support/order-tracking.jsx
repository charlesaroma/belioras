import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

import PageShell, { Section } from "../../components/layout/PageShell";
import { useCurrency } from "../../context/CurrencyContext";
import { useLanguage } from "../../context/LanguageContext";
import { getOrder } from "../../services/ordersApi";
import { ORDER_STATUS, STATUS_TONES } from "../../Dashboard/lib/constants";
import { cn } from "../../utils/cn";

/**
 * The four stages agreed in the design review, in order. An order sits at one
 * of them, and everything before it is done.
 */
const STAGES = [
  { id: "to-pay", label: "To pay", blurb: "Awaiting payment." },
  { id: "to-ship", label: "To ship", blurb: "Paid, being prepared in Lisbon." },
  { id: "shipped", label: "Shipped", blurb: "With the carrier." },
  { id: "to-review", label: "Delivered", blurb: "Arrived. Tell us how it wears." },
];

/** Legacy fixture statuses map onto the same four stages. */
const STAGE_OF = {
  "to-pay": 0, pending: 0,
  "to-ship": 1, processing: 1, paid: 1,
  shipped: 2,
  "to-review": 3, delivered: 3, reviewed: 3,
};

export default function OrderTrackingPage() {
  const [reference, setReference] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { format } = useCurrency();
  const { locale } = useLanguage();

  const onSubmit = async (e) => {
    e.preventDefault();
    const ref = reference.trim().toUpperCase();
    if (!ref) return;

    setLoading(true);
    setError("");
    setOrder(null);
    try {
      setOrder(await getOrder(ref));
    } catch {
      // Deliberately does not distinguish "no such order" from "not yours" —
      // that difference would let anyone confirm whether a reference exists.
      setError("We couldn’t find an order with that reference. Check it and try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelled = order?.status === "cancelled";
  const stageIndex = order ? (STAGE_OF[order.status] ?? 0) : -1;

  return (
    <PageShell
      eyebrow="Client care"
      title="Order Tracking"
      intro="Enter the reference from your confirmation email — it looks like ORD-1001."
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="order-ref">
          Order reference
        </label>
        <input
          id="order-ref"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="ORD-1001"
          autoComplete="off"
          className="flex-1 border border-umber-100 bg-transparent px-4 py-3 text-sm text-espresso outline-none transition-colors focus:border-espresso"
        />
        <button
          type="submit"
          disabled={loading || !reference.trim()}
          className="inline-flex items-center justify-center gap-2 border border-espresso bg-espresso px-8 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-ivory-50 transition-colors hover:bg-espresso-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading && <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />}
          Track
        </button>
      </form>

      <p aria-live="polite" className="sr-only">
        {loading ? "Searching" : order ? `Order ${order.id} found` : error}
      </p>

      {error && (
        <p className="mt-4 text-sm text-error" role="alert">
          {error}
        </p>
      )}

      {order && (
        <div className="mt-10 border-t border-umber-50 pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl text-espresso">{order.id}</h2>
            <span
              className={cn(
                "px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
                STATUS_TONES[ORDER_STATUS[order.status]?.tone ?? "neutral"],
              )}
            >
              {ORDER_STATUS[order.status]?.label ?? order.status}
            </span>
          </div>

          <p className="mt-2 text-sm text-espresso-soft">
            Placed{" "}
            {new Intl.DateTimeFormat(locale, {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(order.createdAt))}
            {" · "}
            {format(order.total)}
          </p>

          {cancelled ? (
            <p className="mt-8 text-sm text-espresso-soft">
              This order was cancelled. If that is unexpected, write to{" "}
              <a
                href="mailto:care@belioras.com"
                className="text-gold-700 underline underline-offset-4"
              >
                care@belioras.com
              </a>
              .
            </p>
          ) : (
            <ol className="mt-8 space-y-0">
              {STAGES.map((stage, i) => {
                const done = i < stageIndex;
                const current = i === stageIndex;
                return (
                  <li key={stage.id} className="flex gap-4">
                    {/* The rule connects the marks into a single line of
                        progress; the last stage has nothing below it. */}
                    <div className="flex flex-col items-center">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-1.5 size-2 shrink-0 rounded-full",
                          done || current ? "bg-gold-500" : "bg-umber-100",
                        )}
                      />
                      {i < STAGES.length - 1 && (
                        <span
                          aria-hidden="true"
                          className={cn("w-px flex-1", done ? "bg-gold-500" : "bg-umber-100")}
                        />
                      )}
                    </div>

                    <div className={cn("pb-8", i === STAGES.length - 1 && "pb-0")}>
                      <p
                        className={cn(
                          "text-sm",
                          current ? "text-espresso" : done ? "text-espresso-soft" : "text-espresso/35",
                        )}
                      >
                        {stage.label}
                        {current && (
                          <span className="ml-2 text-[10px] uppercase tracking-[0.16em] text-gold-700">
                            Now
                          </span>
                        )}
                      </p>
                      <p
                        className={cn(
                          "mt-0.5 text-[13px]",
                          i <= stageIndex ? "text-espresso-soft" : "text-espresso/30",
                        )}
                      >
                        {stage.blurb}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          {order.trackingRef && (
            <p className="mt-2 text-sm text-espresso-soft">
              Carrier reference <strong className="text-espresso">{order.trackingRef}</strong>
            </p>
          )}
        </div>
      )}

      <div className="mt-14">
        <Section title="Can’t find your reference?">
          <p>
            It is in the subject line of your confirmation email, and at the top of your invoice. If
            you ordered with an account, every order is listed under{" "}
            <a href="/account">your account</a>.
          </p>
          <p>
            Still stuck? Write to <a href="mailto:care@belioras.com">care@belioras.com</a> with the
            email address you ordered with and we will find it.
          </p>
        </Section>

        <Section title="How long should it take?">
          <p>
            Two to five working days inside the EU, three to seven to the UK, seven to fourteen
            elsewhere — counted from dispatch, not from ordering. Full detail on the{" "}
            <Link to="/shipping-policy">shipping page</Link>.
          </p>
        </Section>
      </div>
    </PageShell>
  );
}
