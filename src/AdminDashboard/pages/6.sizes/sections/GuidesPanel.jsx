/* Admin Dashboard Page: Sizes - GuidesPanel */
import { useState } from "react";
import { Eye, Pencil, RotateCcw, Shirt } from "lucide-react";

import Modal from "@/components/common/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import SizeChart from "@/components/storefront/sizeChart/SizeChart";
import { useToast } from "@/context/ToastContext";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getSizeCharts, resetSizeCharts } from "@/services/catalog/sizeChartApi";
import GarmentGuideDialog from "./GarmentGuideDialog";
import FootwearGuideDialog from "./FootwearGuideDialog";
import HairGuideDialog from "./HairGuideDialog";

const CARDS = [
  { kind: "garment", title: "Dresses sizing", blurb: "Body measurements, international equivalents, how to measure." },
  { kind: "footwear", title: "Footwear sizing", blurb: "EU, UK and US conversions, how to measure a foot." },
  { kind: "hair", title: "Hair sizing", blurb: "Lengths, how each texture wears, how it's measured." },
];

const DIALOGS = { garment: GarmentGuideDialog, footwear: FootwearGuideDialog, hair: HairGuideDialog };

/** The measurement tables behind every "Size guide" a shopper opens. What you edit here is what they see. */
export default function GuidesPanel() {
  const { toast } = useToast();
  const [revision, setRevision] = useState(0);
  const refresh = () => setRevision((n) => n + 1);

  const { data: charts, loading } = useAsyncData(getSizeCharts, [revision]);
  const [editing, setEditing] = useState({ kind: null, n: 0 });
  const [preview, setPreview] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const openEdit = (kind) => setEditing((e) => ({ kind, n: e.n + 1 }));
  const closeEdit = () => setEditing((e) => ({ ...e, kind: null }));
  const EditDialog = DIALOGS[editing.kind];

  const doReset = async () => {
    setConfirmReset(false);
    await resetSizeCharts();
    refresh();
    toast("Size guides restored to the shipped tables.", "success");
  };

  if (loading || !charts) return <p className="text-[13px] text-espresso-soft">Loading…</p>;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <p className="max-w-xl text-[13px] leading-relaxed text-espresso-soft">
          The tables behind &ldquo;Size guide&rdquo; on a product page, and the standalone hair-length and
          shoe-size guides. Edit one, then preview it exactly as a shopper sees it.
        </p>
        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          className="inline-flex shrink-0 items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-espresso-soft transition-colors hover:text-error"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Restore shipped tables
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {CARDS.map((c) => (
          <div key={c.kind} className="flex flex-col border border-umber-50 bg-ivory-50 p-5">
            <Shirt className="size-5 text-gold-700" strokeWidth={1.5} aria-hidden="true" />
            <p className="mt-3 font-display text-lg tracking-wide text-espresso">{c.title}</p>
            <p className="mt-1 flex-1 text-[12px] leading-relaxed text-espresso-soft">{c.blurb}</p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => openEdit(c.kind)} className="btn btn-sm btn-secondary flex-1">
                <Pencil className="size-3.5" aria-hidden="true" />
                Edit
              </button>
              <button type="button" onClick={() => setPreview(c.kind)} aria-label={`Preview ${c.title}`} className="btn btn-sm btn-ghost">
                <Eye className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {EditDialog && (
        <EditDialog
          key={editing.n}
          open={Boolean(editing.kind)}
          charts={charts}
          onClose={closeEdit}
          onSaved={() => {
            closeEdit();
            refresh();
          }}
        />
      )}

      <Modal open={Boolean(preview)} onClose={() => setPreview(null)} title="Size guide preview" width="max-w-2xl">
        {preview && <SizeChart kind={preview} />}
      </Modal>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={doReset}
        title="Restore the shipped size guides?"
        description="Every edit made here is discarded. This cannot be undone."
        confirmLabel="Restore"
      />
    </section>
  );
}
