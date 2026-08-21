import { Menu } from "lucide-react";

export default function DashHeader({ title, onMenuToggle, showMenuButton = true }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-umber-50 bg-ivory-50">
      <div className="flex items-center gap-4">
        {showMenuButton && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden flex size-10 items-center justify-center rounded-lg text-espresso hover:bg-umber-50 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="size-5" />
          </button>
        )}
        <h1 className="text-xl font-semibold text-espresso">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-espresso text-ivory-50 text-sm font-medium hover:bg-espresso/80 transition-colors"
        >
          View Store
        </button>
      </div>
    </header>
  );
}