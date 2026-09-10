/** The collections a piece can belong to. */
export const COLLECTIONS = [
  { id: "dresses", label: "Dresses" },
  { id: "hair", label: "Hair" },
  { id: "accessories", label: "Accessories" },
];

export const EMPTY_PRODUCT = {
  name: "",
  collectionId: "dresses",
  price: "",
  originalPrice: "",
  stock: 0,
  status: "draft",
  description: "",
};

/** A stored product -> the flat form values. */
export function toFormValues(product) {
  return {
    name: product.name ?? "",
    collectionId: product.collectionId ?? "dresses",
    price: product.price ?? "",
    originalPrice: product.originalPrice ?? "",
    stock: product.stock ?? 0,
    status: product.status ?? "active",
    description: product.description ?? "",
  };
}

/** Form values + the separately-held lists -> the payload productsApi wants. */
export function toPayload(values, { images, colors, sizes, tags }) {
  return {
    ...values,
    price: Number(values.price),
    originalPrice: values.originalPrice ? Number(values.originalPrice) : null,
    stock: Number(values.stock) || 0,
    images: images.map((img) => img.url),
    colors,
    sizes,
    tags,
  };
}
