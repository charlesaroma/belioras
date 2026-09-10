/* Customer Dashboard Page: Addresses - addresses */
import { useState } from "react";
import { Plus } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { useScopedStorage } from "../../../hooks/useScopedStorage";
import { useToast } from "../../../context/ToastContext";
import AddressForm from "./sections/AddressForm";
import AddressList from "./sections/AddressList";
import { EMPTY_FORM, NO_ADDRESSES, validateAddress } from "./sections/addressesRules";

export default function Addresses() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [addresses, setAddresses] = useScopedStorage("belioras:addresses", NO_ADDRESSES, user?.id);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateAddress(form);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    // The first address saved becomes the default; there is nothing to choose
    // between yet.
    setAddresses([
      ...addresses,
      { ...form, id: `addr-${Date.now()}`, isDefault: addresses.length === 0 },
    ]);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowForm(false);
    toast("Address saved", "success");
  };

  const remove = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast("Address removed", "info");
  };

  const setDefault = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    toast("Default address updated", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-medium tracking-wide">Addresses</h2>
          <p className="mt-1 text-sm text-espresso-soft">
            Manage the delivery addresses used at checkout.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          aria-expanded={showForm}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-espresso px-4 py-2.5 text-sm font-medium text-ivory-50 transition-colors duration-200 hover:bg-umber-500 active:scale-[0.98]"
        >
          <Plus className="size-4" aria-hidden="true" />
          {showForm ? "Cancel" : "Add address"}
        </button>
      </div>

      {showForm ? (
        <AddressForm form={form} errors={errors} onChange={update} onSubmit={handleSubmit} />
      ) : null}

      <AddressList
        addresses={addresses}
        onSetDefault={setDefault}
        onRemove={remove}
        onAddFirst={() => setShowForm(true)}
      />
    </div>
  );
}
