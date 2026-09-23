/* Admin Dashboard Page: Categories - DetailsPanel */
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import { useAsyncData } from "@/hooks/useAsyncData";
import DetailValueDialog from "@/AdminDashboard/components/DetailValueDialog";
import DashTabs from "@/AdminDashboard/components/DashTabs";
import IconAction from "@/AdminDashboard/components/IconAction";
import { detailOptionsFrom } from "@/AdminDashboard/lib/catalogOptions";
import { getTaxonomy } from "@/services/catalog/navigationApi";
import {
  createDetailValue,
  deleteDetailValue,
  detailValueUsage,
  renameDetailValue,
} from "@/services/catalog/taxonomyApi";

/**
 * Occasion, Fabric, Style, Length and Hair: the chips a product form offers
 * once its category asks for that detail (set in the category's own dialog).
 * Colour and Size live elsewhere, since each carries more than a name.
 */
export default function DetailsPanel() {
  const { toast } = useToast();
  const [revision, setRevision] = useState(0);
  const refresh = () => setRevision((n) => n + 1);

  const { data: taxonomy, loading } = useAsyncData(getTaxonomy, [revision]);
  const { data: usage } = useAsyncData(detailValueUsage, [revision]);

  const dimensions = detailOptionsFrom(taxonomy ?? {});
  const [dim, setDim] = useState(dimensions[0]?.id);
  const active = dimensions.find((d) => d.id === dim) ?? dimensions[0];
  const rows = active ? (taxonomy?.[active.id]?.values ?? []) : [];

  const [dialog, setDialog] = useState({ open: false, initial: null, n: 0 });
  const [pendingDelete, setPendingDelete] = useState(null);

  const openDialog = (initial) => setDialog((d) => ({ open: true, initial, n: d.n + 1 }));
  const closeDialog = () => setDialog((d) => ({ ...d, open: false }));

  const save = async (name) => {
    const saved = dialog.initial
      ? await renameDetailValue(active.id, dialog.initial.id, name)
      : await createDetailValue(active.id, name);
    closeDialog();
    refresh();
    toast(`${saved.name} ${dialog.initial ? "saved" : "added"}.`, "success");
  };

  const askDelete = (value) => {
    const count = usage?.[`${active.prefix}:${value.id}`] ?? 0;
    if (count > 0) {
      toast(`${value.name} is on ${count} ${count === 1 ? "product" : "products"}. Remove it from them first.`, "error");
      return;
    }
    setPendingDelete(value);
  };

  const confirmDelete = async () => {
    const value = pendingDelete;
    setPendingDelete(null);
    try {
      await deleteDetailValue(active.id, value.id);
      refresh();
      toast(`${value.name} deleted.`, "success");
    } catch (err) {
      toast(err.message ?? "Could not delete that.", "error");
    }
  };

  if (loading || !active) return <p className="text-[13px] text-espresso-soft">Loading…</p>;

  return (
    <section className="space-y-4">
      <p className="max-w-xl text-[13px] leading-relaxed text-espresso-soft">
        The chips a product form offers under &ldquo;More details&rdquo;, once a category asks for that
        detail. Renaming keeps every product tagged with it; a value still in use can&rsquo;t be deleted.
      </p>

      <DashTabs
        ariaLabel="Detail dimension"
        options={dimensions.map((d) => ({ value: d.id, label: d.label, count: (taxonomy[d.id]?.values ?? []).length }))}
        value={active.id}
        onChange={setDim}
      />

      <div className="flex items-center justify-end">
        <Button icon={Plus} size="sm" onClick={() => openDialog(null)} className="h-10">
          Add {active.label.toLowerCase()}
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="border border-dashed border-umber-100 px-4 py-6 text-center text-[13px] text-espresso-soft">
          No {active.label.toLowerCase()} values yet.
        </p>
      ) : (
        <ul className="divide-y divide-umber-50 border border-umber-50 bg-ivory-50">
          {rows.map((value) => (
            <li key={value.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <span className="min-w-0 truncate text-[13px] text-espresso">{value.name}</span>
              <span className="ml-auto shrink-0 text-[11px] tabular-nums text-espresso-soft">
                {usage?.[`${active.prefix}:${value.id}`] ?? 0} products
              </span>
              <div className="flex shrink-0 items-center">
                <IconAction label={`Rename ${value.name}`} icon={Pencil} onClick={() => openDialog(value)} />
                <IconAction label={`Delete ${value.name}`} icon={Trash2} destructive onClick={() => askDelete(value)} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <DetailValueDialog
        key={dialog.n}
        open={dialog.open}
        dimensionLabel={active.label}
        initial={dialog.initial}
        onClose={closeDialog}
        onSave={save}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title={`Delete ${pendingDelete?.name ?? "this value"}?`}
        description="No product uses it, so nothing in the shop changes."
        confirmLabel="Delete"
      />
    </section>
  );
}
