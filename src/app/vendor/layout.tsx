import Link from "next/link";
import { LayoutDashboard, PlusCircle, ArrowLeft, ShoppingBag, Wallet } from "lucide-react";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:py-10 grid md:grid-cols-[240px_1fr] gap-6">
      <aside>
        <nav className="rounded-lg border border-border bg-white overflow-hidden sticky top-24">
          <div className="p-4 border-b border-border bg-surface"><h2 className="font-bold text-charcoal text-sm">Vendor Portal</h2></div>
          <ul className="text-sm">
            <li><Link href="/vendor" className="flex items-center gap-2 px-4 py-3 text-charcoal hover:bg-surface border-l-2 border-transparent hover:border-primary"><LayoutDashboard size={16} /> Dashboard</Link></li>
            <li><Link href="/vendor/orders" className="flex items-center gap-2 px-4 py-3 text-charcoal hover:bg-surface border-l-2 border-transparent hover:border-primary"><ShoppingBag size={16} /> My Orders</Link></li>
            <li><Link href="/vendor/finance" className="flex items-center gap-2 px-4 py-3 text-charcoal hover:bg-surface border-l-2 border-transparent hover:border-primary"><Wallet size={16} /> Finances</Link></li>
            <li><Link href="/vendor/products/new" className="flex items-center gap-2 px-4 py-3 text-charcoal hover:bg-surface border-l-2 border-transparent hover:border-primary"><PlusCircle size={16} /> Add Product</Link></li>
          </ul>
          <div className="border-t border-border p-2"><Link href="/" className="flex items-center gap-2 px-2 py-2 text-xs text-muted hover:text-primary"><ArrowLeft size={14} /> Back to Store</Link></div>
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}