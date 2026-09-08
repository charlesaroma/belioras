import Field from "../../../components/ui/Field";

/**
 * Who is buying and where it goes.
 *
 * Guest checkout by design — requiring registration before a first purchase
 * is a well-known way to lose the purchase. A signed-in shopper has these
 * prefilled from their account and can still change them for this order.
 *
 * The email field carries the weight: it is where the confirmation and the
 * tracking reference go, and for a guest it is the only way they will ever
 * find this order again on the public tracker.
 */
export default function DeliveryForm({ register, errors, savedAddresses, onUseSaved, signedIn }) {
  return (
    <div className="space-y-6">
      <section className="border border-umber-50 bg-ivory-50 p-6">
        <h2 className="font-display text-xl tracking-wide text-espresso">Contact</h2>
        <p className="mt-1 text-[12px] text-espresso-soft">
          {signedIn
            ? "Your confirmation and tracking go here."
            : "Your confirmation and tracking go here. You do not need an account to order."}
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Full name" required error={errors.name?.message}>
            <input {...register("name", { required: "We need a name for the delivery." })} />
          </Field>

          <Field label="Email" required error={errors.email?.message}>
            <input
              type="email"
              {...register("email", {
                required: "We need an address to send the confirmation to.",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Check that address." },
              })}
            />
          </Field>

          <Field
            label="Telephone"
            className="sm:col-span-2"
            helper="Only used if the carrier needs to reach you."
          >
            <input type="tel" {...register("phone")} />
          </Field>
        </div>
      </section>

      <section className="border border-umber-50 bg-ivory-50 p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-xl tracking-wide text-espresso">Delivery address</h2>

          {savedAddresses.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {savedAddresses.map((address) => (
                <button
                  key={address.id}
                  type="button"
                  onClick={() => onUseSaved(address)}
                  className="border border-umber-50 px-2.5 py-1 text-[11px] text-espresso-soft transition-colors hover:border-espresso/40 hover:text-espresso"
                >
                  Use {address.city}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Street address" required className="sm:col-span-2" error={errors.line1?.message}>
            <input {...register("line1", { required: "A street address is required." })} />
          </Field>

          <Field label="City" required error={errors.city?.message}>
            <input {...register("city", { required: "A city is required." })} />
          </Field>

          <Field label="Postcode" required error={errors.postcode?.message}>
            <input {...register("postcode", { required: "A postcode is required." })} />
          </Field>

          <Field
            label="Country"
            required
            className="sm:col-span-2"
            error={errors.country?.message}
            helper="Sets the shipping rate. EU, United Kingdom, or elsewhere."
          >
            <input
              {...register("country", { required: "A country is required." })}
              placeholder="Portugal"
            />
          </Field>
        </div>
      </section>
    </div>
  );
}
