import { useState } from "react";
import { Check, MapPin, Plus, Trash2 } from "lucide-react";

import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useToast } from "../../context/ToastContext";

const DEFAULT_ADDRESSES = [
  {
    id: "addr-1",
    recipient: "Mariana Silva",
    line1: "Rua Augusta 118",
    city: "Lisbon",
    postcode: "1100-053",
    country: "Portugal",
    isDefault: true,
  },
];

const EMPTY_FORM = { recipient: "", line1: "", city: "", postcode: "", country: "" };

function Field({ label, htmlFor, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-espresso">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1 text-xs text-rose-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const inputClasses =
  "mt-1.5 w-full rounded-xl border border-umber-50 bg-ivory-50 px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso-soft/60 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20";

export default function Addresses() {
  const [addresses, setAddresses] = useLocalStorage("belioras:addresses", DEFAULT_ADDRESSES);
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
          <h1 className="font-display text-2xl font-medium tracking-wide">Addresses</h1>
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
            <Field label="Recipient" htmlFor="addr-recipient" error={errors.recipient}>
              <input
                id="addr-recipient"
                name="recipient"
                value={form.recipient}
                onChange={update("recipient")}
                placeholder="Full name"
                className={inputClasses}
                aria-describedby={errors.recipient ? "addr-recipient-error" : undefined}
              />
            </Field>
            <Field label="Country" htmlFor="addr-country" error={errors.country}>
              <input
                id="addr-country"
                name="country"
                value={form.country}
                onChange={update("country")}
                placeholder="e.g. Portugal"
                className={inputClasses}
                aria-describedby={errors.country ? "addr-country-error" : undefined}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Street address" htmlFor="addr-line1" error={errors.line1}>
                <input
                  id="addr-line1"
                  name="line1"
                  value={form.line1}
                  onChange={update("line1")}
                  placeholder="Street and number"
                  className={inputClasses}
                  aria-describedby={errors.line1 ? "addr-line1-error" : undefined}
                />
              </Field>
            </div>
            <Field label="City" htmlFor="addr-city" error={errors.city}>
              <input
                id="addr-city"
                name="city"
                value={form.city}
                onChange={update("city")}
                placeholder="City"
                className={inputClasses}
                aria-describedby={errors.city ? "addr-city-error" : undefined}
              />
            </Field>
            <Field label="Postcode" htmlFor="addr-postcode" error={errors.postcode}>
              <input
                id="addr-postcode"
                name="postcode"
                value={form.postcode}
                onChange={update("postcode")}
                placeholder="e.g. 1100-053"
                className={inputClasses}
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