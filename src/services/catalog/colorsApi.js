import { ApiError, mockApi } from "@/api/mock";
import { getState, setState } from "../store/contentStore";
import { colorIndex, colorwaysOf } from "./products/productColorways";
import { slugify } from "./products/productSlug";
import { catalogItems } from "./products/productStore";

/**
 * The colour list: a boutique name, a swatch, and the shop filter family.
 *
 * A colour's id is fixed when it is created. Products reference the id, so a
 * rename reaches every product carrying the colour, and a colour still on a
 * product cannot be deleted out from under it.
 */

const HEX = /^#[0-9a-f]{6}$/i;

function colorItems() {
  return getState("colors").items;
}

export function getColors() {
  return mockApi(() => [...colorItems()].sort((a, b) => a.name.localeCompare(b.name)), 0);
}

/** How many products carry each colour, keyed by colour id. */
export function colorUsage() {
  return mockApi(() => {
    const index = colorIndex();
    const counts = {};
    for (const product of catalogItems()) {
      for (const way of colorwaysOf(product, index)) {
        counts[way.colorId] = (counts[way.colorId] ?? 0) + 1;
      }
    }
    return counts;
  }, 0);
}

export function createColor(input) {
  return mockApi(() => {
    const fields = clean(input);
    const color = { id: uniqueId(slugify(fields.name)), ...fields };
    setState("colors", (state) => ({ ...state, items: [...state.items, color] }));
    return color;
  });
}

export function updateColor(id, input) {
  return mockApi(() => {
    const existing = colorItems().find((c) => c.id === id);
    if (!existing) throw new ApiError("That colour no longer exists.", 404);
    const updated = { ...existing, ...clean(input, id) };
    setState("colors", (state) => ({
      ...state,
      items: state.items.map((c) => (c.id === id ? updated : c)),
    }));
    return updated;
  });
}

export function deleteColor(id) {
  return mockApi(() => {
    const color = colorItems().find((c) => c.id === id);
    if (!color) throw new ApiError("That colour no longer exists.", 404);

    const index = colorIndex();
    const using = catalogItems().filter((p) => colorwaysOf(p, index).some((w) => w.colorId === id));
    if (using.length) {
      const names = using.slice(0, 3).map((p) => p.name).join(", ");
      throw new ApiError(
        `${color.name} is on ${using.length} ${using.length === 1 ? "product" : "products"} (${names}${using.length > 3 ? "…" : ""}). Remove it from them first.`,
        409,
      );
    }

    setState("colors", (state) => ({ ...state, items: state.items.filter((c) => c.id !== id) }));
    return color;
  });
}

function clean({ name, hex, family } = {}, ignoreId = null) {
  const trimmed = String(name ?? "").trim();
  if (!trimmed) throw new ApiError("Give the colour a name.", 422);
  if (!HEX.test(String(hex ?? ""))) {
    throw new ApiError("Choose a swatch, as a hex code like #120700.", 422);
  }
  if (!family) throw new ApiError("Choose which shop filter the colour belongs to.", 422);

  const clash = colorItems().find(
    (c) => c.id !== ignoreId && c.name.toLowerCase() === trimmed.toLowerCase(),
  );
  if (clash) throw new ApiError(`There is already a colour called ${clash.name}.`, 409);

  return { name: trimmed, hex: hex.toUpperCase(), family };
}

function uniqueId(base) {
  const root = base || "colour";
  const taken = new Set(colorItems().map((c) => c.id));
  let id = root;
  for (let n = 2; taken.has(id); n += 1) id = `${root}-${n}`;
  return id;
}
