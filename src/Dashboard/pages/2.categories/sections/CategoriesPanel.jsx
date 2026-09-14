/* Admin Dashboard Page: Categories - CategoriesPanel */
import { useState } from "react";
import { Plus, Shapes } from "lucide-react";

import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import { useAsyncData } from "@/hooks/useAsyncData";
import CategoryDialog from "@/Dashboard/components/CategoryDialog";
import DashTable from "@/Dashboard/components/DashTable";
import { detailOptionsFrom, sizeOptionsFrom } from "@/Dashboard/lib/catalogOptions";
import {
  categoryUsage,
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/services/categoriesApi";
import { getTaxonomy } from "@/services/navigationApi";
import { buildCategoryColumns } from "./categoriesColumns";

export default function CategoriesPanel() {
  const { toast } = useToast();
  const [revision, setRevision] = useState(0);
  const refresh = () => setRevision((n) => n + 1);

  const { data: categories, loading } = useAsyncData(getCategories, [revision]);
  const { data: usage } = useAsyncData(categoryUsage, [revision]);
  const { data: taxonomy } = useAsyncData(getTaxonomy, []);

  const [dialog, setDialog] = useState({ open: false, initial: null, n: 0 });
  const [pendingDelete, setPendingDelete] = useState(null);

  const open = (initial) => setDialog((d) => ({ open: true, initial, n: d.n + 1 }));
  const close = () => setDialog((d) => ({ ...d, open: false }));

  const save = async (form) => {
    const editing = dialog.initial;
    const saved = editing ? await updateCategory(editing.id, form) : await createCategory(form);
    close();
    refresh();
    toast(`${saved.name} ${editing ? "saved" : "added"}.`, "success");
  };

  const askDelete = (category) => {
    const count = usage?.[category.id] ?? 0;
    if (count > 0) {
      toast(
        `${category.name} still holds ${count} ${count === 1 ? "product" : "products"}. Move them to another category first.`,
        "error",
      );
      return;
    }
    setPendingDelete(category);
  };

  const confirmDelete = async () => {
    const category = pendingDelete;
    setPendingDelete(null);
    try {
      await deleteCategory(category.id);
      refresh();
      toast(`${category.name} deleted.`, "success");
    } catch (err) {
      toast(err.message ?? "Could not delete that category.", "error");
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-xl text-[13px] leading-relaxed text-espresso-soft">
          What a piece is. Every product belongs to one category, and the category decides which
          sizes, types and details its product form asks for.
        </p>
        <Button icon={Plus} onClick={() => open(null)} className="bg-espresso text-ivory-50 hover:bg-espresso-600">
          Add category
        </Button>
      </div>

      <DashTable
        columns={buildCategoryColumns({ taxonomy, usage, onEdit: open, onDelete: askDelete })}
        data={categories ?? []}
        loading={loading}
        unit={(categories ?? []).length === 1 ? "category" : "categories"}
        empty={{ icon: Shapes, title: "No categories yet", description: "Add the first, such as Dresses." }}
      />

      <CategoryDialog
        key={dialog.n}
        open={dialog.open}
        initial={dialog.initial}
        sizeOptions={sizeOptionsFrom(taxonomy)}
        detailOptions={detailOptionsFrom(taxonomy)}
        onClose={close}
        onSave={save}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title={`Delete ${pendingDelete?.name ?? "category"}?`}
        description="It holds no products, so nothing in the shop changes."
        confirmLabel="Delete category"
      />
    </section>
  );
}
