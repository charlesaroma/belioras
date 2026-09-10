/**
 * Joins customers to their orders.
 *
 * The list is only useful with purchase history attached — how many orders,
 * what they are worth, and when the last one landed. Activity is derived so
 * the filter has one field to work on rather than recomputing per row.
 */
export function toRows(users, orders) {
  const byUser = new Map();
  for (const order of orders ?? []) {
    if (!order.userId) continue;
    const entry = byUser.get(order.userId) ?? { count: 0, spent: 0, last: null, orders: [] };
    entry.count += 1;
    entry.spent += order.total ?? 0;
    entry.orders.push(order);
    const placed = new Date(order.createdAt);
    if (!entry.last || placed > entry.last) entry.last = placed;
    byUser.set(order.userId, entry);
  }

  return (users ?? [])
    .filter((u) => u.role === "customer")
    .map((u) => {
      const stats = byUser.get(u.id);
      return {
        ...u,
        orderCount: stats?.count ?? 0,
        spent: stats?.spent ?? 0,
        lastOrder: stats?.last ?? null,
        orders: (stats?.orders ?? []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        ),
        activity: (stats?.count ?? 0) > 0 ? "ordered" : "none",
      };
    });
}

/** Counts for the activity tabs, which need the whole set. */
export function activityTabs(rows) {
  const by = (a) => rows.filter((r) => r.activity === a).length;
  return [
    { value: "all", label: "All", count: rows.length },
    { value: "ordered", label: "Has ordered", count: by("ordered") },
    { value: "none", label: "No orders", count: by("none") },
  ];
}
