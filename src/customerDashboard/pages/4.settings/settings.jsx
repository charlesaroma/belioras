import { useForm } from "react-hook-form";

import SettingsPanel from "./sections/SettingsPanel";
import ProfileFields from "./sections/ProfileFields";
import SecurityFields from "./sections/SecurityFields";
import PreferencesPanel from "./sections/PreferencesPanel";
import { useAuth } from "../../../context/AuthContext";
import { useCurrency } from "../../../context/CurrencyContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useToast } from "../../../context/ToastContext";

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
  const { user, updateProfile, changePassword, verifyPassword } = useAuth();
  const { language, setLanguage, locales } = useLanguage();
  const { currency, setCurrency, currencies } = useCurrency();
  const { toast } = useToast();

  const profile = useForm({
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      currentPassword: "",
    },
  });

  /**
   * Changing the email address is the sensitive one: it is the address every
   * password reset and order confirmation goes to, so taking it over is how
   * an account gets taken over. Ask for the password only when it has actually
   * changed — a name or phone edit stays a single step.
   */
  const emailChanged = profile.watch("email")?.trim().toLowerCase() !== user?.email?.toLowerCase();

  const security = useForm({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSaveProfile = async (values) => {
    const { currentPassword, ...patch } = values;

    try {
      // Throws 401 before anything is written, so a wrong password cannot
      // half-apply the change.
      if (emailChanged) await verifyPassword(currentPassword);
      await updateProfile(patch);
      toast("Profile saved.", "success");
      profile.reset({ ...patch, currentPassword: "" });
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
      <SettingsPanel
        title="Profile"
        hint="How we address you, and where order confirmations go."
        onSubmit={profile.handleSubmit(onSaveProfile)}
        submitting={profile.formState.isSubmitting}
      >
        <ProfileFields form={profile} emailChanged={emailChanged} />
      </SettingsPanel>

      <SettingsPanel
        title="Security"
        hint="Changing your password signs you out of nothing else — this is a demo account system."
        onSubmit={security.handleSubmit(onChangePassword)}
        submitting={security.formState.isSubmitting}
        submitLabel="Change password"
      >
        <SecurityFields form={security} />
      </SettingsPanel>

      <PreferencesPanel
        language={language}
        locales={locales}
        onLanguageChange={(code) => savePreference({ locale: code }, () => setLanguage(code))}
        currency={currency}
        currencies={currencies}
        onCurrencyChange={(code) => savePreference({ currency: code }, () => setCurrency(code))}
      />
    </div>
  );
}
