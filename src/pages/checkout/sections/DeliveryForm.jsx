/* Page: Checkout - DeliveryForm */
import Field from "../../../components/ui/Field";
import PhoneField from "../../../components/ui/PhoneField";
import { SHIPPING_COUNTRIES } from "../../../utils/checkout";

export default function DeliveryForm({ register, setValue, watch, errors, savedAddresses, onUseSaved, signedIn }) {
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

          <PhoneField
            register={register}
            setValue={setValue}
            watch={watch}
            label="Telephone"
            className="sm:col-span-2"
            helper="Only used if the carrier needs to reach you."
          />
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
            helper="Sets the shipping rate. These are the countries we ship to."
          >
            {/* A list rather than free text: only countries we ship to can be chosen. */}
            <select {...register("country", { required: "Choose a country." })}>
              <optgroup label="Germany">
                {SHIPPING_COUNTRIES.de.map((c) => <option key={c} value={c}>{c}</option>)}
              </optgroup>
              <optgroup label="European Union">
                {SHIPPING_COUNTRIES.eu.map((c) => <option key={c} value={c}>{c}</option>)}
              </optgroup>
              <optgroup label="International">
                {SHIPPING_COUNTRIES.intl.map((c) => <option key={c} value={c}>{c}</option>)}
              </optgroup>
            </select>
          </Field>
        </div>
      </section>
    </div>
  );
}
