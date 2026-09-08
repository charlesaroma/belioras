import { COLOR_HEX } from "../../utils/constants";
import { cn } from "../../utils/cn";

/** Colour swatches. `radiogroup` because this is one choice from a set. */
export default function ColorSelector({ options = [], value, onChange = () => {} }) {
  if (!options.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Colour">
      {options.map((name) => {
        const selected = name === value;
        return (
          <button
            key={name}
            type="button"
            role="radio"
            aria-checked={selected}
            // Colour alone must never be the only carrier of meaning.
            aria-label={name}
            title={name}
            onClick={() => onChange(name)}
            className={cn(
              "size-6 rounded-full border transition-all duration-150",
              selected
                ? "border-transparent ring-2 ring-espresso ring-offset-2 ring-offset-ivory-50"
                : "border-umber-100 hover:scale-110",
            )}
            style={{ backgroundColor: COLOR_HEX[name] ?? "#ccc" }}
          />
        );
      })}
    </div>
  );
}
