import { Package } from "lucide-react";

import ProductCard from "./ProductCard";
import { cn } from "../../utils/cn";

const COLUMN_CLASSES = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

export default function ProductGrid({
  products = [],
  loading = false,
  columns = 4,
  emptyMessage = "No products found.",
  className = "",
}) {
  const gridCls = cn("grid grid-cols-1 gap-x-5 gap-y-8", COLUMN_CLASSES[columns], className);

  if (loading) {
    const colCls = COLUMN_CLASSES[columns] ?? COLUMN_CLASSES[4];
    return (
      <div aria-hidden="true" className={cn("grid grid-cols-1", colCls, className)}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="skeleton aspect-[3/4] rounded-lg" />
            <div className="skeleton h-3 w-1/3" />
            <div className="skeleton h-3 w-3/4" />
            <div className="skeleton h-3 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <Package className="size-8 text-espresso-soft" aria-hidden="true" />
        <p className="text-sm text-espresso-soft">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={gridCls}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}