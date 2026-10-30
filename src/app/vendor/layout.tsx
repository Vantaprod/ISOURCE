import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, Users, BarChart3, DollarSign, Wallet, Store, ShieldCheck, UserCog, Settings, LifeBuoy, Plus, Sun } from "lucide-react";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:py-8 grid md:grid-cols-[260px_1fr] gap-6">
      <aside>
        <nav className="rounded-xl bg-charcoal text-white overflow-hidden sticky top-24">
          <div className="p-5 border-b border-white/10">
            <h2 className="font-extrabold text-lg">Vendor Workspace</h2>
          </div>
          <ul className="py-2 text-sm text-white/70">
            <li><Link href="/vendor" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-primary bg-primary/20 text-white font-medium"><LayoutDashboard size={18} /> Dashboard</Link></li>
            <li><Link href="/vendor/products" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><Package size={18} /> Products</Link></li>
            <li><Link href="/vendor/orders" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><ShoppingBag size={18} /> Orders</Link></li>
            <li><Link href="/vendor/customers" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><Users size={18} /> Customers</Link></li>
            <li><Link href="/vendor/analytics" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><BarChart3 size={18} /> Analytics</Link></li>
            <li><Link href="/vendor/finance" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><DollarSign size={18} /> Earnings</Link></li>
            <li><Link href="/vendor/finance/payouts" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><Wallet size={18} /> Payouts</Link></li>
            <li><Link href="/vendor/profile" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><Store size={18} /> Store Profile</Link></li>
            <li><Link href="/vendor/verification" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><ShieldCheck size={18} /> Verification</Link></li>
            <li><Link href="/vendor/staff" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><UserCog size={18} /> Staff</Link></li>
            <li><Link href="/vendor/settings" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><Settings size={18} /> Settings</Link></li>
            <li><Link href="/contact" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><LifeBuoy size={18} /> Support</Link></li>
          </ul>
          <div className="p-4 mt-4">
            <div className="rounded-xl p-5 bg-gradient-to-br from-primary to-orange-600 relative overflow-hidden">
              <Sun size={40} className="absolute top-2 right-2 text-white/20" />
              <h3 className="font-bold text-white mb-1">Grow Your Store</h3>
              <p className="text-xs text-white/80 mb-3">More visibility. More sales.</p>
              <Link href="/vendor/products/new" className="inline-flex items-center gap-1 h-8 px-3 rounded bg-white text-primary text-xs font-bold"><Plus size={12} /> Add Product</Link>
            </div>
          </div>
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}