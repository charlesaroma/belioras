import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

import EmptyState from "../../../../components/ui/EmptyState";

/** "Where is it going" — the default delivery address, or a prompt to add one. */
export default function DeliversTo({ address }) {
  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-xl tracking-wide text-espresso">Delivers to</h2>
        <Link to="/account/addresses" className="eyebrow hover:opacity-70">
          Manage
        </Link>
      </div>

      {address ? (
        <address className="border border-umber-50 p-5 text-[13px] not-italic leading-relaxed text-espresso-soft">
          <span className="block font-medium text-espresso">{address.recipient}</span>
          {address.line1}
          <br />
          {address.city} {address.postcode}
          <br />
          {address.country}
        </address>
      ) : (
        <EmptyState
          icon={MapPin}
          title="No address saved"
          description="Add one and checkout becomes a step shorter."
          action={{ label: "Add an address", to: "/account/addresses" }}
        />
      )}
    </section>
  );
}
