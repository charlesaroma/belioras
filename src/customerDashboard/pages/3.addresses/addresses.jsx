import { useState } from "react";
import { Check, MapPin, Plus, Trash2 } from "lucide-react";

import Field from "../../../components/ui/Field";
import { useAuth } from "../../../context/AuthContext";
import { useScopedStorage } from "../../../hooks/useScopedStorage";
import { useToast } from "../../../context/ToastContext";

/**
 * No seed.
 *
 * This used to start every account with a hardcoded Lisbon address for a
 * fictional "Mariana Silva", so a customer who had never added one opened the
 * page to a stranger's delivery details — and, worse, could have checked out
 * against them.
 */
const NO_ADDRESSES = [];

const EMPTY_FORM = { recipient: "", line1: "", city: "", postcode: "", country: "" };

export default function Addresses() {
  // Scoped per account. This was one device-global key seeded with a sample
  // address, so signing out and in as someone else showed them a stranger's
  // home address as their own. Not merged from the anonymous store on
  // sign-in: a delivery address is not something to silently move between
  // accounts the way a wishlist is.
  const { user } = useAuth();
  const [addresses, setAddresses] = useScopedStorage(
    "belioras:addresses",
    NO_ADDRESSES,
    user?.id,
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const { toast } = useToast();

  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.recipient.trim()) next.recipient = "Recipient name is required.";
    if (!form.line1.trim()) next.line1 = "Street address is required.";
    if (!form.city.trim()) next.city = "City is required.";
    if (!form.postcode.trim()) next.postcode = "Postcode is required.";
    if (!form.country.trim()) next.country = "Country is required.";
    return next;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    const address = { ...form, id: `addr-${Date.now()}`, isDefault: addresses.length === 0 };
    setAddresses([...addresses, address]);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowForm(false);
    toast("Address saved", "success");
  };

  const remove = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast("Address removed", "info");
  };

  const setDefault = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    toast("Default address updated", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-medium tracking-wide">Addresses</h2>
          <p className="mt-1 text-sm text-espresso-soft">Manage the delivery addresses used at checkout.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          aria-expanded={showForm}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-espresso px-4 py-2.5 text-sm font-medium text-ivory-50 transition-colors duration-200 hover:bg-umber-500 active:scale-[0.98]"
        >
          <Plus className="size-4" aria-hidden="true" />
          {showForm ? "Cancel" : "Add address"}
        </button>
      </div>

      {showForm ? (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-umber-50 bg-white p-5 sm:p-6"
          aria-label="Add delivery address"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Recipient" error={errors.recipient}>
              <input
                id="addr-recipient"
                name="recipient"
                value={form.recipient}
                onChange={update("recipient")}
                placeholder="Full name"
                aria-describedby={errors.recipient ? "addr-recipient-error" : undefined}
              />
            </Field>
            <Field label="Country" error={errors.country}>
              <input
                id="addr-country"
                name="country"
                value={form.country}
                onChange={update("country")}
                placeholder="e.g. Portugal"
                aria-describedby={errors.country ? "addr-country-error" : undefined}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Street address" error={errors.line1}>
                <input
                  id="addr-line1"
                  name="line1"
                  value={form.line1}
                  onChange={update("line1")}
                  placeholder="Street and number"
                  aria-describedby={errors.line1 ? "addr-line1-error" : undefined}
                />
              </Field>
            </div>
            <Field label="City" error={errors.city}>
              <input
                id="addr-city"
                name="city"
                value={form.city}
                onChange={update("city")}
                placeholder="City"
                aria-describedby={errors.city ? "addr-city-error" : undefined}
              />
            </Field>
            <Field label="Postcode" error={errors.postcode}>
              <input
                id="addr-postcode"
                name="postcode"
                value={form.postcode}
                onChange={update("postcode")}
                placeholder="e.g. 1100-053"
                aria-describedby={errors.postcode ? "addr-postcode-error" : undefined}
              />
            </Field>
          </div>
          <button
            type="submit"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 text-sm font-medium text-ivory-50 transition-colors duration-200 hover:bg-umber-500 active:scale-[0.98]"
          >
            Save address
          </button>
        </form>
      ) : null}

      {!addresses.length ? (
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
            onClick={() => setShowForm(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 text-sm font-medium text-ivory-50 transition-colors duration-200 hover:bg-umber-500 active:scale-[0.98]"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add your first address
          </button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <li
              key={address.id}
              className={`rounded-2xl border bg-white p-5 ${address.isDefault ? "border-gold-500/60" : "border-umber-50"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-gold-500/15 text-gold-700" aria-hidden="true">
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
                      onClick={() => setDefault(address.id)}
                      className="rounded-full px-2.5 py-1 text-xs font-medium text-espresso-soft transition-colors hover:bg-brown-50 hover:text-gold-700"
                    >
                      Set default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(address.id)}
                    aria-label={`Remove address for ${address.recipient}`}
                    className="flex size-9 items-center justify-center rounded-full text-espresso-soft transition-colors hover:bg-rose-50 hover:text-rose-700"
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
      )}
    </div>
  );
}