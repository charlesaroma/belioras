/* Account Component: Avatar */
import { cn } from "../../utils/cn";

const SIZES = {
  sm: "size-8 text-[12px]",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
};

export default function Avatar({ user, size = "md", className }) {
  const initial = (user?.name ?? user?.email ?? "U").slice(0, 1).toUpperCase();

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gold-500 font-semibold text-espresso",
        SIZES[size] ?? SIZES.md,
        className,
      )}
    >
      {user?.avatar ? (
        // Decorative: the name sits beside it everywhere this is used, so
        // announcing it twice would only add noise.
        <img src={user.avatar} alt="" className="size-full object-cover" />
      ) : (
        initial
      )}
    </span>
  );
}
