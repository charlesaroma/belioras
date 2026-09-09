import Button from "../../../components/ui/Button";

/**
 * A titled block of settings with its own save button.
 *
 * Each panel is its own form, so saving the profile does not also submit the
 * password fields — and a validation error in one does not block the other.
 * Lifted out of Settings.jsx to keep that file under the 250-line convention.
 */
export default function SettingsPanel({
  title,
  hint,
  children,
  onSubmit,
  submitting,
  submitLabel = "Save changes",
}) {
  return (
    <form onSubmit={onSubmit} className="border border-umber-50 bg-ivory-50 p-6">
      <h2 className="font-display text-xl tracking-wide text-espresso">{title}</h2>
      {hint && <p className="mt-1 text-[12px] leading-relaxed text-espresso-soft">{hint}</p>}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>

      <div className="mt-6 flex justify-end">
        <Button type="submit" size="md" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
