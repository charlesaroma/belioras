import { useEffect, useRef } from "react";

import { toFormValues } from "./productFormPayload";

/**
 * Keeps the minimisable draft dock and this form in step, for new products.
 *
 * Two halves: restore whatever was in progress on mount, then mirror every
 * later change back out. Editing an existing product never touches the draft —
 * there is nothing to recover that is not already saved.
 */

export function useProductDraftSync({
  isEdit,
  existing,
  draft,
  reset,
  setImages,
  setColors,
  setSizes,
  setTags,
  snapshot,
  toast,
}) {
  const { startDraft, draftFor } = draft;

  /**
   * Prefill from the stored product when editing.
   *
   * The old edit modal did this with a bare setState in the render body,
   * guarded by comparing formData.name to product.name — which silently
   * stopped working the moment you cleared the name field.
   */
  /* Side Effect */
  useEffect(() => {
    if (!existing) return;
    reset(toFormValues(existing));
    setImages((existing.images ?? []).map((url) => ({ id: url, url })));
    setColors(existing.colors ?? []);
    setSizes(existing.sizes ?? []);
    setTags(existing.tags ?? []);
  }, [existing, reset, setImages, setColors, setSizes, setTags]);

  /**
   * Restore an in-progress draft on mount.
   *
   * The dock is only honest if Resume actually resumes: it named the piece
   * while the form came back empty, which is worse than not offering it.
   *
   * Blob URLs from Dropzone stay valid across SPA navigation, since the
   * document never reloads — but a hard refresh invalidates them, so any that
   * no longer resolve are dropped and the admin is told rather than being
   * shown broken thumbnails.
   */
  // A ref, not state: this only guards the one-time restore, and setting
  // state inside the effect that reads it triggers a cascading render.
  // Effects run in declaration order, so the mirror effect below already
  // sees this as true on mount.
  const restored = useRef(false);
  /* Side Effect */
  useEffect(() => {
    if (isEdit || restored.current) return;

    const saved = draftFor("new-product");
    restored.current = true;
    if (!saved?.values) return;

    reset(saved.values);
    setColors(saved.colors ?? []);
    setSizes(saved.sizes ?? []);
    setTags(saved.tags ?? []);

    const usable = (saved.images ?? []).filter((img) => img.url && !img.url.startsWith("blob:"));
    setImages(usable);

    const lost = (saved.images ?? []).length - usable.length;
    if (lost > 0) {
      toast(
        `Draft restored. ${lost} ${lost === 1 ? "image needs" : "images need"} adding again after the reload.`,
        "warning",
      );
    }
  }, [isEdit, draftFor, reset, setImages, setColors, setSizes, setTags, toast]);

  /**
   * Mirror the whole in-progress product out, not just its title.
   *
   * Keyed on a stable serialisation because watch() returns a new object every
   * render — otherwise this would write on every render rather than on every
   * actual change.
   */
  /* Side Effect */
  useEffect(() => {
    if (isEdit || !restored.current) return;

    const parsed = JSON.parse(snapshot);
    if (!parsed.values.name?.trim() && parsed.images.length === 0) return;
    startDraft("new-product", {
      title: parsed.values.name?.trim() || "Untitled piece",
      imageCount: parsed.images.length,
      href: "/dashboard/products/new",
      ...parsed,
    });
  }, [isEdit, snapshot, startDraft]);

}
