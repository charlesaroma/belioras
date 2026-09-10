/* Admin Dashboard Page: Products - product-form */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { useToast } from "../../../context/ToastContext";
import { useProductDraft } from "../../../context/ProductDraftContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getTaxonomy } from "../../../services/navigationApi";
import { createProduct, getProduct, updateProduct } from "../../../services/productsApi";
import { DIMENSION_PREFIX } from "../../../utils/faceting";

import FormHeader from "./sections/productForm/ProductFormHeader";
import FormMain from "./sections/productForm/ProductFormMain";
import FormSidebar from "./sections/productForm/ProductFormSidebar";
import FormSkeleton from "./sections/productForm/ProductFormSkeleton";
import { useProductDraftSync } from "./sections/productForm/useProductFormDraftSync";
import { EMPTY_PRODUCT, toPayload } from "./sections/productForm/productFormPayload";

/* Product Form */
export default function ProductForm() {
  const { id } = useParams();

  const navigate = useNavigate();
  const { toast } = useToast();

  const draft = useProductDraft();

  const isEdit = Boolean(id);

  const { data: existing, loading: loadingProduct } = useAsyncData(
    () => (isEdit ? getProduct(id) : Promise.resolve(null)),
    [id],
  );
  // getTaxonomy resolves to the dimensions map itself, not the whole document.
  const { data: taxonomy } = useAsyncData(getTaxonomy, []);

  const dimensions = taxonomy ?? {};

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
  } = useForm({ defaultValues: EMPTY_PRODUCT });

  const values = watch();

  const snapshot = JSON.stringify({
    values,
    colors,
    sizes,
    tags,
    // Strip the Blob: it serialises to {} and only wastes the storage quota.
    images: images.map(({ id: imgId, url, name }) => ({ id: imgId, url, name })),
  });

  useProductDraftSync({
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
  });

  const toggleTag = (dimension, valueId) => {

    const token = `${DIMENSION_PREFIX[dimension] ?? dimension}:${valueId}`;
    setTags((prev) => (prev.includes(token) ? prev.filter((t) => t !== token) : [...prev, token]));
  };

/* discard Draft */
  const discardDraft = () => {
    draft.clearDraft("new-product");
    reset(EMPTY_PRODUCT);
    setImages([]);
    setColors([]);
    setSizes([]);
    setTags([]);
  };

  const onSubmit = async (formValues) => {

    const payload = toPayload(formValues, { images, colors, sizes, tags });
    try {
      if (isEdit) {

        const saved = await updateProduct(id, payload);
        toast(`${saved.name} saved.`, "success");
      } else {

        const created = await createProduct(payload);
        draft.clearDraft("new-product");
        toast(`${created.name} added to the catalogue.`, "success");
      }
      navigate("/dashboard/products");
    } catch (err) {
      toast(err.message ?? "Could not save that product.", "error");
    }
  };

  if (isEdit && loadingProduct) return <FormSkeleton />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
      <FormHeader
        isEdit={isEdit}
        hasDraft={Boolean(draft.draftFor("new-product"))}
        onDiscardDraft={discardDraft}
        submitting={isSubmitting}
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <FormMain
          register={register}
          errors={errors}
          images={images}
          setImages={setImages}
          onImageProgress={(p) => draft.updateDraft("new-product", { progress: p })}
          dimensions={dimensions}
          tags={tags}
          onToggleTag={toggleTag}
          colors={colors}
          setColors={setColors}
          sizes={sizes}
          setSizes={setSizes}
        />
        <FormSidebar register={register} errors={errors} />
      </div>
    </form>
  );
}
