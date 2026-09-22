/* Admin Dashboard Page: Sizes - FootwearGuideDialog */
import { useState } from "react";

import Modal from "@/components/common/Modal";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { useToast } from "@/context/ToastContext";
import { updateSizeChart } from "@/services/catalog/sizeChartApi";
import { FOOTWEAR_COLUMNS, HOW_TO_COLUMNS } from "./guideColumns";
import GuideRowsEditor from "./GuideRowsEditor";

/** Footwear sizing: EU/UK/US conversions and how to measure a foot. Remount with a changing `key`. */
export default function FootwearGuideDialog({ open, charts, onClose, onSaved }) {
  const { toast } = useToast();
  const [note, setNote] = useState(charts?.footwear.note ?? "");
  const [rows, setRows] = useState(charts?.footwear.rows ?? []);
  const [howTo, setHowTo] = useState(charts?.howToMeasure.footwear ?? []);
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSizeChart("footwear", { note, rows });
      await updateSizeChart("howToMeasure", { ...charts.howToMeasure, footwear: howTo });
      toast("Footwear sizing saved.", "success");
      onSaved();
    } catch (err) {
      toast(err.message ?? "Could not save that.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Footwear sizing" width="max-w-2xl">
      <form onSubmit={save} className="space-y-6">
        <Field label="Note" helper="Shown under the size table.">
          <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} className="h-auto min-h-16 resize-y" />
        </Field>

        <div>
          <p className="input-label">Size conversions</p>
          <GuideRowsEditor columns={FOOTWEAR_COLUMNS} rows={rows} onChange={setRows} />
        </div>

        <div>
          <p className="input-label">How to measure</p>
          <GuideRowsEditor columns={HOW_TO_COLUMNS} rows={howTo} onChange={setHowTo} />
        </div>

        <div className="flex justify-end gap-2 border-t border-umber-50 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving} className="bg-espresso text-ivory-50 hover:bg-espresso-600">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
