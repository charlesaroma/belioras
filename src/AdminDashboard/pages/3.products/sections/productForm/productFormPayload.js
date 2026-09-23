/* Product Form Payload */

export const ONE_SIZE = "one-size";

/** A category's own subcategory types (Shop by Category, Shop by Fabric…)
    are tagged `subcat:<subcategoryId>:<typeId>` — scoped to the category
    that owns them, not a shared dimension. */
export const SUBCATEGORY_PREFIX = "subcat";

export function subcategoryTag(subcategoryId, typeId) {
  return `${SUBCATEGORY_PREFIX}:${subcategoryId}:${typeId}`;
}

/** Whether a `subcat:` token still points at a real subcategory type. */
export function isValidSubcategoryTag(token, category) {
  const [prefix, subId, typeId] = String(token).split(":");
  if (prefix !== SUBCATEGORY_PREFIX) return false;
  const sub = category?.subcategories?.find((s) => s.id === subId);
  return Boolean(sub?.types?.some((t) => t.id === typeId));
}

export const EMPTY_VALUES = {
  name: "",
  sku: "",
  description: "",
  collectionId: "",
  type: "",
  price: "",
  onSale: false,
  originalPrice: "",
  isNew: true,
  featured: false,
  status: "draft",
  lowStockThreshold: "",
};

export function toFormValues(product) {
  return {
    name: product.name ?? "",
    sku: product.sku ?? "",
    description: product.description ?? "",
    collectionId: product.collectionId ?? "",
    type: product.type ?? "",
    price: product.price ?? "",
    onSale: Boolean(product.originalPrice && product.originalPrice > product.price),
    originalPrice: product.originalPrice ?? "",
    isNew: Boolean(product.isNew),
    featured: Boolean(product.featured),
    // Older products carry no status, and they are live in the shop.
    status: product.status ?? "active",
    lowStockThreshold: product.lowStockThreshold ?? "",
  };
}

/** Sizes a product actually offers; the one-size placeholder is not a choice. */
export function offeredSizes(sizes) {
  return (sizes ?? []).filter((s) => s && s !== ONE_SIZE && s !== "default");
}

/** The stock grid's columns. A piece with no sizes gets one column. */
export function stockColumns(sizes) {
  return sizes.length ? sizes : [ONE_SIZE];
}

/** Only the subcategory tokens the form edits; derived tags are rebuilt on save. */
export function detailTags(tags) {
  return (tags ?? []).filter((t) => String(t).split(":")[0] === SUBCATEGORY_PREFIX);
}

/**
 * A normalised product -> the form's model: photos each tagged with a colour,
 * the chosen colours, and stock per colour and size.
 *
 * Older products hold one stock number for the whole piece; it is spread
 * across colours and sizes so the total survives, and `spread` asks the admin
 * to check it. When no colour has photos of its own, the product's gallery is
 * given to the first colour, so the piece does not open with no photos.
 */
export function toFormModel(product) {
  const columns = stockColumns(offeredSizes(product.sizes));
  const ways = product.colorways ?? [];
  const tracked = ways.some((w) => w.stock);
  // On the shelf, not what is left to sell: `stock` has open orders taken off.
  const total = Number(product.onHand ?? product.stock) || 0;
  const cells = ways.length * columns.length;
  const each = cells ? Math.floor(total / cells) : 0;
  let remainder = cells ? total % cells : 0;

  const stock = {};
  for (const w of ways) {
    stock[w.colorId] = {};
    for (const size of columns) {
      if (tracked) stock[w.colorId][size] = Number(w.stock?.[size]) || 0;
      else {
        stock[w.colorId][size] = each + (remainder > 0 ? 1 : 0);
        remainder -= 1;
      }
    }
  }

  const anyOwn = ways.some((w) => w.images?.length);
  const photos = ways.flatMap((w, i) => {
    const urls = w.images?.length ? w.images : !anyOwn && i === 0 ? (product.images ?? []) : [];
    return urls.map((url) => ({ id: `${w.colorId}:${url}`, url, colorId: w.colorId }));
  });

  return {
    photos,
    colorIds: ways.map((w) => w.colorId),
    stock,
    spread: !tracked && ways.length > 0 && total > 0,
  };
}

/** Publishing asks for more than a draft does. Returns a message or null. */
export function validateProduct({ status, category, colorIds, photos }) {
  if (!category) return "Choose a category for this piece.";
  if (status !== "active") return null;
  if (!colorIds.length) return "Add at least one colour before publishing.";
  if (!photos.length) return "Add at least one photo before publishing.";
  if (photos.some((p) => !colorIds.includes(p.colorId))) {
    return "Tag every photo with the colour it shows before publishing.";
  }
  return null;
}

/** The form's model -> what productsApi stores. */
export function toPayload(values, { photos, colorIds, stock, sizes, tags, category, status }) {
  const columns = stockColumns(sizes);

  const colorways = colorIds.map((colorId) => ({
    colorId,
    images: photos.filter((p) => p.colorId === colorId).map((p) => p.url),
    stock: Object.fromEntries(
      columns.map((size) => [size, Math.max(0, Math.floor(Number(stock[colorId]?.[size]) || 0))]),
    ),
  }));

  return {
    name: values.name.trim(),
    sku: values.sku?.trim() || null,
    description: values.description,
    collectionId: values.collectionId,
    // A type only counts if it still belongs to the chosen category.
    type: category?.types?.some((t) => t.id === values.type) ? values.type : null,
    price: Number(values.price),
    originalPrice: values.onSale && values.originalPrice ? Number(values.originalPrice) : null,
    isNew: Boolean(values.isNew),
    featured: Boolean(values.featured),
    status,
    colorways,
    sizes: sizes.length ? sizes : [ONE_SIZE],
    images: colorways.find((w) => w.images.length)?.images ?? [],
    stock: colorways.reduce((sum, w) => sum + Object.values(w.stock).reduce((a, n) => a + n, 0), 0),
    // Blank means "use the shop's threshold".
    lowStockThreshold: `${values.lowStockThreshold ?? ""}` === "" ? null : Math.max(0, Math.floor(Number(values.lowStockThreshold))),
    tags: detailTags(tags).filter((t) => isValidSubcategoryTag(t, category)),
  };
}
