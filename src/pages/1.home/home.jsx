import HeroSection from "./sections/HeroSection";
import TrustBadgesSection from "./sections/TrustBadgesSection";
import FeaturedCategoriesSection from "./sections/FeaturedCategoriesSection";
import FeaturedCollectionSection from "./sections/FeaturedCollectionSection";
import NewArrivalsSection from "./sections/NewArrivalsSection";
import BestSellersSection from "./sections/BestSellersSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import BrandStorySection from "./sections/BrandStorySection";
import InstagramGridSection from "./sections/InstagramGridSection";

/**
 * Homepage order as agreed in the design review: Featured Collection takes the
 * slot New Arrivals used to hold, New Arrivals and Best Sellers become
 * horizontal rails, and the newsletter moves out of here into the footer.
 *
 * Returns a fragment, not <main> — the router's Layout already provides one.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBadgesSection />
      <FeaturedCategoriesSection />
      <FeaturedCollectionSection />
      <NewArrivalsSection />
      <BestSellersSection />
      <TestimonialsSection />
      <BrandStorySection />
      <InstagramGridSection />
    </>
  );
}
