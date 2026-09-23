/* Admin Dashboard Page: Orders - OrdersShipDialog */
import { useState } from "react";

import Modal from "../../../../../components/common/Modal";
import Button from "../../../../../components/ui/Button";
import Field from "../../../../../components/ui/Field";

/**
 * Asked when an order is marked shipped: a tracking number and carrier, if
 * there's one to hand yet. Both are optional — the order still ships without
 * them, and either can be added later by reopening this order... though
 * today there's nowhere to edit them after the fact, so it's worth asking now.
 */
export default function OrdersShipDialog({ ask, onConfirm, onClose }) {
  const [trackingRef, setTrackingRef] = useState("");
  const [carrier, setCarrier] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onConfirm({ trackingRef: trackingRef.trim() || null, carrier: carrier.trim() || null });
    setTrackingRef("");
    setCarrier("");
  };

  const skip = () => {
    onConfirm({ trackingRef: null, carrier: null });
    setTrackingRef("");
    setCarrier("");
  };

  return (
    <Modal open={Boolean(ask)} onClose={onClose} title={ask ? `Mark ${ask.order.id} shipped` : "Mark shipped"} width="max-w-sm">
      <form onSubmit={submit} className="space-y-5">
        <Field label="Tracking number" helper="Optional — add it now, or leave blank and mark shipped anyway.">
          <input value={trackingRef} onChange={(e) => setTrackingRef(e.target.value)} placeholder="e.g. RR123456789PT" autoFocus />
        </Field>

        <Field label="Carrier" helper="Optional.">
          <input value={carrier} onChange={(e) => setCarrier(e.target.value)} placeholder="e.g. CTT, DHL" />
        </Field>

        <div className="flex justify-end gap-2 border-t border-umber-50 pt-4">
          <Button variant="ghost" onClick={skip}>
            Skip
          </Button>
          <Button type="submit" className="bg-espresso text-ivory-50 hover:bg-espresso-600">
            Mark shipped
          </Button>
        </div>
      </form>
    </Modal>
  );
}
