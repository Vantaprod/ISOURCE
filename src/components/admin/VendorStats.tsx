import { getVendorStats } from "@/app/actions/vendor-analytics";
import { Store, TrendingUp, TrendingDown, UserX, UserPlus } from "lucide-react";

export async function VendorStats() {
  const stats = await getVendorStats();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-charcoal flex items-center gap-2">
          <Store size={18} className="text-primary" /> Vendor & Seller Analytics
        </h2>
        <span className="text-xs text-muted">{stats.total} total registered</span>
      </div>

      {/* Row 1: Vendor status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2 text-green-700 mb-1">
            <Store size={14} /> <span className="text-[10px] font-bold uppercase tracking-wider">Currently Selling</span>
          </div>
          <p className="text-2xl font-extrabold text-green-900">{stats.currentlySelling}</p>
          <p className="text-[10px] text-green-600 font-medium mt-1">Active products listed</p>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-2 text-blue-700 mb-1">
            <TrendingUp size={14} /> <span className="text-[10px] font-bold uppercase tracking-wider">Active Accounts</span>
          </div>
          <p className="text-2xl font-extrabold text-blue-900">{stats.activeVendors}</p>
          <p className="text-[10px] text-blue-600 font-medium mt-1">Logged in &lt; 30 days</p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-amber-700 mb-1">
            <TrendingDown size={14} /> <span className="text-[10px] font-bold uppercase tracking-wider">Inactive</span>
          </div>
          <p className="text-2xl font-extrabold text-amber-900">{stats.inactiveVendors}</p>
          <p className="text-[10px] text-amber-600 font-medium mt-1">No login in 30+ days</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <UserX size={14} /> <span className="text-[10px] font-bold uppercase tracking-wider">Previous / Left</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-800">{stats.previousVendors}</p>
          <p className="text-[10px] text-gray-500 font-medium mt-1">Suspended or removed</p>
        </div>
      </div>

      {/* Row 2: New registrations by period */}
      <div className="rounded-xl border border-border bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus size={16} className="text-primary" />
          <h3 className="text-sm font-bold text-charcoal">New Vendor Registrations</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-lg bg-surface">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Today</p>
            <p className="text-xl font-extrabold text-charcoal">{stats.newToday}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-surface">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">This Week</p>
            <p className="text-xl font-extrabold text-charcoal">{stats.newThisWeek}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-surface">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">This Month</p>
            <p className="text-xl font-extrabold text-charcoal">{stats.newThisMonth}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-surface">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">This Year</p>
            <p className="text-xl font-extrabold text-charcoal">{stats.newThisYear}</p>
          </div>
        </div>
      </div>
    </div>
  );
}