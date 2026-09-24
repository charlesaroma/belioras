/* Admin Dashboard Page: Sizes - sizes */
import { useState } from "react";
import { Ruler, Shirt, UserRound } from "lucide-react";

import { cn } from "@/utils/cn";
import SizesPanel from "./sections/SizesPanel";
import GuidesPanel from "./sections/GuidesPanel";
import ModelsPanel from "./sections/ModelsPanel";

const TABS = [
  { id: "sizes", label: "Sizes", icon: Ruler },
  { id: "guides", label: "Size guides", icon: Shirt },
  { id: "models", label: "Models", icon: UserRound },
];

const PANELS = { sizes: SizesPanel, guides: GuidesPanel, models: ModelsPanel };

export default function DashSizes() {
  const [tab, setTab] = useState("sizes");
  const Panel = PANELS[tab];

  return (
    <div className="space-y-6">
      <div role="tablist" aria-label="Sizes & guides" className="inline-flex border border-umber-50 bg-ivory-50">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 border-r border-umber-50 px-5 py-3 text-[11px] uppercase tracking-[0.16em] transition-colors last:border-r-0",
              tab === t.id ? "bg-espresso text-ivory-50" : "text-espresso-soft hover:bg-brown-50/60 hover:text-espresso",
            )}
          >
            <t.icon className="size-3.5" aria-hidden="true" />
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        <Panel />
      </div>
    </div>
  );
}
