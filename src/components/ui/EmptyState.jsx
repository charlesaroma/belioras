/* Ui Component: EmptyState */
import { cn } from "../../utils/cn";

import Button from "./Button";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center border border-umber-50 px-6 py-16 text-center",
        className,
      )}
    >
      {Icon && (
        <span className="mb-5 flex size-12 items-center justify-center border border-umber-50 text-gold-700">
          <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </span>
      )}

      <h3 className="font-display text-xl tracking-wide text-espresso">{title}</h3>

      {description && (
        <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-espresso-soft">
          {description}
        </p>
      )}

      {action && (
        <Button className="mt-6" size="md" variant="primary" to={action.to} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
