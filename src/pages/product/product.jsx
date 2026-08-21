import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Heart, ArrowRight, Loader2, Share2 } from "lucide-react";

import { useAsyncData } from "../../hooks/useAsyncData";
import { getProduct, getProductsByCollection } from "../../services/productsApi";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useToast } from "../../context/ToastContext";
import { formatCurrency, convertAmount } from "../../utils/formatCurrency";

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-umber-50 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-sm font-semibold uppercase tracking-widest text-espresso hover:text-gold-700 transition-colors"
      >
        {title}
        <ChevronDown className={`size-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 text-sm text-espresso/70 leading-relaxed space-y-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const { data: product, loading, error } = useAsyncData(() => getProduct(slug), [slug]);
  const { data: relatedProducts } = useAsyncData(
    () => (product?.collectionId ? getProductsByCollection(product.collectionId) : Promise.resolve([])),
    [product?.collectionId]
  );
  
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { currency } = useCurrency();
  const { toast } = useToast();

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (product) {
      if (product.colors?.length) setSelectedColor(product.colors[0]);
      setSelectedSize(null); // Reset size on product change
      setActiveImage(0);
      document.title = `${product.name} | Belioras`;
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-gold-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-display text-4xl text-espresso mb-4">Product Not Found</h1>
        <p className="text-espresso/70 mb-8 max-w-md mx-auto">
          We couldn't find the piece you're looking for. It may have been removed or the link is incorrect.
        </p>
        <Link to="/shop" className="btn bg-espresso text-ivory-50 px-8 py-3 uppercase tracking-widest text-xs font-bold hover:bg-gold-700 hover:text-espresso transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }

  const priceFormatted = formatCurrency(convertAmount(product.price, "EUR", currency), currency);
  const originalPriceFormatted = product.originalPrice 
    ? formatCurrency(convertAmount(product.originalPrice, "EUR", currency), currency)
    : null;
    
  const isWishlisted = has(product.id);

  const handleAddToCart = () => {
    if (product.sizes?.length && !selectedSize) {
      toast("Please select a size", "error");
      return;
    }
    
    addItem({
      ...product,
      selectedColor,
      selectedSize
    });
    toast("Added to your bag", "success");
  };

  const images = product.images?.length ? product.images : [
    "https://ik.imagekit.io/sbgenu6wj/Belioras/Home/hero-image-belioras.PNG"
  ];

  return (
    <div className="bg-ivory-50">
      {/* Product Split Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 xl:gap-x-16 gap-y-12">
          
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4 lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-24 shrink-0 hide-scrollbar pb-2 md:pb-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-[3/4] w-20 md:w-full shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                    activeImage === idx ? "border-gold-500 opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover object-top" />
                </button>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="relative flex-1 aspect-[3/4] md:aspect-auto md:h-full bg-brown-50 overflow-hidden rounded-lg">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={images[activeImage]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </AnimatePresence>
              
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-ivory-50/90 backdrop-blur text-espresso text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-subtle">
                  New Arrival
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="flex flex-col lg:pl-4 xl:pl-8 py-2 md:py-8 lg:min-h-full">
            {/* Breadcrumb & Wishlist */}
            <div className="flex items-center justify-between mb-6">
              <nav aria-label="Breadcrumb" className="flex items-center text-xs text-espresso/50 uppercase tracking-widest">
                <Link to="/shop" className="hover:text-gold-700 transition-colors">Shop</Link>
                <span className="mx-2">/</span>
                <Link to={`/shop/${product.collectionId}`} className="hover:text-gold-700 transition-colors">
                  {product.collectionId}
                </Link>
              </nav>
              
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  className="size-8 flex items-center justify-center rounded-full border border-umber-50 text-espresso/50 hover:border-gold-500 hover:text-gold-600 transition-colors"
                  title="Share"
                >
                  <Share2 className="size-3.5" />
                </button>
                <button 
                  type="button"
                  onClick={() => toggle(product.id)}
                  className={`size-8 flex items-center justify-center rounded-full border transition-colors ${
                    isWishlisted 
                      ? "border-gold-500 text-gold-500 bg-gold-50" 
                      : "border-umber-50 text-espresso/50 hover:border-gold-500 hover:text-gold-600"
                  }`}
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`size-3.5 ${isWishlisted ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>

            {/* Title & Price */}
            <h1 className="font-display text-4xl md:text-5xl text-espresso mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-xl font-medium text-espresso">{priceFormatted}</span>
              {originalPriceFormatted && (
                <span className="text-sm text-espresso/40 line-through">{originalPriceFormatted}</span>
              )}
            </div>

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-espresso">Color</span>
                  <span className="text-xs text-espresso/60">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative h-10 w-10 rounded-full border-2 transition-all ${
                        selectedColor === color ? "border-espresso p-1" : "border-transparent p-0 hover:border-umber-100"
                      }`}
                      aria-label={`Select color ${color}`}
                    >
                      {/* Using a generic color mapping approach since we don't have hex codes in the JSON */}
                      <span className="block h-full w-full rounded-full border border-black/5 bg-brown-200 shadow-inner" style={{ 
                        backgroundColor: color.toLowerCase() === 'ebony' ? '#2d2a26' : 
                                       color.toLowerCase() === 'champagne' ? '#f1e6d4' :
                                       color.toLowerCase() === 'burgundy' ? '#6b2d35' : 
                                       color.toLowerCase() === 'ivory' ? '#f8f5f0' : undefined
                      }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-espresso">Size</span>
                  <Link to="/shoe-size-guide" className="text-[10px] uppercase tracking-widest text-gold-700 hover:text-espresso transition-colors underline underline-offset-4">
                    Size Guide
                  </Link>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-sm font-medium transition-colors border ${
                        selectedSize === size 
                          ? "bg-espresso text-ivory-50 border-espresso" 
                          : "bg-transparent text-espresso border-umber-50 hover:border-gold-500 hover:bg-gold-50/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mb-12">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full btn bg-espresso text-ivory-50 hover:bg-gold-700 hover:text-espresso transition-all py-4 uppercase tracking-[0.2em] text-xs font-bold shadow-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Bag"}
              </button>
              
              {product.stock > 0 && product.stock < 10 && (
                <p className="text-center text-xs text-rose-700 mt-3 flex items-center justify-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                  Only {product.stock} left in stock
                </p>
              )}
            </div>

            {/* Details Accordions */}
            <div className="border-t border-umber-50">
              <Accordion title="Description" defaultOpen>
                <p>{product.description}</p>
                {product.details?.length > 0 && (
                  <ul className="list-disc pl-4 mt-4 space-y-1">
                    {product.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                )}
              </Accordion>
              
              <Accordion title="Materials & Care">
                {product.materials?.length > 0 && (
                  <div className="mb-4">
                    <strong className="block text-espresso font-medium mb-1">Materials</strong>
                    <ul className="list-disc pl-4 space-y-1">
                      {product.materials.map((m, idx) => <li key={idx}>{m}</li>)}
                    </ul>
                  </div>
                )}
                {product.care?.length > 0 && (
                  <div>
                    <strong className="block text-espresso font-medium mb-1">Care Instructions</strong>
                    <ul className="list-disc pl-4 space-y-1">
                      {product.care.map((c, idx) => <li key={idx}>{c}</li>)}
                    </ul>
                  </div>
                )}
              </Accordion>
              
              <Accordion title="Shipping & Returns">
                <p>Complimentary express shipping on all orders over €500.</p>
                <p className="mt-2">Returns are accepted within 14 days of delivery. Pieces must be unworn, in perfect condition, and with all tags attached.</p>
                <Link to="/shipping-policy" className="inline-block mt-3 text-gold-700 hover:text-espresso font-medium underline underline-offset-4">
                  View full policy
                </Link>
              </Accordion>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts?.length > 1 && (
        <div className="border-t border-umber-50 bg-ivory-50 py-16 md:py-24">
          <div className="container-main">
            <h2 className="font-display text-3xl md:text-4xl text-espresso mb-10 text-center">You May Also Like</h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {relatedProducts
                .filter(p => p.id !== product.id)
                .slice(0, 4)
                .map(p => (
                  <Link key={p.id} to={`/product/${p.slug}`} className="group block">
                    <div className="aspect-[3/4] overflow-hidden bg-brown-50 rounded-lg mb-4">
                      <img 
                        src={p.images?.[0] || "https://ik.imagekit.io/sbgenu6wj/Belioras/Home/hero-image-belioras.PNG"} 
                        alt={p.name} 
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-sm font-medium text-espresso group-hover:text-gold-700 transition-colors truncate">{p.name}</h3>
                    <p className="text-sm text-espresso/60 mt-1">{formatCurrency(convertAmount(p.price, "EUR", currency), currency)}</p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}