/* Page: Newsletter - confirm */
import { Link, useSearchParams } from "react-router-dom";

import PageShell from "../../components/layout/PageShell";
import { useAsyncData } from "../../hooks/useAsyncData";
import { confirmSubscription } from "../../services/marketing/subscribersApi";

const EYEBROW = "The Belioras Letter";

/** Where the link in the confirmation email lands. Following it is the consent. */
export default function NewsletterConfirmPage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const { data, loading, error } = useAsyncData(() => confirmSubscription(token), [token]);

  if (loading) return <PageShell eyebrow={EYEBROW} title="Confirming your subscription" />;

  if (error || !data) {
    return (
      <PageShell eyebrow={EYEBROW} title="This link has expired" intro={error?.message ?? "Please sign up again from the footer."}>
        <Link to="/" className="btn btn-md btn-primary">
          Back to the shop
        </Link>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow={EYEBROW}
      title={data.already ? "You're already subscribed" : "You're subscribed"}
      intro={`We'll write to ${data.email} about once a month, with new collections and private sales before anyone else.`}
    >
      {data.welcomeCode && !data.already && (
        <div className="border border-dashed border-gold-500 px-6 py-7 text-center">
          <p className="eyebrow">Your welcome code</p>
          <p className="mt-3 font-display text-3xl tracking-[0.2em] text-espresso">{data.welcomeCode}</p>
          <p className="mt-3 text-[13px] text-espresso-soft">
            We've also emailed it to you. Enter it at checkout on your first order.
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link to="/new-arrivals" className="btn btn-md btn-primary">
          See what's new
        </Link>
        {/* Every email carries this link. Shown here in development, where there is no inbox. */}
        {import.meta.env.DEV && (
          <Link to={`/newsletter/unsubscribe?token=${token}`} className="text-[12px] text-espresso-soft underline underline-offset-4">
            Unsubscribe link (demo)
          </Link>
        )}
      </div>
    </PageShell>
  );
}
