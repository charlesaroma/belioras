/* Product Component: ColorSelector */
import { COLOR_HEX } from "../../utils/constants";
import { cn } from "../../utils/cn";

export default function ColorSelector({ options = [], value, onChange = () => {} }) {
  if (!options.length) return null;

  return (
    // The swatch stays 24px; the button around it is 44px. A 24px target is
    // roughly half the width of a fingertip, and this is the choice a shopper
    // makes most often on the page.
    <div className="-mx-2.5 flex flex-wrap items-center" role="radiogroup" aria-label="Colour">
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
            className="flex size-11 items-center justify-center"
          >
            <span
              className={cn(
                "size-6 rounded-full border transition-all duration-150",
                selected
                  ? "border-transparent ring-2 ring-espresso ring-offset-2 ring-offset-ivory-50"
                  : "border-umber-100 hover:scale-110",
              )}
              style={{ backgroundColor: COLOR_HEX[name] ?? "#ccc" }}
            />
          </button>
        );
      })}
    </div>
  );
}
