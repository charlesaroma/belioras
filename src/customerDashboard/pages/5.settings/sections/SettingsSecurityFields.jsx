/* Customer Dashboard Page: Settings - SettingsSecurityFields */
import Field from "../../../../components/ui/Field";

/* MIN LENGTH */
const MIN_LENGTH = 6;

export default function SecurityFields({ form }) {
  const { register, formState, getValues } = form;

  return (
    <>
      <Field label="Current password" required error={formState.errors.currentPassword?.message}>
        <input
          type="password"
          autoComplete="current-password"
          {...register("currentPassword", { required: "Enter your current password." })}
        />
      </Field>

      <Field
        label="New password"
        required
        error={formState.errors.newPassword?.message}
        helper={`At least ${MIN_LENGTH} characters.`}
      >
        <input
          type="password"
          autoComplete="new-password"
          {...register("newPassword", {
            required: "Choose a new password.",
            minLength: { value: MIN_LENGTH, message: `At least ${MIN_LENGTH} characters.` },
          })}
        />
      </Field>

      <Field
        label="Confirm new password"
        required
        error={formState.errors.confirmPassword?.message}
      >
        <input
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword", {
            validate: (value) => value === getValues("newPassword") || "These do not match.",
          })}
        />
      </Field>
    </>
  );
}
