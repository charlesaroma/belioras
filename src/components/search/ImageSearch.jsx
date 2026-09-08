import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ImageUp, Loader2, X } from "lucide-react";

import Button from "../ui/Button";
import Modal from "../common/Modal";
import { searchByImage } from "../../services/visualSearchApi";
import { cn } from "../../utils/cn";

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif,image/heic";
const MAX_EDGE = 512;

/**
 * Downscale before anything is sent.
 *
 * A phone photo is several megabytes and 4000px wide; a similarity model works
 * from a few hundred pixels. Shrinking here keeps the eventual upload small
 * and keeps the full-resolution original — which may show a face, a home, a
 * street — on the shopper's device rather than on a server.
 */
async function prepare(file, crop) {
  const bitmap = await createImageBitmap(file);

  // Square centre crop by default: garment photos are usually centred, and a
  // square is what the model will be fed regardless.
  const side = crop ?? Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - side) / 2;
  const sy = (bitmap.height - side) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = MAX_EDGE;
  canvas.height = MAX_EDGE;
  canvas.getContext("2d").drawImage(bitmap, sx, sy, side, side, 0, 0, MAX_EDGE, MAX_EDGE);
  bitmap.close?.();

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
  return { blob, url: URL.createObjectURL(blob) };
}

/**
 * Search by photograph.
 *
 * The whole experience — camera on mobile, drop or browse on desktop, preview,
 * downscale, submit — against a service that currently answers "not yet". It
 * says so rather than showing invented matches; see visualSearchApi.
 */
export default function ImageSearch({ open, onClose }) {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const cameraRef = useRef(null);
  const objectUrl = useRef(null);

  const [preview, setPreview] = useState(null);
  const [blob, setBlob] = useState(null);
  const [state, setState] = useState("idle"); // idle | preparing | searching | done
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  // Object URLs are a manual resource; the last one is revoked on unmount.
  useEffect(
    () => () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    },
    [],
  );

  const reset = () => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = null;
    setPreview(null);
    setBlob(null);
    setResult(null);
    setError("");
    setState("idle");
  };

  const accept = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That file is not an image.");
      return;
    }

    setError("");
    setState("preparing");
    try {
      const prepared = await prepare(file);
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = prepared.url;
      setPreview(prepared.url);
      setBlob(prepared.blob);
      setState("idle");
    } catch {
      setError("That image could not be read. Try another.");
      setState("idle");
    }
  };

  const submit = async () => {
    setState("searching");
    const response = await searchByImage(blob);
    setResult(response);
    setState("done");
  };

  return (
    <Modal open={open} onClose={onClose} title="Search by photograph" width="max-w-lg">
      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(e) => {
          accept(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {/* capture opens the rear camera directly on a phone rather than the
          photo library, which is what someone standing in front of a garment
          actually wants. */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => {
          accept(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {!preview ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            accept(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            "border border-dashed px-6 py-12 text-center transition-colors",
            dragging ? "border-gold-500 bg-gold-500/5" : "border-umber-50",
          )}
        >
          <ImageUp className="mx-auto size-7 text-gold-700" strokeWidth={1.5} aria-hidden="true" />
          <p className="mt-4 text-[14px] text-espresso">
            Photograph a piece, or drop an image here
          </p>
          <p className="mt-1 text-[12px] text-espresso-soft">
            We resize it on your device before anything is sent.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button
              size="md"
              icon={Camera}
              className="sm:hidden"
              onClick={() => cameraRef.current?.click()}
            >
              Take a photo
            </Button>
            <Button size="md" variant="secondary" onClick={() => fileRef.current?.click()}>
              Choose an image
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="relative mx-auto w-full max-w-[280px]">
            <img
              src={preview}
              alt="The photograph you are searching with"
              className="aspect-square w-full border border-umber-50 object-cover"
            />
            <button
              type="button"
              onClick={reset}
              aria-label="Choose a different image"
              className="absolute right-2 top-2 flex size-7 items-center justify-center bg-espresso/85 text-ivory-50 transition-colors hover:bg-espresso"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>

          {state !== "done" && (
            <div className="mt-6 flex justify-center">
              <Button size="lg" onClick={submit} loading={state === "searching"}>
                Find similar pieces
              </Button>
            </div>
          )}
        </div>
      )}

      {state === "preparing" && (
        <p className="mt-4 flex items-center justify-center gap-2 text-[13px] text-espresso-soft">
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          Preparing your image
        </p>
      )}

      {error && (
        <p role="alert" className="mt-4 text-center text-[13px] text-error">
          {error}
        </p>
      )}

      {/*
        The honest outcome. No placeholder products are ever shown here — a
        grid of unrelated pieces would look like a working feature giving bad
        answers, which is worse than a feature that says it is not ready.
      */}
      {state === "done" && result?.status === "unavailable" && (
        <div className="mt-6 border-l-2 border-gold-500 py-3 pl-5" role="status">
          <p className="text-[13px] leading-relaxed text-espresso-soft">
            <strong className="font-medium text-espresso">Not quite yet.</strong> {result.message}{" "}
            In the meantime, search by name or narrow the collection with the filters.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                onClose();
                navigate("/shop");
              }}
            >
              Browse the collection
            </Button>
            <Button size="sm" variant="ghost" onClick={reset}>
              Try another image
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
