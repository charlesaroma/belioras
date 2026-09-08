import { useForm } from "react-hook-form";

import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";
import { useAuth } from "../../context/AuthContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../../context/ToastContext";

/**
 * Profile, security and preferences.
 *
 * New: there was no way to change a name, an email or a password anywhere in
 * the application — a grep for updateProfile or changePassword across the repo
 * returned nothing.
 *
 * Preferences write to the account as well as to the device. Language and
 * currency previously lived only in device-global localStorage keys, so
 * signing in on a phone meant setting them again, and the account record had
 * no idea what the shopper preferred.
 */
export default function AccountSettings() {
  const { user, updateProfile, changePassword } = useAuth();
  const { language, setLanguage, locales } = useLanguage();
  const { currency, setCurrency, currencies } = useCurrency();
  const { toast } = useToast();

  const profile = useForm({
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
    },
  });

  const security = useForm({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSaveProfile = async (values) => {
    try {
      await updateProfile(values);
      toast("Profile saved.", "success");
      profile.reset(values);
    } catch (err) {
      toast(err.message ?? "Could not save your profile.", "error");
    }
  };

  const onChangePassword = async (values) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast("Password changed.", "success");
      security.reset();
    } catch (err) {
      toast(err.message ?? "Could not change your password.", "error");
    }
  };

  /**
   * Preferences save immediately rather than behind a Save button.
   *
   * They take effect the moment they change — the whole page is already in the
   * new language — so a button that appears to confirm something already done
   * would be theatre.
   */
  const savePreference = async (patch, applyLocally) => {
    applyLocally();
    try {
      await updateProfile(patch);
    } catch {
      // The device preference still applied; only the account copy failed, and
      // interrupting a shopper with a toast about that would be noise.
    }
  };

  return (
    <div className="space-y-10">
      <Panel
        title="Profile"
        hint="How we address you, and where order confirmations go."
        onSubmit={profile.handleSubmit(onSaveProfile)}
        submitting={profile.formState.isSubmitting}
      >
        <Field label="Name" required error={profile.formState.errors.name?.message}>
          <input {...profile.register("name", { required: "Please tell us your name." })} />
        </Field>

        <Field
          label="Email"
          required
          error={profile.formState.errors.email?.message}
          helper="Order confirmations and tracking are sent here."
        >
          <input
            type="email"
            {...profile.register("email", {
              required: "An email address is required.",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Check that address." },
            })}
          />
        </Field>

        <Field label="Telephone" helper="Only used if the carrier needs to reach you.">
          <input type="tel" {...profile.register("phone")} />
        </Field>
      </Panel>

      <Panel
        title="Security"
        hint="Changing your password signs you out of nothing else — this is a demo account system."
        onSubmit={security.handleSubmit(onChangePassword)}
        submitting={security.formState.isSubmitting}
        submitLabel="Change password"
      >
        <Field
          label="Current password"
          required
          error={security.formState.errors.currentPassword?.message}
        >
          <input
            type="password"
            autoComplete="current-password"
            {...security.register("currentPassword", { required: "Enter your current password." })}
          />
        </Field>

        <Field
          label="New password"
          required
          error={security.formState.errors.newPassword?.message}
          helper="At least 6 characters."
        >
          <input
            type="password"
            autoComplete="new-password"
            {...security.register("newPassword", {
              required: "Choose a new password.",
              minLength: { value: 6, message: "At least 6 characters." },
            })}
          />
        </Field>

        <Field
          label="Confirm new password"
          required
          error={security.formState.errors.confirmPassword?.message}
        >
          <input
            type="password"
            autoComplete="new-password"
            {...security.register("confirmPassword", {
              validate: (value) =>
                value === security.getValues("newPassword") || "These do not match.",
            })}
          />
        </Field>
      </Panel>

      <section className="border border-umber-50 bg-ivory-50 p-6">
        <h2 className="font-display text-xl tracking-wide text-espresso">Preferences</h2>
        <p className="mt-1 text-[12px] leading-relaxed text-espresso-soft">
          Saved to your account, so they follow you to another device.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Language">
            <select
              value={language}
              onChange={(e) =>
                savePreference({ locale: e.target.value }, () => setLanguage(e.target.value))
              }
            >
              {locales.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Currency" helper="Prices are held in euros and converted for display.">
            <select
              value={currency}
              onChange={(e) =>
                savePreference({ currency: e.target.value }, () => setCurrency(e.target.value))
              }
            >
              {currencies.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>
    </div>
  );
}

function Panel({ title, hint, children, onSubmit, submitting, submitLabel = "Save changes" }) {
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
