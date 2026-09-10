import Field from "../../../../components/ui/Field";
import FormSection from "./FormSection";
import { COLLECTIONS } from "./productPayload";

/** Pricing, stock and visibility — the narrow column beside the main form. */
export default function FormSidebar({ register, errors }) {
  return (
    <div className="space-y-5">
      <FormSection title="Pricing & stock">
        <Field
          label="Price (EUR)"
          required
          error={errors.price?.message}
          helper="Catalogue prices are stored in euros and converted for the shopper."
        >
          <input
            type="number"
            min="0"
            step="0.01"
            {...register("price", {
              required: "A product needs a price.",
              min: { value: 0.01, message: "Price must be above zero." },
            })}
          />
        </Field>

        <Field
          label="Compare-at price"
          helper="Shows as a strike-through. Leave blank if not on sale."
        >
          <input type="number" min="0" step="0.01" {...register("originalPrice")} />
        </Field>

        <Field label="Stock" error={errors.stock?.message}>
          <input type="number" min="0" {...register("stock", { min: 0 })} />
        </Field>
      </FormSection>

      <FormSection title="Visibility">
        <Field label="Collection">
          <select {...register("collectionId")}>
            {COLLECTIONS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status" helper="Drafts are hidden from the storefront.">
          <select {...register("status")}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
          </select>
        </Field>
      </FormSection>
    </div>
  );
}
