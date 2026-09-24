/* Customer Dashboard Page: Addresses - addresses */
import { useState } from "react";
import { Plus } from "lucide-react";

import { useCustomerAuth } from "@/context/auth/useAuthRealm";
import { useScopedStorage } from "../../../hooks/useScopedStorage";
import { useToast } from "../../../context/ToastContext";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import AddressForm from "./sections/AddressForm";
import AddressList from "./sections/AddressList";
import { EMPTY_FORM, NO_ADDRESSES, validateAddress } from "./sections/addressesRules";

export default function Addresses() {
  const { user } = useCustomerAuth();
  const { toast } = useToast();

  const [addresses, setAddresses] = useScopedStorage("belioras:addresses", NO_ADDRESSES, user?.id);
  const [pendingRemove, setPendingRemove] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const startAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowForm(true);
  };

  const startEdit = (address) => {
    setEditingId(address.id);
    setForm({
      recipient: address.recipient,
      line1: address.line1,
      city: address.city,
      postcode: address.postcode,
      country: address.country,
    });
    setErrors({});
    setShowForm(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateAddress(form);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    if (editingId) {
      setAddresses((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...form } : a)));
      toast("Address updated", "success");
    } else {
      // The first address saved becomes the default; there is nothing to
      // choose between yet.
      setAddresses((prev) => [
        ...prev,
        { ...form, id: `addr-${Date.now()}`, isDefault: prev.length === 0 },
      ]);
      toast("Address saved", "success");
    }
    closeForm();
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
          onClick={() => (showForm ? closeForm() : startAdd())}
          aria-expanded={showForm}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-espresso px-4 py-2.5 text-sm font-medium text-ivory-50 transition-colors duration-200 hover:bg-umber-500 active:scale-[0.98]"
        >
          <Plus className="size-4" aria-hidden="true" />
          {showForm ? "Cancel" : "Add address"}
        </button>
      </div>

      {showForm ? (
        <AddressForm
          form={form}
          errors={errors}
          onChange={update}
          onSubmit={handleSubmit}
          isEditing={Boolean(editingId)}
        />
      ) : null}

      <AddressList
        addresses={addresses}
        onSetDefault={setDefault}
        onRemove={(id) => setPendingRemove(addresses.find((a) => a.id === id) ?? null)}
        onEdit={startEdit}
        onAddFirst={startAdd}
      />

      <ConfirmDialog
        open={Boolean(pendingRemove)}
        onClose={() => setPendingRemove(null)}
        onConfirm={() => {
          remove(pendingRemove.id);
          setPendingRemove(null);
        }}
        title="Remove this address?"
        description="It will no longer be offered at checkout. Orders already placed are not affected."
        summary={pendingRemove && `${pendingRemove.recipient}, ${pendingRemove.line1}, ${pendingRemove.city}`}
        confirmLabel="Remove"
      />
    </div>
  );
}
