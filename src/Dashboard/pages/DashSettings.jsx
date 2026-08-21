import { Save } from "lucide-react";

export default function DashSettings() {
  return (
    <div className="space-y-6">
      {/* General Settings */}
      <div className="rounded-xl border border-umber-50 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-espresso mb-4">General Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-espresso mb-2">Store Name</label>
            <input
              type="text"
              defaultValue="Belioras"
              className="w-full px-4 py-2 rounded-lg border border-umber-50 bg-white text-sm text-espresso focus:border-gold-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-espresso mb-2">Store Email</label>
            <input
              type="email"
              defaultValue="contact@belioras.com"
              className="w-full px-4 py-2 rounded-lg border border-umber-50 bg-white text-sm text-espresso focus:border-gold-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-espresso mb-2">Currency</label>
            <select className="w-full px-4 py-2 rounded-lg border border-umber-50 bg-white text-sm text-espresso focus:border-gold-500 focus:outline-none">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="rounded-xl border border-umber-50 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-espresso mb-4">Notification Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-espresso">New Order Notifications</p>
              <p className="text-xs text-espresso/60">Receive email when new orders are placed</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gold-500 transition-colors">
              <span className="translate-x-6 inline-block size-4 transform rounded-full bg-white transition-transform" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-espresso">Low Stock Alerts</p>
              <p className="text-xs text-espresso/60">Get notified when products are running low</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gold-500 transition-colors">
              <span className="translate-x-6 inline-block size-4 transform rounded-full bg-white transition-transform" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-espresso">Customer Inquiries</p>
              <p className="text-xs text-espresso/60">Email for new contact form submissions</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-umber-50 transition-colors">
              <span className="translate-x-1 inline-block size-4 transform rounded-full bg-white transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-espresso text-ivory-50 text-sm font-medium hover:bg-espresso/80 transition-colors">
          <Save className="size-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}