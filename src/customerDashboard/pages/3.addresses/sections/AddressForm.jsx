import Field from "../../../../components/ui/Field";

const FIELDS = [
  { name: "recipient", label: "Recipient", placeholder: "Full name" },
  { name: "country", label: "Country", placeholder: "e.g. Portugal" },
  { name: "line1", label: "Street address", placeholder: "Street and number", wide: true },
  { name: "city", label: "City", placeholder: "City" },
  { name: "postcode", label: "Postcode", placeholder: "e.g. 1100-053" },
];

/** Add a delivery address. Street spans both columns; the rest pair up. */
export default function AddressForm({ form, errors, onChange, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-umber-50 bg-white p-5 sm:p-6"
      aria-label="Add delivery address"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map(({ name, label, placeholder, wide }) => (
          <div key={name} className={wide ? "sm:col-span-2" : undefined}>
            <Field label={label} error={errors[name]}>
              <input
                id={`addr-${name}`}
                name={name}
                value={form[name]}
                onChange={onChange(name)}
                placeholder={placeholder}
                aria-describedby={errors[name] ? `addr-${name}-error` : undefined}
              />
            </Field>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 text-sm font-medium text-ivory-50 transition-colors duration-200 hover:bg-umber-500 active:scale-[0.98]"
      >
        Save address
      </button>
    </form>
  );
}
