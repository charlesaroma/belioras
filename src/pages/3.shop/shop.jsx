import { useState, useMemo } from "react";
import { useAsyncData } from "../../hooks/useAsyncData";
import { getProducts } from "../../services/productsApi";

import ShopHeader from "./sections/ShopHeader";
import CategoryTabs from "./sections/CategoryTabs";
import FilterPanel from "./sections/FilterPanel";
import ProductGrid from "./sections/ProductGrid";

export default function ShopPage() {
  const { data: rawProductsRaw, loading, error } = useAsyncData(getProducts, []);
  
  // Guard against null during initial load — useAsyncData starts with data=null
  const rawProducts = useMemo(() => rawProductsRaw ?? [], [rawProductsRaw]);

  const priceRange = useMemo(() => {
    if (!rawProducts || !rawProducts.length) return [0, 300];
    const prices = rawProducts.map((p) => p.price);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [rawProducts]);

  const allColors = useMemo(() => {
    if (!rawProducts || !rawProducts.length) return [];
    const s = new Set();
    rawProducts.forEach((p) => (p.colors ?? []).forEach((c) => s.add(c)));
    return [...s].sort();
  }, [rawProducts]);

  const [sortOrder, setSortOrder] = useState("newest");
  const [activeCategory, setActiveCategory] = useState("All");
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filters, setFilters] = useState({
    colors: [],
    priceValue: [0, 300],
    style: "All",
    onSale: false,
  });
  const [cols, setCols] = useState(4); // grid columns on desktop

  // Sync priceValue when products load
  const priceValue = filters.priceValue[1] === 300 && priceRange[1] !== 300
    ? priceRange
    : filters.priceValue;

  const updateFilters = (partial) => setFilters((prev) => ({ ...prev, ...partial }));

  // Active filter count badge
  const activeFilterCount = [
    filters.colors.length > 0,
    filters.style !== "All",
    filters.onSale,
    filters.priceValue[0] > priceRange[0] || filters.priceValue[1] < priceRange[1],
  ].filter(Boolean).length;

  // ── Apply filters & sort ──
  const filtered = useMemo(() => {
    let list = [...(rawProducts ?? [])];

    // Category tab
    if (activeCategory !== "All") {
      list = list.filter((p) => p.collectionId === activeCategory.toLowerCase());
    }

    // Style / sub-category
    if (filters.style !== "All") {
      list = list.filter((p) =>
        (p.categories ?? []).some((c) => c.toLowerCase() === filters.style.toLowerCase())
      );
    }

    // Colors
    if (filters.colors.length) {
      list = list.filter((p) =>
        (p.colors ?? []).some((c) => filters.colors.includes(c))
      );
    }

    // Price
    list = list.filter((p) => p.price >= priceValue[0] && p.price <= priceValue[1]);

    // On sale
    if (filters.onSale) {
      list = list.filter((p) => p.originalPrice && p.originalPrice > p.price);
    }

    // Sort
    if (sortOrder === "price-low") list.sort((a, b) => a.price - b.price);
    else if (sortOrder === "price-high") list.sort((a, b) => b.price - a.price);
    else if (sortOrder === "rating") list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    else if (sortOrder === "sale") list.sort((a, b) => (b.originalPrice ? 1 : 0) - (a.originalPrice ? 1 : 0));

    return list;
  }, [rawProducts, activeCategory, filters, priceValue, sortOrder]);

  const handleClearFilters = () => {
    setFilters({ colors: [], priceValue: priceRange, style: "All", onSale: false });
    setActiveCategory("All");
  };

  return (
    <div className="bg-ivory-50 min-h-screen">
      <FilterPanel
        open={filterPanelOpen}
        onClose={() => setFilterPanelOpen(false)}
        filters={{ ...filters, priceValue }}
        onChange={updateFilters}
        allColors={allColors}
        priceRange={priceRange}
      />

      {/* ── Editorial Header ── */}
      <ShopHeader />

      {/* ── Category Tabs ── */}
      <CategoryTabs
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        filterPanelOpen={filterPanelOpen}
        setFilterPanelOpen={setFilterPanelOpen}
        activeFilterCount={activeFilterCount}
        filteredCount={filtered.length}
        cols={cols}
        setCols={setCols}
        filters={filters}
        updateFilters={updateFilters}
        onClearFilters={handleClearFilters}
      />

      {/* ── Product Grid ── */}
      <ProductGrid
        filtered={filtered}
        cols={cols}
        loading={loading}
        error={error}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}