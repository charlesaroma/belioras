import { useAsyncData } from "../../hooks/useAsyncData";
import { getProducts } from "../../services/productsApi";
import ProductCard from "../../components/storefront/ProductCard";
import { Filter, ArrowUpDown } from "lucide-react";
import { useState } from "react";

export default function ShopPage() {
  const { data: products, loading, error } = useAsyncData(getProducts, []);
  const [sortOrder, setSortOrder] = useState("newest");
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  // Basic sorting logic
  const sortedProducts = [...(products || [])].sort((a, b) => {
    if (sortOrder === "price-low") return a.price - b.price;
    if (sortOrder === "price-high") return b.price - a.price;
    return 0; // Default or newest
  });

  return (
    <div className="bg-ivory-50 min-h-screen pb-24">
      {/* Editorial Header */}
      <section className="relative h-[450px] md:h-[500px] pt-40 px-4 sm:px-6 md:px-8 overflow-hidden" aria-labelledby="shop-title">
        {/* Background Image & Gradient Shadow Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://ik.imagekit.io/sbgenu6wj/Belioras/Home/belioras-hero-2.jpeg" 
            alt="Belioras Collection" 
            className="h-full w-full object-cover"
          />
          {/* Subtle full overlay + stronger gradient shadow at the bottom where text sits */}
          <div className="absolute inset-0 bg-espresso/20" aria-hidden="true"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/50 to-transparent" aria-hidden="true"></div>
        </div>

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 id="shop-title" className="font-display text-[32px] md:text-[40px] tracking-wide text-ivory-50 mb-6 drop-shadow-lg">
            The Belioras Catalog
          </h1>
          <div className="text-[13px] md:text-[14px] leading-loose text-ivory-50 mb-6 max-w-2xl transition-all duration-300 drop-shadow-md">
            <p>
              Curated luxury fashion and premium hair, built around signature stories. 
              Delicate romantic lace, sculpting structured denim and deliberate lightweight 
              semi-sheer mesh.
            </p>
            {isTextExpanded && (
              <p className="mt-4 animate-in fade-in slide-in-from-top-2 duration-500">
                Each fabric is chosen with absolute intention to empower the modern woman. 
                From iconic corset tops to flowing dresses, this is your destination for quiet luxury.
              </p>
            )}
          </div>
          <button 
            onClick={() => setIsTextExpanded(!isTextExpanded)}
            className="text-xs font-bold tracking-widest uppercase text-ivory-50 hover:text-gold-400 transition-colors drop-shadow-md"
          >
            {isTextExpanded ? "Less" : "More"}
          </button>
        </div>
      </section>

      {/* Toolbar (Filters & Sorting Scaffold) */}
      <section className="container-main px-4 sm:px-6 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-[64px] z-40 bg-ivory-50/95 backdrop-blur-md border-b border-umber-50/30 text-[11px] font-bold uppercase tracking-[0.05em] text-espresso">
        <div className="flex items-center gap-6 md:gap-8 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          <button className="hover:text-gold-600 transition-colors whitespace-nowrap">Price</button>
          <button className="hover:text-gold-600 transition-colors whitespace-nowrap">Colours</button>
          <button className="hover:text-gold-600 transition-colors whitespace-nowrap">Category</button>
          <button className="hover:text-gold-600 transition-colors hidden sm:block whitespace-nowrap">Length</button>
          <button className="hover:text-gold-600 transition-colors whitespace-nowrap">All Filters</button>
        </div>
        
        <div className="flex items-center gap-6 md:gap-8 shrink-0">
          <span className="hidden sm:block text-espresso/70">{sortedProducts.length} items</span>
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-espresso/70">View</span>
            <button className="hover:text-gold-600 transition-colors text-espresso/40">3</button>
            <button className="text-espresso hover:text-gold-600 transition-colors">4</button>
            <button className="hover:text-gold-600 transition-colors text-espresso/40">8</button>
          </div>
          <div className="flex items-center gap-2">
            <select 
              className="bg-transparent border-none outline-none cursor-pointer focus:ring-0 uppercase font-bold tracking-[0.05em]"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Sort By</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="container-main px-4 sm:px-6 md:px-8 pt-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="size-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="py-20 text-center text-error">
            Failed to load products. Please try again.
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="py-20 text-center text-espresso/60 uppercase tracking-widest text-sm">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-6 sm:gap-y-16 lg:gap-x-8 lg:gap-y-20">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}