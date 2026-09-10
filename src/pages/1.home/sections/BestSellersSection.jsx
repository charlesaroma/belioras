/* Page: Home - BestSellersSection */
import { useAsyncData } from "../../../hooks/useAsyncData";
import { useLanguage } from "../../../context/LanguageContext";
import { getBestSellers } from "../../../services/productsApi";
import ProductCarousel from "../../../components/storefront/ProductCarousel";

export default function BestSellersSection() {
  const { data, loading } = useAsyncData(getBestSellers, []);
  const { t } = useLanguage();

  return (
    <ProductCarousel
      title={t("common.bestSellers", "Best Sellers")}
      products={data}
      loading={loading}
      ctaLabel={t("common.viewAll", "View More")}
      ctaTo="/shop"
    />
  );
}
