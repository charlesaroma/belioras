import HeroSection from "./sections/HeroSection";
import ValuePropsSection from "./sections/ValuePropsSection";
import FeaturedCategoriesSection from "./sections/FeaturedCategoriesSection";
import NewArrivalsSection from "./sections/NewArrivalsSection";
import FeaturedProductsSection from "./sections/FeaturedProductsSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import BrandStorySection from "./sections/BrandStorySection";
import NewsletterSection from "./sections/NewsletterSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ValuePropsSection />
      <FeaturedCategoriesSection />
      <NewArrivalsSection />
      <FeaturedProductsSection />
      <TestimonialsSection />
      <BrandStorySection />
      <NewsletterSection />
    </main>
  );
}