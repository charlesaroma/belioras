/* Usual Size From Past Orders */
import { useCustomerAuth } from "@/context/auth/useAuthRealm";
import { useAsyncData } from "../../../../hooks/useAsyncData";
import { getOrders } from "../../../../services/ordersApi";
import { getProducts } from "../../../../services/productsApi";
import { ownedPieces, usualSizeFor } from "../../../../utils/purchaseHistory";

/**
 * The size this shopper usually takes in this piece's collection.
 *
 * Surfaced at the moment of the decision rather than only in their account:
 * a wrong size is the most common reason a fashion order comes back, and the
 * answer is already in what they bought before. Null for a guest, for a
 * collection they have never ordered from, or when this piece is not offered
 * in that size.
 *
 * Computed rather than memoised: it is a pass over a handful of orders, and
 * the dependency would be the product's sizes array, which is a fresh
 * reference on every render anyway.
 */
export function useUsualSize(product) {
  const { user, isAuthenticated } = useCustomerAuth();

  const { data: orders } = useAsyncData(
    () => (isAuthenticated ? getOrders(user?.id) : Promise.resolve([])),
    [isAuthenticated, user?.id],
  );
  const { data: catalog } = useAsyncData(getProducts, []);

  if (!isAuthenticated || !product?.collectionId) return null;

  const usual = usualSizeFor(ownedPieces(orders, catalog), product.collectionId);
  return usual && product.sizes?.includes(usual) ? usual : null;
}
