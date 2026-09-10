/* Admin Dashboard Page: Products - ProductFormMain */
import Dropzone from "../../../../../components/ui/Dropzone";
import Field from "../../../../../components/ui/Field";
import TagInput from "../../../../../components/ui/TagInput";
import FormSection from "./ProductFormSection";
import FormAttributes from "./ProductFormAttributes";

export default function FormMain({
  register,
  errors,
  images,
  setImages,
  onImageProgress,
  dimensions,
  tags,
  onToggleTag,
  colors,
  setColors,
  sizes,
  setSizes,
}) {
  return (
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

      <FormSection title="Media" hint="The first image is the one shoppers see in the grid.">
        <Dropzone images={images} onChange={setImages} onProgress={onImageProgress} />
      </FormSection>

      <FormAttributes dimensions={dimensions} tags={tags} onToggle={onToggleTag} />

      <FormSection title="Variants">
        <TagInput label="Colours" values={colors} onChange={setColors} placeholder="Champagne" />
        <TagInput label="Sizes" values={sizes} onChange={setSizes} placeholder="M" />
      </FormSection>
    </div>
  );
}
