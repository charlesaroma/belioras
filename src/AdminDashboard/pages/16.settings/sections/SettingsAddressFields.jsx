/* Admin Dashboard Page: Settings - SettingsAddressFields */
import Field from "../../../../components/ui/Field";

/** An address as four fields, so it prints and invoices the same way everywhere. `prefix` names the form fields (boutique → boutiqueStreet…). */
export default function AddressFields({ register, prefix }) {
  return (
    <div className="grid gap-4 sm:grid-cols-6">
      <Field label="Street and number" className="sm:col-span-6">
        <input autoComplete="street-address" {...register(`${prefix}Street`)} />
      </Field>
      <Field label="Postcode" className="sm:col-span-2">
        <input autoComplete="postal-code" {...register(`${prefix}Postcode`)} />
      </Field>
      <Field label="City" className="sm:col-span-4">
        <input autoComplete="address-level2" {...register(`${prefix}City`)} />
      </Field>
      <Field label="Country" className="sm:col-span-6">
        <input autoComplete="country-name" {...register(`${prefix}Country`)} />
      </Field>
    </div>
  );
}
