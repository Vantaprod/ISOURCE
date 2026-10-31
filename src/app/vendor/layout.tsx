import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, DollarSign, Plus, Sun } from "lucide-react";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:py-8">
      <div className="flex flex-col md:flex-row md:gap-6">
        <div className="hidden md:block md:w-[260px] md:flex-shrink-0">
          <div
            style={{
              position: "sticky",
              top: "148px",
              maxHeight: "calc(100vh - 164px)",
              overflowY: "auto",
            }}
          >
            <nav className="rounded-xl bg-charcoal text-white overflow-hidden">
              <div className="p-5 border-b border-white/10">
                <h2 className="font-extrabold text-lg">Vendor Workspace</h2>
              </div>
              <ul className="py-2 text-sm text-white/70">
                <li><Link href="/vendor" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-primary bg-primary/20 text-white font-medium"><LayoutDashboard size={18} /> Dashboard</Link></li>
                <li><Link href="/vendor/products" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><Package size={18} /> Products</Link></li>
                <li><Link href="/vendor/orders" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><ShoppingBag size={18} /> Orders</Link></li>
                <li><Link href="/vendor/finance" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><DollarSign size={18} /> Earnings</Link></li>
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
          </div>
        </div>
        <div className="md:flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}