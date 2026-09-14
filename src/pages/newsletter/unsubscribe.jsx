/* Page: Newsletter - unsubscribe */
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import PageShell from "../../components/layout/PageShell";
import Button from "../../components/ui/Button";
import { subscribe, unsubscribe } from "../../services/subscribersApi";

const EYEBROW = "The Belioras Letter";

/**
 * Where the unsubscribe link in every email lands.
 *
 * It asks for one click rather than unsubscribing on arrival: mail security
 * scanners open links before a person does, and would otherwise unsubscribe
 * people who never asked. The one-click header mail clients show is a separate
 * request the backend answers directly.
 */
export default function NewsletterUnsubscribePage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, setState] = useState({ step: "ask" });

  const leave = async () => {
    setState({ step: "working" });
    try {
      const { email } = await unsubscribe(token);
      setState({ step: "done", email });
    } catch (err) {
      setState({ step: "error", message: err.message });
    }
  };

  const rejoin = async () => {
    try {
      const { email } = await subscribe({ email: state.email, source: "resubscribe" });
      setState({ step: "rejoined", email });
    } catch (err) {
      setState({ step: "error", message: err.message });
    }
  };

  if (state.step === "done") {
    return (
      <PageShell eyebrow={EYEBROW} title="You're unsubscribed" intro={`We won't send the Letter to ${state.email} again.`}>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/" className="btn btn-md btn-primary">Back to the shop</Link>
          <button type="button" onClick={rejoin} className="text-[12px] text-espresso-soft underline underline-offset-4 hover:text-espresso">
            Unsubscribed by mistake? Join again
          </button>
        </div>
      </PageShell>
    );
  }

  if (state.step === "rejoined") {
    return (
      <PageShell eyebrow={EYEBROW} title="Welcome back" intro={`We've sent a new confirmation link to ${state.email}. You'll be subscribed again once you click it.`} />
    );
  }

  if (state.step === "error") {
    return (
      <PageShell eyebrow={EYEBROW} title="We couldn't find that subscription" intro={state.message}>
        <Link to="/" className="btn btn-md btn-primary">Back to the shop</Link>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow={EYEBROW}
      title="Unsubscribe from the Letter?"
      intro="You'll stop receiving collection previews and private sales. Order and delivery emails are not affected."
    >
      <Button loading={state.step === "working"} onClick={leave} className="bg-espresso text-ivory-50 hover:bg-espresso-600">
        Unsubscribe
      </Button>
    </PageShell>
  );
}
