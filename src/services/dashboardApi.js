import { mockApi } from "@/api/mock";
import { getAllOrders } from "./ordersApi";
import { getProducts } from "./productsApi";

/**
 * Dashboard aggregates.
 *
 * The overview previously displayed hardcoded figures — "$124,500" in a store
 * that trades in euros, and dates from 2024 — so it looked plausible while
 * telling Belioras nothing. Everything here is derived from the same order and
 * product data the storefront reads, which means the dashboard and the shop can
 * never disagree, and a test order placed on the site shows up here.
 *
 * Amounts are returned in the base currency; the view formats them through the
 * active currency, exactly as product prices are handled.
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function getDashboardStats() {
  return mockApi(async () => {
    const [orders, products] = await Promise.all([getAllOrders(), getProducts()]);

    const live = orders.filter((o) => o.status !== "cancelled");

    const revenue = live.reduce((sum, o) => sum + (o.total ?? 0), 0);

    const customers = new Set(live.map((o) => o.userId ?? o.email)).size;

    // Month-over-month, using the most recent month present in the data rather
    // than the calendar month — seed data is not necessarily current.
    const byMonth = groupByMonth(live);

    const months = [...byMonth.keys()].sort();

    const current = byMonth.get(months.at(-1)) ?? { revenue: 0, count: 0 };

    const previous = byMonth.get(months.at(-2)) ?? { revenue: 0, count: 0 };

    return {
      revenue,
      revenueChange: percentChange(previous.revenue, current.revenue),
      orderCount: live.length,
      orderChange: percentChange(previous.count, current.count),
      productCount: products.length,
      lowStockCount: products.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 3).length,
      customerCount: customers,
      averageOrder: live.length ? revenue / live.length : 0,
      series: months.map((key) => ({
        name: MONTHS[Number(key.split("-")[1])],
        sales: Math.round(byMonth.get(key).revenue),
      })),
    };
  }, 0);
}

/** The five most recent orders, shaped for the overview table. */
export function getRecentOrders(limit = 5) {
  return mockApi(async () => {

    const orders = await getAllOrders();
    return orders
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
      .map((order) => ({
        id: order.id,
        customer: order.name ?? order.email ?? "Guest",
        total: order.total ?? 0,
        status: order.status,
        createdAt: order.createdAt,
      }));
  }, 0);
}

function groupByMonth(orders) {

  const map = new Map();
  for (const order of orders) {

    const date = new Date(order.createdAt);
    if (Number.isNaN(date.getTime())) continue;

    const key = `${date.getFullYear()}-${date.getMonth()}`;

    const entry = map.get(key) ?? { revenue: 0, count: 0 };
    entry.revenue += order.total ?? 0;
    entry.count += 1;
    map.set(key, entry);
  }
  return map;
}

/** Null rather than a fake 0% when there is no prior period to compare against. */
function percentChange(before, after) {
  if (!before) return null;
  return ((after - before) / before) * 100;
}
