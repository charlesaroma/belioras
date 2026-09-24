/* Checkout */
import { charge } from "./paymentsApi";
import { confirmPayment, createOrder } from "./ordersApi";

/**
 * Places an order and pays for it, in the order the real flow takes:
 *
 *   1. the order is created, waiting for payment, holding its stock;
 *   2. the customer pays with the payment provider;
 *   3. the provider tells the server the payment succeeded (webhook), and the
 *      server confirms the order — paid, invoiced, confirmation email queued.
 *
 * With a backend, (1) is POST /checkout, (2) happens on Stripe's or PayPal's
 * page, and (3) is the server's webhook handler; the browser only waits for
 * the order to turn paid. Here the provider is simulated and succeeds.
 */
export async function placeOrder(payload, { method = "card" } = {}) {
  const order = await createOrder({ ...payload, paymentMethod: method });
  const payment = charge(order, method);
  return confirmPayment(order.id, payment);
}
