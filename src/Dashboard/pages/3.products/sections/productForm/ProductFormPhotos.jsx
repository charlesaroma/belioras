/* Admin Dashboard Page: Products - ProductFormPhotos */
import FormSection from "./ProductFormSection";
import ProductFormDropzone from "./ProductFormDropzone";

/**
 * Photos come first: upload everything, then tag each with the colour it
 * shows. Each colour's photos become its gallery on the product page.
 */
export default function ProductFormPhotos({ photos, onChange, colors, colorIds, onImageProgress }) {
  const byId = new Map(colors.map((c) => [c.id, c]));
  const swatches = colorIds.map((id) => byId.get(id) ?? { id, name: id, hex: "#ccc" });
  const untagged = photos.filter((p) => !colorIds.includes(p.colorId)).length;

  return (
    <FormSection title="Photos" hint="Upload every photo of the piece, then tag each with the colour it shows. The first photo leads in the shop.">
      <ProductFormDropzone
        images={photos}
        onChange={onChange}
        onProgress={onImageProgress}
        max={12}
        swatches={swatches}
        defaultColorId={colorIds[0] ?? null}
        onTag={(index, colorId) => onChange(photos.map((p, i) => (i === index ? { ...p, colorId } : p)))}
      />

      {photos.length > 0 && colorIds.length === 0 && (
        <p className="text-[12px] text-espresso-soft">Choose the colours below, then tag each photo with the one it shows.</p>
      )}
      {untagged > 0 && colorIds.length > 0 && (
        <p className="border-l-2 border-gold-500 py-1 pl-3 text-[12px] text-espresso-soft">
          {untagged} {untagged === 1 ? "photo is" : "photos are"} not tagged with a colour yet.
        </p>
      )}
    </FormSection>
  );
}
