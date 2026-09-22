/* Admin Dashboard Page: Products - ProductFormPricing */
import Toggle from "@/Dashboard/components/Toggle";
import FormSection from "./ProductFormSection";

function MoneyInput({ id, label, error, registration, placeholder }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <div className="relative">
        <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-espresso-soft">
          €
        </span>
        <input
          id={id}
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          className={`input pl-9 tabular-nums ${error ? "input-error" : ""}`}
          {...registration}
        />
      </div>
      {error && <p className="input-helper mt-1.5 text-error">{error}</p>}
    </div>
  );
}

export default function ProductFormPricing({ register, errors, values, setValue }) {
  const price = Number(values.price);
  const was = Number(values.originalPrice);
  const percentOff = values.onSale && price > 0 && was > price ? Math.round((1 - price / was) * 100) : null;

  return (
    <FormSection title="Price" hint="In euros; shoppers see their own currency.">
      <div className="grid gap-4">
        <MoneyInput
          id="price"
          label="Price"
          placeholder="129"
          error={errors.price?.message}
          registration={register("price", {
            required: "Add a price.",
            min: { value: 0.01, message: "The price has to be above zero." },
          })}
        />
        {values.onSale && (
          <MoneyInput
            id="originalPrice"
            label="Was"
            placeholder="169"
            error={errors.originalPrice?.message}
            registration={register("originalPrice", {
              validate: (v) =>
                !values.onSale || Number(v) > Number(values.price) || "The was price has to be higher than the price.",
            })}
          />
        )}
      </div>

      <Toggle
        checked={Boolean(values.onSale)}
        onChange={(on) => setValue("onSale", on, { shouldDirty: true })}
        label="On sale"
        description={
          percentOff !== null
            ? `Shoppers see the was price struck through: ${percentOff}% off.`
            : "Shows a was price struck through beside the price."
        }
      />
    </FormSection>
  );
}
