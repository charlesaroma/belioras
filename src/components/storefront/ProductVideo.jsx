/* Storefront Component: ProductVideo */
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

import { cn } from "../../utils/cn";

function prefersStill() {
  if (typeof window === "undefined") return true;
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const saveData = navigator.connection?.saveData;
  return Boolean(reduce || saveData);
}

/**
 * A short clip of the piece on the model: silent, looping, and only playing
 * while it is on screen. It shows its still (the poster) until it loads, and
 * stays still for anyone who has asked for reduced motion or less data — they
 * press play. Nothing downloads until the clip is near the screen.
 */
export default function ProductVideo({ video, label, className }) {
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [still] = useState(prefersStill);
  // A clip that can't load (moved, or an upload from an earlier session) leaves its still.
  const [broken, setBroken] = useState(false);

  // Watching only records whether the clip is on screen; playing waits for
  // the effect below, so the source is set before play() is ever called.
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setNear(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !near || still) return;
    if (visible) el.play?.().catch(() => {});
    else el.pause?.();
  }, [near, visible, still]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (!near) {
      // First press for someone who asked for stillness: load, then play.
      setNear(true);
      el.addEventListener("loadeddata", () => el.play?.().catch(() => {}), { once: true });
      return;
    }
    if (el.paused) el.play?.().catch(() => {});
    else el.pause();
  };

  if (broken) {
    return video.poster ? (
      <img src={video.poster} alt={label} className={cn("h-full w-full object-cover", className)} />
    ) : (
      <div className={cn("bg-ivory-200", className)} />
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-ivory-200", className)}>
      <video
        ref={ref}
        src={near ? video.url : undefined}
        poster={video.poster}
        muted
        loop
        playsInline
        preload={near ? "auto" : "none"}
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setBroken(true)}
        className="h-full w-full object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause the video" : "Play the video"}
        className="liquid-hover absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full bg-ivory-50/85 text-espresso shadow-[0_1px_3px_rgba(43,29,20,0.18)] backdrop-blur"
      >
        {playing ? <Pause className="liquid-icon size-4" aria-hidden="true" /> : <Play className="liquid-icon size-4 translate-x-px" aria-hidden="true" />}
      </button>
    </div>
  );
}
