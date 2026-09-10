/* Page: Home - NewArrivalsSection */
import { useAsyncData } from "../../../hooks/useAsyncData";
import { useLanguage } from "../../../context/LanguageContext";
import { getNewArrivals } from "../../../services/productsApi";
import ProductCarousel from "../../../components/storefront/ProductCarousel";

export default function NewArrivalsSection() {
  const { data, loading } = useAsyncData(getNewArrivals, []);
  const { t } = useLanguage();

  return (
    <ProductCarousel
      title={t("home.newArrivalsTitle", "New Arrivals")}
      products={data}
      loading={loading}
      ctaLabel={t("common.viewAll", "View More")}
      ctaTo="/new-arrivals"
    />
  );
}
