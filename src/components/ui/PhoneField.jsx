import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { cn } from "../../utils/cn";

/**
 * A telephone field with a country flag/code selector, storing one E.164
 * string (e.g. "+351912345678") in the same react-hook-form field every
 * bare `<input type="tel">` used before it — existing `register("phone")`
 * validation rules and stored values keep working unchanged.
 *
 * Built without the shared `Field` wrapper: `Field` clones its single
 * child and overwrites that child's `className` with its own input
 * classes, which would fight react-phone-number-input's own two-part
 * (flag select + number input) markup.
 */
export default function PhoneField({
  register,
  setValue,
  watch,
  name = "phone",
  label = "Telephone",
  helper,
  error,
  required = false,
  className,
}) {
  // Called for its side effect only — this registers the field's name and
  // validation rule with react-hook-form without attaching its ref to any
  // DOM node. PhoneInput is fully controlled via watch/setValue instead.
  register(name, required ? { required: "A telephone number is required." } : undefined);
  const value = watch(name);

  return (
    <div className={cn("flex flex-col", className)}>
      <label className="input-label">
        {label}
        {required && (
          <span className="ml-1 text-gold-700" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <PhoneInput
        international
        defaultCountry="DE"
        value={value || undefined}
        onChange={(next) => setValue(name, next ?? "", { shouldDirty: true, shouldValidate: true })}
        numberInputProps={{ "aria-label": label }}
        className={cn("phone-field", error && "phone-field-error")}
      />

      {error ? (
        <p className="input-helper mt-1.5 text-error">{error}</p>
      ) : helper ? (
        <p className="input-helper mt-1.5">{helper}</p>
      ) : null}
    </div>
  );
}
