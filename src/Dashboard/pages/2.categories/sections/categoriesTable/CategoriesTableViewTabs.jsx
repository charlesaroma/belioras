/* Admin Dashboard Page: Categories - CategoriesTableViewTabs */
import { LayoutGrid, Tags } from "lucide-react";

import { cn } from "../../../../../utils/cn";

export default function ViewTabs({ tab, onChange, leafCount, attributeCount }) {
  const options = [
    { id: "menu", label: "Menu leaves", icon: LayoutGrid, count: leafCount },
    { id: "attributes", label: "Attributes", icon: Tags, count: attributeCount },
  ];

  return (
    <div className="flex border border-umber-50" role="tablist" aria-label="Category view">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="tab"
          aria-selected={tab === option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            "flex items-center gap-2 border-r border-umber-50 px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] transition-colors last:border-r-0",
            tab === option.id
              ? "bg-espresso text-ivory-50"
              : "text-espresso-soft hover:bg-brown-50/60 hover:text-espresso",
          )}
        >
          <option.icon className="size-3.5" aria-hidden="true" />
          {option.label}
          <span className="tabular-nums opacity-60">{option.count}</span>
        </button>
      ))}
    </div>
  );
}
