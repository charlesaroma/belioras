/* Admin Dashboard Page: Categories - CategoriesPanel */
import { useState } from "react";
import { Plus } from "lucide-react";

import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import { useAsyncData } from "@/hooks/useAsyncData";
import CategoryDialog from "@/Dashboard/components/CategoryDialog";
import DashListToolbar from "@/Dashboard/components/DashListToolbar";
import { detailOptionsFrom, sizeOptionsFrom } from "@/Dashboard/lib/catalogOptions";
import {
  categoryUsage,
  createCategory,
  deleteCategory,
  getCategories,
  typeUsage,
  updateCategory,
} from "@/services/catalog/categoriesApi";
import { getTaxonomy } from "@/services/catalog/navigationApi";
import CategoriesTree from "./CategoriesTree";

export default function CategoriesPanel() {
  const { toast } = useToast();
  const [revision, setRevision] = useState(0);
  const refresh = () => setRevision((n) => n + 1);

  const { data: categories, loading } = useAsyncData(getCategories, [revision]);
  const { data: usage } = useAsyncData(categoryUsage, [revision]);
  const { data: types } = useAsyncData(typeUsage, [revision]);
  const { data: taxonomy } = useAsyncData(getTaxonomy, []);

  const [dialog, setDialog] = useState({ open: false, initial: null, n: 0 });
  const [pendingDelete, setPendingDelete] = useState(null);
  const [query, setQuery] = useState("");

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
      <p className="max-w-xl text-[13px] leading-relaxed text-espresso-soft">
        What a piece is. Every product belongs to one category, and the category decides which
        sizes, types and details its product form asks for.
      </p>

      <DashListToolbar
        actions={
          <Button icon={Plus} size="sm" onClick={() => open(null)} className="h-10">
            <span className="hidden sm:inline">Add category</span>
            <span className="sm:hidden">Add</span>
          </Button>
        }
        query={query}
        onQueryChange={setQuery}
        placeholder="Search categories or subcategories"
      />

      {/* A hierarchy, not a flat table: a category's subcategories (Dresses
          holds Jumpsuits, Two-Piece Sets…) are its children, not a cell in
          its row. There are few enough categories that paging buys nothing. */}
      {loading ? (
        <p className="text-[13px] text-espresso-soft">Loading…</p>
      ) : (
        <CategoriesTree
          categories={categories ?? []}
          usage={usage}
          typeUsage={types}
          query={query}
          onEdit={open}
          onDelete={askDelete}
        />
      )}

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
