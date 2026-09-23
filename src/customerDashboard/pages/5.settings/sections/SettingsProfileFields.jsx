/* Customer Dashboard Page: Settings - SettingsProfileFields */
import Field from "../../../../components/ui/Field";

export default function ProfileFields({ form, emailChanged }) {
  const { register, formState } = form;

  return (
    <>
      <Field label="Name" required error={formState.errors.name?.message}>
        <input {...register("name", { required: "Please tell us your name." })} />
      </Field>

      <Field
        label="Email"
        required
        error={formState.errors.email?.message}
        helper="Order confirmations and tracking are sent here."
      >
        <input
          type="email"
          {...register("email", {
            required: "An email address is required.",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Check that address." },
          })}
        />
      </Field>

      <Field label="Telephone" helper="Only used if the carrier needs to reach you.">
        <input type="tel" {...register("phone")} />
      </Field>

      {emailChanged && (
        <Field
          label="Confirm with your password"
          required
          className="sm:col-span-2"
          error={formState.errors.currentPassword?.message}
          helper="Changing the address on the account needs your current password."
        >
          <input
            type="password"
            autoComplete="current-password"
            {...register("currentPassword", {
              required: "Enter your password to change the email address.",
            })}
          />
        </Field>
      )}
    </>
  );
}
