/* Admin Dashboard Page: Mega-menu - mega-menu */
import { useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw, Save } from "lucide-react";

import Button from "../../../components/ui/Button";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import { useContentVersion } from "../../../context/ContentContext";
import { useToast } from "../../../context/ToastContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getNavigation, resetNavigation, updateNavigation } from "../../../services/navigationApi";
import { getProducts } from "../../../services/productsApi";
import IconAction from "../../components/IconAction";
import MenuRoot from "./sections/MegaMenuRoot";
import { countForItem, moveRootIn, patchRootIn, totalLinks } from "./sections/megaMenuTree";

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

  const countFor = (item) => countForItem(item, products);
  const patchRoot = (rootId, patch) => setEdits(patchRootIn(draft, rootId, patch));
  const moveRoot = (index, delta) => setEdits(moveRootIn(draft, index, delta));

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

  const linkCount = totalLinks(draft);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] text-espresso-soft">
          {draft.length} top-level menus · {linkCount} links
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
                  <IconAction
                    label={`Move ${root.label} earlier`}
                    icon={ChevronUp}
                    disabled={i === 0}
                    onClick={() => moveRoot(i, -1)}
                  />
                  <IconAction
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
