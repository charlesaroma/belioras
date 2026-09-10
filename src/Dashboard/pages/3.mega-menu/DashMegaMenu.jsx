import { useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw, Save } from "lucide-react";

import Button from "../../../components/ui/Button";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import { useContentVersion } from "../../../context/ContentContext";
import { useToast } from "../../../context/ToastContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getNavigation, resetNavigation, updateNavigation } from "../../../services/navigationApi";
import { getProducts } from "../../../services/productsApi";
import IconButton from "./sections/IconButton";
import MenuRoot from "./sections/MenuRoot";

/**
 * The mega menu.
 *
 * Its own section because the navigation tree is its own thing. It was a
 * read-only list buried under Categories, which conflated two jobs: the
 * attribute vocabulary a piece is tagged with, and the structure shoppers
 * navigate. Categories keeps the first; this owns the second.
 *
 * Every link carries a live product count, so one returning nothing is visible
 * here rather than discovered by a shopper landing on an empty grid.
 *
 * Edits are held locally and saved in one action. The tree is a single ordered
 * document — reordering one item shifts its siblings — so saving per keystroke
 * would rewrite the whole thing on every character.
 */
export default function DashMegaMenu() {
  const { toast } = useToast();
  const version = useContentVersion();

  const { data: navigation, loading } = useAsyncData(getNavigation, [version]);
  const { data: products } = useAsyncData(getProducts, []);

  // null means "not edited yet, show what loaded". Derived during render
  // rather than copied in an effect, which would render the old tree for a
  // frame and re-render immediately.
  const [edits, setEdits] = useState(null);
  const draft = edits ?? navigation ?? [];

  const [saving, setSaving] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [openRoot, setOpenRoot] = useState(null);

  const dirty = Boolean(edits) && JSON.stringify(edits) !== JSON.stringify(navigation);

  /** Live product count per link, matched on the leaf's own slug segment. */
  const countFor = (item) => {
    if (!products) return null;
    const slug = item.slug?.split("/").pop();
    if (!slug) return null;
    return products.filter((p) => (p.tags ?? []).some((t) => t.endsWith(`:${slug}`))).length;
  };

  const patchRoot = (rootId, patch) =>
    setEdits(draft.map((r) => (r.id === rootId ? { ...r, ...patch } : r)));

  const moveRoot = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= draft.length) return;
    const next = [...draft];
    [next[index], next[target]] = [next[target], next[index]];
    setEdits(next);
  };

  const save = async () => {
    setSaving(true);
    try {
      await updateNavigation(draft);
      setEdits(null);
      toast("Mega menu saved. The storefront menu is showing it now.", "success");
    } catch (err) {
      toast(err.message ?? "Could not save the menu.", "error");
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    setConfirmReset(false);
    await resetNavigation();
    setEdits(null);
    toast("Menu restored to the shipped version.", "success");
  };

  if (loading) {
    return (
      <div className="space-y-4" aria-hidden="true">
        <div className="skeleton h-10 w-full" />
        <div className="skeleton h-64 w-full" />
      </div>
    );
  }

  const totalLinks = draft.reduce(
    (n, root) => n + (root.sections ?? []).reduce((m, s) => m + (s.items ?? []).length, 0),
    0,
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] text-espresso-soft">
          {draft.length} top-level menus · {totalLinks} links
          {dirty && <span className="ml-2 text-gold-700">· unsaved changes</span>}
        </p>

        <div className="flex gap-2">
          <Button variant="ghost" size="md" icon={RotateCcw} onClick={() => setConfirmReset(true)}>
            Restore shipped menu
          </Button>
          <Button size="md" icon={Save} onClick={save} loading={saving} disabled={!dirty}>
            Save menu
          </Button>
        </div>
      </div>

      <ul className="space-y-3">
        {draft.map((root, i) => (
          <li key={root.id}>
            <MenuRoot
              root={root}
              open={openRoot === root.id}
              onToggle={() => setOpenRoot(openRoot === root.id ? null : root.id)}
              onPatch={(patch) => patchRoot(root.id, patch)}
              countFor={countFor}
              controls={
                <>
                  <IconButton
                    label={`Move ${root.label} earlier`}
                    icon={ChevronUp}
                    disabled={i === 0}
                    onClick={() => moveRoot(i, -1)}
                  />
                  <IconButton
                    label={`Move ${root.label} later`}
                    icon={ChevronDown}
                    disabled={i === draft.length - 1}
                    onClick={() => moveRoot(i, 1)}
                  />
                </>
              }
            />
          </li>
        ))}
      </ul>

      <p className="text-[11px] leading-relaxed text-espresso-soft">
        A link&rsquo;s path is where shoppers land. Paths are resolved against this same tree, so
        anything not listed here returns a 404 — which is what stops a typo becoming a silent dead
        end rather than a visible one.
      </p>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={reset}
        title="Restore the shipped menu?"
        description="Every change made here is discarded and the menu returns to the version that ships with the site. This cannot be undone."
        confirmLabel="Restore"
      />
    </div>
  );
}
