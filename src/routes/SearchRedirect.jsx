/* Legacy Search Redirect */
import { Navigate, useSearchParams } from "react-router-dom";

// /search?q= was the old results route; the shop owns search now.
export default function SearchRedirect() {
  const [params] = useSearchParams();
  const q = params.get("q");
  return <Navigate to={q ? `/shop?q=${encodeURIComponent(q)}` : "/shop"} replace />;
}
