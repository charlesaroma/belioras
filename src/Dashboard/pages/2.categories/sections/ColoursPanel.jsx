/* Admin Dashboard Page: Categories - ColoursPanel */
import { useState } from "react";
import { Palette, Pencil, Plus, Trash2 } from "lucide-react";

import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import { useAsyncData } from "@/hooks/useAsyncData";
import ColorDialog from "@/Dashboard/components/ColorDialog";
import DashTable from "@/Dashboard/components/DashTable";
import IconAction from "@/Dashboard/components/IconAction";
import { familyOptionsFrom } from "@/Dashboard/lib/catalogOptions";
import { colorUsage, createColor, deleteColor, getColors, updateColor } from "@/services/colorsApi";
import { getTaxonomy } from "@/services/navigationApi";

export default function ColoursPanel() {
  const { toast } = useToast();
  const [revision, setRevision] = useState(0);
  const refresh = () => setRevision((n) => n + 1);

  const { data: colors, loading } = useAsyncData(getColors, [revision]);
  const { data: usage } = useAsyncData(colorUsage, [revision]);
  const { data: taxonomy } = useAsyncData(getTaxonomy, []);

  const families = familyOptionsFrom(taxonomy);
  const familyById = new Map(families.map((f) => [f.id, f]));

  const [dialog, setDialog] = useState({ open: false, initial: null, n: 0 });
  const [pendingDelete, setPendingDelete] = useState(null);

  const open = (initial) => setDialog((d) => ({ open: true, initial, n: d.n + 1 }));
  const close = () => setDialog((d) => ({ ...d, open: false }));

  const save = async (form) => {
    const editing = dialog.initial;
    const saved = editing ? await updateColor(editing.id, form) : await createColor(form);
    close();
    refresh();
    toast(
      editing ? `${saved.name} saved. Every product in this colour shows the change.` : `${saved.name} added.`,
      "success",
    );
  };

  const askDelete = (color) => {
    const count = usage?.[color.id] ?? 0;
    if (count > 0) {
      toast(
        `${color.name} is on ${count} ${count === 1 ? "product" : "products"}. Remove it from them before deleting.`,
        "error",
      );
      return;
    }
    setPendingDelete(color);
  };

  const confirmDelete = async () => {
    const color = pendingDelete;
    setPendingDelete(null);
    try {
      await deleteColor(color.id);
      refresh();
      toast(`${color.name} deleted.`, "success");
    } catch (err) {
      toast(err.message ?? "Could not delete that colour.", "error");
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Colour",
      cell: ({ row: r }) => (
        <span className="inline-flex items-center gap-3">
          <span aria-hidden="true" className="size-6 border border-umber-100" style={{ backgroundColor: r.original.hex }} />
          <span className="font-medium text-espresso">{r.original.name}</span>
          <code className="text-[11px] text-espresso-soft">{r.original.hex}</code>
        </span>
      ),
    },
    {
      id: "family",
      accessorFn: (c) => familyById.get(c.family)?.name ?? c.family,
      header: "Shop filter",
      cell: ({ row: r, getValue }) => (
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-2.5 border border-umber-50"
            style={{ backgroundColor: familyById.get(r.original.family)?.hex }}
          />
          {getValue()}
        </span>
      ),
    },
    {
      id: "products",
      accessorFn: (c) => usage?.[c.id] ?? 0,
      header: "Products",
      meta: { align: "right" },
      cell: ({ getValue }) => <span className="tabular-nums">{getValue()}</span>,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      meta: { align: "right" },
      cell: ({ row: r }) => (
        <div className="flex justify-end gap-1">
          <IconAction label={`Edit ${r.original.name}`} icon={Pencil} onClick={() => open(r.original)} />
          <IconAction label={`Delete ${r.original.name}`} icon={Trash2} destructive onClick={() => askDelete(r.original)} />
        </div>
      ),
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-xl text-[13px] leading-relaxed text-espresso-soft">
          The colours products come in. Shoppers see the name you give each one; the shop filter
          is the plain colour they filter by, so Ebony and Jet Black both appear under Black.
        </p>
        <Button icon={Plus} onClick={() => open(null)} className="bg-espresso text-ivory-50 hover:bg-espresso-600">
          Add colour
        </Button>
      </div>

      <DashTable
        columns={columns}
        data={colors ?? []}
        loading={loading}
        initialSorting={[{ id: "name", desc: false }]}
        unit={(colors ?? []).length === 1 ? "colour" : "colours"}
        empty={{ icon: Palette, title: "No colours yet", description: "Add the first, such as Ebony." }}
      />

      <ColorDialog key={dialog.n} open={dialog.open} initial={dialog.initial} families={families} onClose={close} onSave={save} />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title={`Delete ${pendingDelete?.name ?? "colour"}?`}
        description="No product uses it, so nothing in the shop changes."
        confirmLabel="Delete colour"
      />
    </section>
  );
}
