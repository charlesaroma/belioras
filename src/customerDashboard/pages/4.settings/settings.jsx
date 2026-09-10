/* Customer Dashboard Page: Settings - settings */
import { useForm } from "react-hook-form";

import SettingsPanel from "./sections/SettingsPanel";
import ProfileFields from "./sections/SettingsProfileFields";
import SecurityFields from "./sections/SettingsSecurityFields";
import PreferencesPanel from "./sections/SettingsPreferencesPanel";
import { useAuth } from "../../../context/AuthContext";
import { useCurrency } from "../../../context/CurrencyContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useToast } from "../../../context/ToastContext";

/* Account Settings */
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

  const emailChanged = profile.watch("email")?.trim().toLowerCase() !== user?.email?.toLowerCase();

  const security = useForm({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

/* on Save Profile */
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

/* on Change Password */
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

/* save Preference */
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
