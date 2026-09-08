import { cn } from "../../utils/cn";

const SIZES = {
  sm: "size-8 text-[12px]",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
};

/**
 * The customer's mark: their photograph, or their initial on gold.
 *
 * One component because there were two. The navbar rendered `user.avatar` with
 * an initial fallback; the account overview drew its own circle that ignored
 * `user.avatar` entirely — so a customer with a photograph would have seen it
 * in the header and a letter on their own account page.
 *
 * `user.avatar` is read but never written today. The data path is open —
 * publicUser and updateProfile in authApi both carry it — so an upload has
 * somewhere to land once the backend media module exists.
 */
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
