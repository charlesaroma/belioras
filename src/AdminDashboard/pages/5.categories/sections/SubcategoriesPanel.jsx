/* Admin Dashboard Page: Categories - SubcategoriesPanel */
import { useState } from "react";
import { Plus } from "lucide-react";

import Button from "@/components/ui/Button";
import DashTabs from "@/AdminDashboard/components/DashTabs";
import { useToast } from "@/context/ToastContext";
import { useContentVersion } from "@/context/ContentContext";
import { useAsyncData } from "@/hooks/useAsyncData";
import { detailOptionsFrom } from "@/AdminDashboard/lib/catalogOptions";
import { getCategories } from "@/services/catalog/categoriesApi";
import { getNavigationForEditing, getTaxonomy, updateNavigation } from "@/services/catalog/navigationApi";
import { getProducts } from "@/services/catalog/productsApi";
import { createDetailValue } from "@/services/catalog/taxonomyApi";
import MegaMenuColumn from "@/AdminDashboard/pages/7.mega-menu/sections/MegaMenuColumn";
import MegaMenuPickers from "@/AdminDashboard/pages/7.mega-menu/sections/MegaMenuPickers";
import { applyPick } from "@/AdminDashboard/pages/7.mega-menu/sections/megaMenuActions";
import { makeRootEditor } from "@/AdminDashboard/pages/7.mega-menu/sections/megaMenuEdits";
import { addRootIn, newLeaf, patchRootIn } from "@/AdminDashboard/pages/7.mega-menu/sections/megaMenuTree";
import NewSubcategoryValueDialog from "./NewSubcategoryValueDialog";

/** A new column, addressed uniquely by time — kept outside the component body,
 * matching megaMenuTree.js's own addRootIn/newLeaf, since Date.now() run
 * during render is flagged as impure. */
function newColumn(rootId, title, items) {
  return { id: `${rootId}-col-${Date.now().toString(36)}`, title, items };
}

/**
 * What actually shows under a category in the live mega menu — "Shop by
 * Fabric", "Shop by Colour" and so on — reusing the Mega Menu page's own
 * column editor and picker rather than a second copy of that logic. This is
 * the thing a category's "3 subcategories" count on the Categories tab does
 * not capture: that count is the category's product *types* (Jumpsuits,
 * Coats & Jackets), a narrower, separate idea from these menu columns, which
 * also mix in filter values (length, occasion, style, fabric, colour).
 */
export default function SubcategoriesPanel() {
  const { toast } = useToast();
  const version = useContentVersion();

  const { data: categories, loading: loadingCategories } = useAsyncData(getCategories, [version]);
  const { data: navigation, loading: loadingNav } = useAsyncData(getNavigationForEditing, [version]);
  const { data: taxonomy } = useAsyncData(getTaxonomy, []);
  const { data: products } = useAsyncData(getProducts, [version]);

  const [catId, setCatId] = useState(null);
  const [edits, setEdits] = useState(null);
  const [saving, setSaving] = useState(false);
  const [picker, setPicker] = useState({ request: null, n: 0 });
  const [valueDialogOpen, setValueDialogOpen] = useState(false);

  const cats = categories ?? [];
  const draft = edits ?? navigation ?? [];
  const activeCatId = catId ?? cats[0]?.id;
  const category = cats.find((c) => c.id === activeCatId);
  const lookups = { categories: cats, taxonomy: taxonomy ?? {}, products: products ?? [] };

  const root = draft.find((r) => r.target?.kind === "category" && r.target.id === activeCatId);
  const sections = root?.sections ?? [];
  const dirty = Boolean(edits) && JSON.stringify(edits) !== JSON.stringify(navigation);

  const dimensionOptions = category
    ? detailOptionsFrom(taxonomy ?? {}).filter((d) => (category.details ?? []).includes(d.id))
    : [];
  const sectionOptions = sections.map((s) => ({ value: s.id, label: s.title || "Untitled column" }));

  const onPick = (request) => setPicker((p) => ({ request, n: p.n + 1 }));
  const closePicker = () => setPicker((p) => ({ ...p, request: null }));

  const applyResult = (result) => {
    const { tree } = applyPick(draft, picker.request, result);
    setEdits(tree);
    closePicker();
  };

  const createDropdown = () => {
    setEdits(addRootIn(draft, { label: category.name, target: { kind: "category", id: category.id } }));
  };

  const editor = root ? makeRootEditor(root, (patch) => setEdits(patchRootIn(draft, root.id, patch))) : null;

  const addNewValue = async ({ dimension, name, sectionId }) => {
    const created = await createDetailValue(dimension, name);
    const target = { kind: "filter", dimension, values: [created.id] };
    const leaf = newLeaf(draft, root, { label: created.name, target });

    const nextSections = sectionId
      ? root.sections.map((s) => (s.id === sectionId ? { ...s, items: [...s.items, leaf] } : s))
      : [
          ...root.sections,
          newColumn(root.id, `Shop by ${dimensionOptions.find((d) => d.id === dimension)?.label ?? dimension}`, [leaf]),
        ];

    setEdits(patchRootIn(draft, root.id, { sections: nextSections }));
    setValueDialogOpen(false);
    toast(`${created.name} added to the menu.`, "success");
  };

  const save = async () => {
    setSaving(true);
    try {
      await updateNavigation(draft);
      setEdits(null);
      toast("Saved. The shop's menu is showing it now.", "success");
    } catch (err) {
      toast(err.message ?? "Could not save those columns.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loadingCategories || loadingNav || !category) {
    return <p className="text-[13px] text-espresso-soft">Loading…</p>;
  }

  return (
    <section className="space-y-4">
      <p className="max-w-xl text-[13px] leading-relaxed text-espresso-soft">
        What shoppers actually see in the menu under this category — the &ldquo;Shop by Fabric&rdquo;,
        &ldquo;Shop by Colour&rdquo; style columns. &ldquo;Add link&rdquo; picks from an existing type, colour
        or detail; &ldquo;New value&rdquo; creates a brand-new detail (occasion, fabric, style, length…) and
        drops it straight into a column, in one step.
      </p>

      <DashTabs
        ariaLabel="Category"
        options={cats.map((c) => ({ value: c.id, label: c.name }))}
        value={activeCatId}
        onChange={setCatId}
      />

      {!root ? (
        <div className="border border-dashed border-umber-100 px-4 py-8 text-center">
          <p className="text-[13px] text-espresso-soft">{category.name} has no dropdown menu yet.</p>
          <Button className="mt-3" size="sm" onClick={createDropdown}>
            Add a dropdown for {category.name}
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12px] text-espresso-soft">
              {sections.length} {sections.length === 1 ? "column" : "columns"} live now under{" "}
              <code className="text-espresso">/{category.id}</code> in the menu.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {dimensionOptions.length > 0 && (
                <button
                  type="button"
                  onClick={() => setValueDialogOpen(true)}
                  className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-gold-700 transition-colors hover:text-espresso"
                >
                  <Plus className="size-3.5" aria-hidden="true" />
                  New value
                </button>
              )}
              <button
                type="button"
                onClick={editor.addSection}
                className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-gold-700 transition-colors hover:text-espresso"
              >
                <Plus className="size-3.5" aria-hidden="true" />
                Add column
              </button>
              <Button size="sm" onClick={save} loading={saving} disabled={!dirty}>
                Save
              </Button>
            </div>
          </div>

          {sections.length === 0 ? (
            <p className="border border-dashed border-umber-100 px-4 py-4 text-[13px] text-espresso-soft">
              No columns yet. Add one to give {category.name} a dropdown.
            </p>
          ) : (
            <div className="grid gap-3 xl:grid-cols-2">
              {sections.map((section, i) => (
                <MegaMenuColumn
                  key={section.id}
                  root={root}
                  section={section}
                  index={i}
                  total={sections.length}
                  editor={editor}
                  lookups={lookups}
                  onPick={onPick}
                />
              ))}
            </div>
          )}
        </>
      )}

      <MegaMenuPickers picker={picker} draft={draft} lookups={lookups} onClose={closePicker} onSave={applyResult} />

      {root && (
        <NewSubcategoryValueDialog
          key={valueDialogOpen}
          open={valueDialogOpen}
          dimensionOptions={dimensionOptions}
          sectionOptions={sectionOptions}
          onClose={() => setValueDialogOpen(false)}
          onSave={addNewValue}
        />
      )}
    </section>
  );
}
