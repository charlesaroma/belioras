/* Ui Component: Field */
import { cloneElement, isValidElement, useId } from "react";

import { cn } from "../../utils/cn";

export default function Field({
  label,
  error,
  helper,
  required = false,
  className,
  children,
}) {

  const id = useId();

/* helper Id */
  const helperId = `${id}-helper`;

/* error Id */
  const errorId = `${id}-error`;

  // Only the error is announced when both are present — a stale hint read
  // after a failure message buries the thing that needs fixing.
  const describedBy = error ? errorId : helper ? helperId : undefined;

  const control = isValidElement(children)
    ? cloneElement(children, {
        id: children.props.id ?? id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
        "aria-required": required || undefined,
        className: cn("input", error && "input-error", children.props.className),
      })
    : children;

  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={children?.props?.id ?? id} className="input-label">
        {label}
        {required && (
          <span className="ml-1 text-gold-700" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {control}

      {error ? (
        <p id={errorId} className="input-helper mt-1.5 text-error">
          {error}
        </p>
      ) : helper ? (
        <p id={helperId} className="input-helper mt-1.5">
          {helper}
        </p>
      ) : null}
    </div>
  );
}
