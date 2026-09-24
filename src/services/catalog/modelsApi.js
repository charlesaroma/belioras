/* Models */
import { ApiError, mockApi } from "@/api/mock";
import { getState, setState } from "../store/contentStore";
import { audited } from "../auth/audited";
import { slugify } from "./products/productSlug";

/**
 * The models who wear the pieces, with the measurements a shopper compares
 * against their own. A product names its model and the size she wears
 * (`modelFit: { modelId, size }`); the product page shows her card from that.
 */
function items() {
  return getState("models").items;
}

export function getModels() {
  return mockApi(() => items().map((m) => ({ ...m })), 0);
}

/** How many products each model appears on, keyed by id. */
export function modelUsage() {
  return mockApi(() => {
    const counts = {};
    for (const p of getState("products").items) {
      const id = p.modelFit?.modelId;
      if (id) counts[id] = (counts[id] ?? 0) + 1;
    }
    return counts;
  }, 0);
}

function clean(input = {}) {
  const name = String(input.name ?? "").trim();
  if (!name) throw new ApiError("Give the model a name.", 422);
  const cm = (v, label, min, max) => {
    if (v === "" || v == null) return null;
    const n = Math.round(Number(v));
    if (!(n >= min && n <= max)) throw new ApiError(`${label} should be between ${min} and ${max} cm.`, 422);
    return n;
  };
  return {
    name,
    photo: String(input.photo ?? "").trim() || null,
    heightCm: cm(input.heightCm, "Height", 140, 210),
    bustCm: cm(input.bustCm, "Bust", 60, 140),
    waistCm: cm(input.waistCm, "Waist", 45, 130),
    hipCm: cm(input.hipCm, "Hip", 60, 150),
  };
}

function createModel$raw(input) {
  return mockApi(() => {
    const fields = clean(input);
    const base = slugify(fields.name) || "model";
    let id = base;
    for (let n = 2; items().some((m) => m.id === id); n += 1) id = `${base}-${n}`;
    const model = { id, ...fields };
    setState("models", (s) => ({ ...s, items: [...s.items, model] }));
    return model;
  });
}

function updateModel$raw(id, input) {
  return mockApi(() => {
    const existing = items().find((m) => m.id === id);
    if (!existing) throw new ApiError("That model no longer exists.", 404);
    const updated = { ...existing, ...clean(input) };
    setState("models", (s) => ({ ...s, items: s.items.map((m) => (m.id === id ? updated : m)) }));
    return updated;
  });
}

function deleteModel$raw(id) {
  return mockApi(() => {
    const model = items().find((m) => m.id === id);
    if (!model) throw new ApiError("That model no longer exists.", 404);
    const used = getState("products").items.filter((p) => p.modelFit?.modelId === id).length;
    if (used) throw new ApiError(`${model.name} is on ${used} ${used === 1 ? "piece" : "pieces"}. Choose another model on them first.`, 409);
    setState("models", (s) => ({ ...s, items: s.items.filter((m) => m.id !== id) }));
    return model;
  });
}

export const createModel = audited("sizes", (_, r) => `Added the model ${r.name}`, createModel$raw);
export const updateModel = audited("sizes", (_, r) => `Updated the model ${r.name}`, updateModel$raw);
export const deleteModel = audited("sizes", (_, r) => `Removed the model ${r.name}`, deleteModel$raw);
