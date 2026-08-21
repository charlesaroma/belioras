import { COLOR_MAP } from "./constants";

function ColorDot({ color, active, onClick }) {
  return (
    <button
      type="button"
      title={color}
      onClick={onClick}
      className={`cursor-pointer size-7 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
        active ? "border-espresso scale-110 shadow-sm" : "border-transparent"
      }`}
      style={{ backgroundColor: COLOR_MAP[color] ?? "#ccc" }}
      aria-label={`Filter by ${color}${active ? " (active)" : ""}`}
      aria-pressed={active}
    />
  );
}

export default ColorDot;