/* Image Dropzone */
import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";

import { cn } from "../../../../../utils/cn";
import { ACCEPT, MAX_BYTES, processImage } from "./productFormImage";
import ProductFormDropzoneThumbs from "./ProductFormDropzoneThumbs";

export default function ProductFormDropzone({
  images = [],
  onChange,
  onProgress,
  max = 8,
  disabled = false,
}) {
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(null); // {done, total}
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  // Object URLs are a manual resource. Revoke on unmount, and only those this
  // component minted — remote URLs on an existing product must survive.
  const mintedRef = useRef(new Set());
  /* Side Effect */
  useEffect(() => {

    const minted = mintedRef.current;
    return () => minted.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const ingest = useCallback(
    async (fileList) => {

      const files = Array.from(fileList ?? []);
      if (!files.length) return;

      const room = max - images.length;
      if (room <= 0) {
        setError(`Up to ${max} images.`);
        return;
      }

      const usable = [];
      for (const file of files.slice(0, room)) {
        if (!ACCEPT.includes(file.type)) {
          setError(`${file.name} is not a JPEG, PNG, WebP or AVIF.`);
          continue;
        }
        if (file.size > MAX_BYTES) {
          setError(`${file.name} is over 10MB.`);
          continue;
        }
        usable.push(file);
      }
      if (!usable.length) return;

      setError("");

      const added = [];

      for (const [i, file] of usable.entries()) {

        const progress = { done: i, total: usable.length };
        setBusy(progress);
        onProgress?.(progress);
        try {
          const { blob, width, height, url } = await processImage(file);
          mintedRef.current.add(url);
          added.push({ id: `img_${Date.now()}_${i}`, url, blob, width, height, name: file.name });
        } catch {
          setError(`${file.name} could not be read.`);
        }
      }

      const finished = { done: usable.length, total: usable.length };
      setBusy(null);
      onProgress?.(finished);
      if (added.length) onChange([...images, ...added]);
    },
    [images, max, onChange, onProgress],
  );

  const removeAt = (i) => {

    const image = images[i];
    if (image?.url && mintedRef.current.has(image.url)) {
      URL.revokeObjectURL(image.url);
      mintedRef.current.delete(image.url);
    }
    onChange(images.filter((_, idx) => idx !== i));
  };

  const makePrimary = (i) => {
    if (i === 0) return;

    const next = [...images];
    const [moved] = next.splice(i, 1);
    onChange([moved, ...next]);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!disabled) ingest(e.dataTransfer.files);
        }}
        className={cn(
          "border border-dashed transition-colors",
          dragging ? "border-gold-500 bg-gold-500/5" : "border-umber-50",
          disabled && "opacity-50",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT}
          disabled={disabled}
          onChange={(e) => {
            ingest(e.target.files);
            // Reset so re-picking the same file still fires a change.
            e.target.value = "";
          }}
          className="sr-only"
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || busy !== null}
          className="flex w-full flex-col items-center px-6 py-10 text-center"
        >
          <ImagePlus className="size-6 text-gold-700" strokeWidth={1.5} aria-hidden="true" />
          {busy ? (
            <>
              <span className="mt-3 text-[13px] text-espresso">
                Processing {busy.done + 1} of {busy.total}
              </span>
              <span className="mt-2 block h-px w-40 overflow-hidden bg-umber-50">
                <span
                  className="block h-full bg-gold-500 transition-[width] duration-200"
                  style={{ width: `${((busy.done + 1) / busy.total) * 100}%` }}
                />
              </span>
            </>
          ) : (
            <>
              <span className="mt-3 text-[13px] text-espresso">
                Drop images here, or click to browse
              </span>
              <span className="mt-1 text-[11px] text-espresso-soft">
                JPEG, PNG, WebP or AVIF · up to 10MB · {images.length} of {max} added
              </span>
            </>
          )}
        </button>
      </div>

      {error && (
        <p role="alert" className="input-helper mt-2 text-error">
          {error}
        </p>
      )}

      <ProductFormDropzoneThumbs
        images={images}
        onRemove={removeAt}
        onMakePrimary={makePrimary}
        disabled={disabled}
      />
    </div>
  );
}
