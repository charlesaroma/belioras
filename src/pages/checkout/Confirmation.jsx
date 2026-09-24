/* Page: Checkout - Confirmation */
import { useLocation, useParams } from "react-router-dom";
import { Check } from "lucide-react";

import Button from "../../components/ui/Button";
import { PAYMENTS_SIMULATED } from "../../services/sales/paymentsApi";
import PageShell from "../../components/layout/PageShell";

export default function CheckoutConfirmation() {
  const { id } = useParams();
  const { state } = useLocation();

  const email = state?.email;

  return (
    <PageShell eyebrow="Thank you" title="Payment received">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-12 items-center justify-center border border-gold-500/40 text-gold-700">
          <Check className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </span>

        <p className="eyebrow mt-6">Your reference</p>
        <p className="mt-2 font-display text-4xl tabular-nums text-espresso">{id}</p>

        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-espresso-soft">
          Keep this reference. With the email address you ordered with
          {email ? ` — ${email} — ` : " "}
          it is how you follow this order.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" to="/order-tracking">
            Track this order
          </Button>
          <Button size="lg" variant="secondary" to="/shop">
            Continue shopping
          </Button>
        </div>

        <p className="mx-auto mt-8 max-w-md border-l-2 border-gold-500 py-3 pl-5 text-left text-[13px] leading-relaxed text-espresso-soft">
          <strong className="font-medium text-espresso">Your order is confirmed.</strong> The confirmation and your invoice
          are on their way to {email ?? "your email"}. We&rsquo;ll write again when it ships.
          {PAYMENTS_SIMULATED && " (Test mode: payment was simulated and emails are queued until they are connected.)"}
        </p>

        <p className="mt-6 text-[13px] text-espresso-soft">
          Ordering often?{" "}
          <a href="/signup" className="text-gold-700 underline underline-offset-4">
            Create an account
          </a>{" "}
          and your orders are kept together.
        </p>
      </div>
    </PageShell>
  );
}
