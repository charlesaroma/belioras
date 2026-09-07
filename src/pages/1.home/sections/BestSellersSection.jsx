import { useAsyncData } from "../../../hooks/useAsyncData";
import { useLanguage } from "../../../context/LanguageContext";
import { getBestSellers } from "../../../services/productsApi";
import ProductCarousel from "../../../components/storefront/ProductCarousel";

/**
 * Best Sellers ranks by units actually sold rather than a hand-set flag — the
 * client asked for this section to maintain itself from order data. The
 * aggregation and its backfill both live in productsApi, so replacing the mock
 * layer with a real API changes nothing here.
 */
export default function BestSellersSection() {
  const { data, loading } = useAsyncData(getBestSellers, []);
  const { t } = useLanguage();

  return (
    <ProductCarousel
      eyebrow={t("home.bestSellers.eyebrow", "Most Loved")}
      title={t("home.bestSellers.title", "Best Sellers")}
      products={data}
      loading={loading}
      ctaLabel={t("common.viewAll", "View All")}
      ctaTo="/shop"
    />
  );
}
