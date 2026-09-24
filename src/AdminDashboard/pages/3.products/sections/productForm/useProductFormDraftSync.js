import { useEffect, useRef } from "react";

import { detailTags, offeredSizes, toFormModel, toFormValues } from "./productFormPayload";

/**
 * Keeps the form in step with the stored product when editing, and with the
 * minimisable draft dock when adding a new piece.
 */
export function useProductDraftSync({
  isEdit,
  existing,
  draft,
  reset,
  setPhotos,
  setVideos,
  setColorIds,
  setStock,
  setSizes,
  setTags,
  setSpread,
  snapshot,
  toast,
}) {
  const { startDraft, draftFor } = draft;

  /* Side Effect */
  useEffect(() => {
    if (!existing) return;
    reset(toFormValues(existing));
    const model = toFormModel(existing);
    setPhotos(model.photos);
    setVideos(model.videos);
    setColorIds(model.colorIds);
    setStock(model.stock);
    setSizes(offeredSizes(existing.sizes));
    setTags(detailTags(existing.tags));
    setSpread(model.spread);
  }, [existing, reset, setPhotos, setVideos, setColorIds, setStock, setSizes, setTags, setSpread]);

  // A ref, not state: it only guards the one-time restore, and effects run in
  // declaration order, so the mirror below already sees it as true on mount.
  const restored = useRef(false);

  /* Side Effect */
  useEffect(() => {
    if (isEdit || restored.current) return;
    const saved = draftFor("new-product");
    restored.current = true;
    if (!saved?.values) return;

    reset(saved.values);
    // Blob URLs do not survive a hard refresh: those photos are dropped and
    // the admin told, rather than shown as broken thumbnails.
    const all = saved.photos ?? [];
    const usable = all.filter((p) => p.url && !p.url.startsWith("blob:"));
    setPhotos(usable);
    setVideos(Object.fromEntries(Object.entries(saved.videos ?? {}).filter(([, v]) => v?.url && !v.url.startsWith("blob:"))));
    setColorIds(saved.colorIds ?? []);
    setStock(saved.stock ?? {});
    setSizes(saved.sizes ?? []);
    setTags(saved.tags ?? []);

    const lost = all.length - usable.length;
    if (lost > 0) {
      toast(
        `Draft restored. ${lost} ${lost === 1 ? "photo needs" : "photos need"} adding again after the reload.`,
        "warning",
      );
    }
  }, [isEdit, draftFor, reset, setPhotos, setVideos, setColorIds, setStock, setSizes, setTags, toast]);

  /* Side Effect */
  useEffect(() => {
    if (isEdit || !restored.current) return;
    const parsed = JSON.parse(snapshot);
    if (!parsed.values.name?.trim() && parsed.photos.length === 0) return;
    startDraft("new-product", {
      title: parsed.values.name?.trim() || "Untitled piece",
      imageCount: parsed.photos.length,
      href: "/dashboard/products/new",
      ...parsed,
    });
  }, [isEdit, snapshot, startDraft]);
}
