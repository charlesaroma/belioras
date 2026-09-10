/* Back Link And Breadcrumb */
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ProductPageHeader({ product }) {
  const navigate = useNavigate();
  const location = useLocation();

  // A direct arrival has no history to go back to, so it falls to the
  // collection the piece belongs to rather than leaving the site.
  const cameFromWithinSite = location.key !== "default";
  const collectionPath = product?.collectionId ? `/${product.collectionId}` : "/shop";

  return (
    <>
      <button
        type="button"
        onClick={() => (cameFromWithinSite ? navigate(-1) : navigate(collectionPath))}
        className="group mb-6 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-espresso-soft transition-colors hover:text-espresso"
      >
        <ArrowLeft
          className="size-4 transition-transform group-hover:-translate-x-0.5"
          aria-hidden="true"
        />
        Back
      </button>

      <nav
        aria-label="Breadcrumb"
        className="mb-8 text-[11px] uppercase tracking-widest text-espresso/40"
      >
        <Link to="/" className="transition-colors hover:text-espresso">
          Home
        </Link>{" "}
        · <span className="text-espresso-soft">{product.name}</span>
      </nav>
    </>
  );
}
