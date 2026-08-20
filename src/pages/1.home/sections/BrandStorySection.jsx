import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { useAsyncData } from "../../../hooks/useAsyncData";
import { getSettings } from "../../../services/settingsApi";

export default function BrandStorySection() {
  const { data: settings } = useAsyncData(getSettings, []);
  const story = settings?.brandStory;

  if (!story) return null;

  return (
    <section aria-labelledby="brand-story-title" className="bg-ivory-100">
      <div className="container-main grid items-center gap-12 py-section-mobile md:grid-cols-2 md:py-section-desktop">
        <div className="order-2 md:order-1">
          <img
            src="https://images.unsplash.com/photo-1550614000-4b95d415d183?q=80&w=1000&auto=format&fit=crop"
            alt={story.imageAlt ?? "Inside the Belioras atelier"}
            loading="lazy"
            className="w-full rounded-lg border border-gold-700/20"
          />
        </div>
        <div className="order-1 max-w-xl md:order-2">
          <p className="eyebrow">Our Maison</p>
          <h2
            id="brand-story-title"
            className="mt-3 font-display text-3xl tracking-wide text-espresso md:text-4xl"
          >
            {story.headline}
          </h2>
          <p className="mt-6 leading-relaxed text-espresso-soft">{story.body}</p>

          {story.stats?.length > 0 && (
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-umber-100 pt-8">
              {story.stats.map(({ value, label }) => (
                <div key={label}>
                  <dd className="font-display text-3xl text-gold-700">{value}</dd>
                  <dt className="mt-1 text-xs uppercase tracking-[0.15em] text-espresso-soft">
                    {label}
                  </dt>
                </div>
              ))}
            </dl>
          )}

          <Link
            to="/about-us"
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-gold-700 transition hover:text-gold-800"
          >
            Discover our story
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}