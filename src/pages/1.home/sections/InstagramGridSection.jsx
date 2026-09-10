/* Page: Home - InstagramGridSection */
import { Heart } from "lucide-react";

import { useAsyncData } from "../../../hooks/useAsyncData";
import { useContentVersion } from "../../../context/ContentContext";
import { useLanguage } from "../../../context/LanguageContext";
import { getInstagramPosts } from "../../../services/contentApi";

export default function InstagramGridSection() {
  const version = useContentVersion();
  const { data, loading } = useAsyncData(getInstagramPosts, [version]);
  const { t } = useLanguage();

  const posts = (data?.posts ?? []).slice(0, 9);
  const handle = data?.handle ?? "@belioras";

  return (
    <section className="bg-espresso py-section-mobile md:py-section-tablet" aria-labelledby="social-heading">
      <div className="mb-10 px-4 text-center">
        <p className="eyebrow !text-gold-400">{t("home.social.eyebrow", "Follow us")}</p>
        <h2 id="social-heading" className="mt-2 font-display text-3xl text-ivory-50">
          {handle} {t("home.social.on", "on Instagram")}
        </h2>
        <p className="mt-3 text-sm text-ivory-50/60">
          {t("home.social.subtitle", "Follow the world of Belioras.")}
        </p>
      </div>

      <ul className="grid grid-cols-3">
        {loading
          ? Array.from({ length: 9 }).map((_, i) => (
              <li key={i} className="aspect-square bg-espresso-400/40" aria-hidden="true" />
            ))
          : posts.map((post) => (
              <li key={post.id}>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block aspect-square overflow-hidden"
                >
                  <img
                    src={post.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 flex items-center justify-center gap-2 bg-espresso/0 text-ivory-50 opacity-0 transition-all duration-300 group-hover:bg-espresso/50 group-hover:opacity-100">
                    <Heart className="size-4 fill-current" aria-hidden="true" />
                    <span className="text-sm font-medium tabular-nums">
                      {post.likes?.toLocaleString() ?? ""}
                    </span>
                  </span>
                  <span className="sr-only">
                    {t("home.social.viewPost", "View post on Instagram")}
                  </span>
                </a>
              </li>
            ))}
      </ul>
    </section>
  );
}
