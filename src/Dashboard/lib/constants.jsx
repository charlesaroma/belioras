export const DASHBOARD_NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
  { id: 'products', label: 'Products', icon: 'Package' },
  { id: 'categories', label: 'Categories', icon: 'LayoutGrid' },
  { id: 'orders', label: 'Orders', icon: 'ShoppingCart' },
  { id: 'users', label: 'Users', icon: 'Users' },
  { id: 'settings', label: 'Settings', icon: 'Settings' },
];

export const ORDER_STATUS = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
};

export const PRODUCT_STATUS = {
  active: { label: 'Active', color: 'bg-green-100 text-green-800' },
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  out_of_stock: { label: 'Out of Stock', color: 'bg-red-100 text-red-800' },
};