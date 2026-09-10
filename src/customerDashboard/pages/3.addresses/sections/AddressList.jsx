import { Check, MapPin, Plus, Trash2 } from "lucide-react";

/** The saved addresses, or a prompt to add the first one. */
export default function AddressList({ addresses, onSetDefault, onRemove, onAddFirst }) {
  if (!addresses.length) {
    return (
      <div className="rounded-2xl border border-umber-50 bg-white px-6 py-16 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-gold-500/15 text-gold-700">
          <MapPin className="size-6" aria-hidden="true" />
        </span>
        <h2 className="mt-5 font-display text-xl font-medium tracking-wide">No addresses yet</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-espresso-soft">
          Add a delivery address so checkout is one step away.
        </p>
        <button
          type="button"
          onClick={onAddFirst}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 text-sm font-medium text-ivory-50 transition-colors duration-200 hover:bg-umber-500 active:scale-[0.98]"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add your first address
        </button>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {addresses.map((address) => (
        <li
          key={address.id}
          className={`rounded-2xl border bg-white p-5 ${
            address.isDefault ? "border-gold-500/60" : "border-umber-50"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <span
              className="flex size-10 items-center justify-center rounded-full bg-gold-500/15 text-gold-700"
              aria-hidden="true"
            >
              <MapPin className="size-5" />
            </span>
            <div className="flex items-center gap-1">
              {address.isDefault ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-brown-50 px-2.5 py-1 text-xs font-medium text-gold-700">
                  <Check className="size-3" aria-hidden="true" />
                  Default
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onSetDefault(address.id)}
                  className="rounded-full px-2.5 py-1 text-xs font-medium text-espresso-soft transition-colors hover:bg-brown-50 hover:text-gold-700"
                >
                  Set default
                </button>
              )}
              <button
                type="button"
                onClick={() => onRemove(address.id)}
                aria-label={`Remove address for ${address.recipient}`}
                className="flex size-11 items-center justify-center rounded-full text-espresso-soft transition-colors hover:bg-rose-50 hover:text-rose-700"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <p className="mt-4 text-sm font-semibold text-espresso">{address.recipient}</p>
          <p className="mt-1 text-sm leading-relaxed text-espresso-soft">
            {address.line1}
            <br />
            {address.city}, {address.postcode}
            <br />
            {address.country}
          </p>
        </li>
      ))}
    </ul>
  );
}
