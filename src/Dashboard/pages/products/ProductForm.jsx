import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";

import Button from "../../../components/ui/Button";
import Dropzone from "../../../components/ui/Dropzone";
import Field from "../../../components/ui/Field";
import TagInput from "../../../components/ui/TagInput";
import { useToast } from "../../../context/ToastContext";
import { useProductDraft } from "../../../context/ProductDraftContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getTaxonomy } from "../../../services/navigationApi";
import { createProduct, getProduct, updateProduct } from "../../../services/productsApi";
import { DIMENSION_ORDER, DIMENSION_PREFIX } from "../../../utils/faceting";
import { cn } from "../../../utils/cn";

const COLLECTIONS = [
  { id: "dresses", label: "Dresses" },
  { id: "hair", label: "Hair" },
  { id: "accessories", label: "Accessories" },
];

/**
 * Create and edit a product.
 *
 * Replaces AddProductModal and EditProductModal — two 299-line files that were
 * about 95% identical, differing only in their title, submit label and which
 * callback they invoked. Roughly 600 lines for one form.
 *
 * It is a page rather than a modal because the form is long: images, five
 * attribute dimensions, pricing and visibility do not belong in a 90vh box
 * that scrolls internally. Being a route also means an edit is linkable and
 * survives a refresh.
 *
 * Backed by react-hook-form, which has been a dependency since the start and
 * had never been used — every form in the repo was hand-rolled useState with
 * a manual validate() and no error display.
 */
export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { startDraft, updateDraft, clearDraft, draftFor } = useProductDraft();
  const isEdit = Boolean(id);

  const { data: existing, loading: loadingProduct } = useAsyncData(
    () => (isEdit ? getProduct(id) : Promise.resolve(null)),
    [id],
  );
  const { data: taxonomy } = useAsyncData(getTaxonomy, []);

  const [images, setImages] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [tags, setTags] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      collectionId: "dresses",
      price: "",
      originalPrice: "",
      stock: 0,
      status: "draft",
      description: "",
    },
  });

  // Prefill on load. The old edit modal did this with a bare setState in the
  // render body, guarded by comparing formData.name to product.name — which
  // silently stopped working the moment you cleared the name field.
  useEffect(() => {
    if (!existing) return;
    reset({
      name: existing.name ?? "",
      collectionId: existing.collectionId ?? "dresses",
      price: existing.price ?? "",
      originalPrice: existing.originalPrice ?? "",
      stock: existing.stock ?? 0,
      status: existing.status ?? "active",
      description: existing.description ?? "",
    });
    setImages((existing.images ?? []).map((url) => ({ id: url, url })));
    setColors(existing.colors ?? []);
    setSizes(existing.sizes ?? []);
    setTags(existing.tags ?? []);
  }, [existing, reset]);

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
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    if (isEdit || restored) return;
    const draft = draftFor("new-product");
    setRestored(true);
    if (!draft?.values) return;

    reset(draft.values);
    setColors(draft.colors ?? []);
    setSizes(draft.sizes ?? []);
    setTags(draft.tags ?? []);

    const usable = (draft.images ?? []).filter(
      (img) => img.url && !img.url.startsWith("blob:"),
    );
    setImages(usable);
    const lost = (draft.images ?? []).length - usable.length;
    if (lost > 0) {
      toast(
        `Draft restored. ${lost} ${lost === 1 ? "image needs" : "images need"} adding again after the reload.`,
        "warning",
      );
    }
  }, [isEdit, restored, draftFor, reset, toast]);

  const values = watch();

  /**
   * Mirror the whole in-progress product to the draft, not just its title.
   *
   * watch() returns a new object each render, so this is keyed on a stable
   * serialisation — otherwise it would write on every render rather than on
   * every actual change.
   */
  const snapshot = JSON.stringify({
    values,
    colors,
    sizes,
    tags,
    // Strip the Blob: it serialises to {} and only wastes the storage quota.
    images: images.map(({ id, url, name: fileName }) => ({ id, url, name: fileName })),
  });
  useEffect(() => {
    if (isEdit || !restored) return;
    const parsed = JSON.parse(snapshot);
    if (!parsed.values.name?.trim() && parsed.images.length === 0) return;
    startDraft("new-product", {
      title: parsed.values.name?.trim() || "Untitled piece",
      imageCount: parsed.images.length,
      href: "/dashboard/products/new",
      ...parsed,
    });
  }, [isEdit, restored, snapshot, startDraft]);

  // getTaxonomy resolves to the dimensions map itself, not the whole document.
  const dimensions = taxonomy ?? {};

  const toggleTag = (dimension, valueId) => {
    const token = `${DIMENSION_PREFIX[dimension] ?? dimension}:${valueId}`;
    setTags((prev) =>
      prev.includes(token) ? prev.filter((t) => t !== token) : [...prev, token],
    );
  };

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      price: Number(values.price),
      originalPrice: values.originalPrice ? Number(values.originalPrice) : null,
      stock: Number(values.stock) || 0,
      images: images.map((img) => img.url),
      colors,
      sizes,
      tags,
    };

    try {
      if (isEdit) {
        const saved = await updateProduct(id, payload);
        toast(`${saved.name} saved.`, "success");
      } else {
        const created = await createProduct(payload);
        clearDraft("new-product");
        toast(`${created.name} added to the catalogue.`, "success");
      }
      navigate("/dashboard/products");
    } catch (err) {
      toast(err.message ?? "Could not save that product.", "error");
    }
  };

  const draft = draftFor("new-product");

  if (isEdit && loadingProduct) {
    return (
      <div className="space-y-4" aria-hidden="true">
        <div className="skeleton h-4 w-32" />
        <div className="skeleton h-64 w-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/dashboard/products"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-espresso-soft transition-colors hover:text-espresso"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          All products
        </Link>

        <div className="flex items-center gap-2">
          {!isEdit && draft && (
            <button
              type="button"
              onClick={() => {
                clearDraft("new-product");
                reset();
                setImages([]);
                setColors([]);
                setSizes([]);
                setTags([]);
              }}
              className="text-[11px] uppercase tracking-[0.14em] text-espresso-soft underline underline-offset-4 hover:text-error"
            >
              Discard draft
            </button>
          )}
          <Button type="submit" icon={Check} loading={isSubmitting}>
            {isEdit ? "Save changes" : "Add product"}
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <FormSection title="Basics">
            <Field label="Product name" required error={errors.name?.message}>
              <input
                {...register("name", { required: "A product needs a name." })}
                placeholder="Aurora Satin Midi Dress"
              />
            </Field>

            <Field label="Description">
              <textarea
                {...register("description")}
                rows={4}
                className="resize-y"
                placeholder="How it is cut, how it falls, what it is finished with."
              />
            </Field>
          </FormSection>

          <FormSection
            title="Media"
            hint="The first image is the one shoppers see in the grid."
          >
            <Dropzone
              images={images}
              onChange={setImages}
              onProgress={(p) => updateDraft("new-product", { progress: p })}
            />
          </FormSection>

          <FormSection
            title="Attributes"
            hint="These drive the filters and the mega menu, so a piece is only findable by what is ticked here."
          >
            <div className="space-y-5">
              {DIMENSION_ORDER.filter((d) => dimensions[d]).map((dimension) => {
                const prefix = DIMENSION_PREFIX[dimension] ?? dimension;
                return (
                  <div key={dimension}>
                    <p className="input-label">{dimension}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {dimensions[dimension].values.map((value) => {
                        const token = `${prefix}:${value.id}`;
                        const on = tags.includes(token);
                        return (
                          <button
                            key={value.id}
                            type="button"
                            onClick={() => toggleTag(dimension, value.id)}
                            aria-pressed={on}
                            className={cn(
                              "border px-2.5 py-1 text-[12px] transition-colors",
                              on
                                ? "border-espresso bg-espresso text-ivory-50"
                                : "border-umber-50 text-espresso-soft hover:border-espresso/40 hover:text-espresso",
                            )}
                          >
                            {value.hex && (
                              <span
                                aria-hidden="true"
                                className="mr-1.5 inline-block size-2.5 translate-y-px border border-umber-50"
                                style={{ backgroundColor: value.hex }}
                              />
                            )}
                            {value.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </FormSection>

          <FormSection title="Variants">
            <TagInput label="Colours" values={colors} onChange={setColors} placeholder="Champagne" />
            <TagInput label="Sizes" values={sizes} onChange={setSizes} placeholder="M" />
          </FormSection>
        </div>

        <div className="space-y-5">
          <FormSection title="Pricing & stock">
            <Field
              label="Price (EUR)"
              required
              error={errors.price?.message}
              helper="Catalogue prices are stored in euros and converted for the shopper."
            >
              <input
                type="number"
                min="0"
                step="0.01"
                {...register("price", {
                  required: "A product needs a price.",
                  min: { value: 0.01, message: "Price must be above zero." },
                })}
              />
            </Field>

            <Field label="Compare-at price" helper="Shows as a strike-through. Leave blank if not on sale.">
              <input type="number" min="0" step="0.01" {...register("originalPrice")} />
            </Field>

            <Field label="Stock" error={errors.stock?.message}>
              <input type="number" min="0" {...register("stock", { min: 0 })} />
            </Field>
          </FormSection>

          <FormSection title="Visibility">
            <Field label="Collection">
              <select {...register("collectionId")}>
                {COLLECTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Status" helper="Drafts are hidden from the storefront.">
              <select {...register("status")}>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
            </Field>
          </FormSection>
        </div>
      </div>
    </form>
  );
}

function FormSection({ title, hint, children }) {
  return (
    <section className="border border-umber-50 bg-ivory-50 p-5">
      <h2 className="font-display text-lg tracking-wide text-espresso">{title}</h2>
      {hint && <p className="mt-1 text-[12px] leading-relaxed text-espresso-soft">{hint}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
