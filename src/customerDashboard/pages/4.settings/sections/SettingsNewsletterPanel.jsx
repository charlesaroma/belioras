/* Customer Dashboard Page: Settings - SettingsNewsletterPanel */
import { useState } from "react";
import { Link } from "react-router-dom";

import Button from "../../../../components/ui/Button";
import { useToast } from "../../../../context/ToastContext";
import { useAsyncData } from "../../../../hooks/useAsyncData";
import { getSubscription, subscribe, unsubscribeByEmail } from "../../../../services/subscribersApi";

/** The customer's own subscription to the Belioras Letter. */
export default function NewsletterPanel({ user }) {
  const { toast } = useToast();
  const [revision, setRevision] = useState(0);
  const [busy, setBusy] = useState(false);
  const { data: subscription, loading } = useAsyncData(() => getSubscription(user?.email), [user?.email, revision]);

  const status = subscription?.status ?? "none";
  const active = status === "subscribed" || status === "pending";

  const change = async () => {
    setBusy(true);
    try {
      if (active) {
        await unsubscribeByEmail(user.email);
        toast("You're unsubscribed from the Belioras Letter.", "success");
      } else {
        const result = await subscribe({ email: user.email, name: user.name, userId: user.id, source: "account" });
        toast(result.status === "subscribed" ? "You're subscribed." : `We've sent a confirmation link to ${result.email}.`, "success");
      }
      setRevision((n) => n + 1);
    } catch (err) {
      toast(err.message ?? "Could not change your subscription.", "error");
    } finally {
      setBusy(false);
    }
  };

  const message = {
    subscribed: `You receive the Letter at ${user?.email}.`,
    pending: `We sent a confirmation link to ${user?.email}. Your subscription starts when you click it.`,
  }[status] ?? "Collection previews and private sales, about once a month. Unsubscribe any time.";

  return (
    <section className="border border-umber-50 bg-ivory-50 p-6">
      <h2 className="font-display text-xl tracking-wide text-espresso">The Belioras Letter</h2>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-md text-[13px] leading-relaxed text-espresso-soft">
          <p>{loading ? "Checking your subscription…" : message}</p>
          {import.meta.env.DEV && subscription?.token && (
            <Link to={`/newsletter/confirm?token=${subscription.token}`} className="mt-1 inline-block text-[12px] underline underline-offset-4">
              Open confirmation link (demo)
            </Link>
          )}
        </div>
        <Button variant={active ? "ghost" : "primary"} loading={busy} disabled={loading} onClick={change}>
          {active ? "Unsubscribe" : "Subscribe"}
        </Button>
      </div>
    </section>
  );
}
