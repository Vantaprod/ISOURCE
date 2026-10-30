import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Store, Users, ArrowLeft, Wallet, RotateCcw, Building2, ShieldAlert, Eye, Image as ImageIcon, Shield, FolderTree, Megaphone } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:py-10 grid md:grid-cols-[260px_1fr] gap-6">
      <aside>
        <nav className="rounded-lg border border-border bg-white overflow-hidden sticky top-24">
          <div className="p-4 border-b border-border bg-charcoal text-white"><h2 className="font-bold text-sm tracking-wide uppercase">Admin Control</h2></div>
          <ul className="text-sm py-2">
            <li><Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-charcoal hover:bg-surface border-l-2 border-transparent hover:border-primary font-medium"><LayoutDashboard size={18} /> Overview</Link></li>
            <li><Link href="/admin/moderation" className="flex items-center gap-3 px-4 py-3 text-charcoal hover:bg-surface border-l-2 border-transparent hover:border-primary font-medium"><Eye size={18} /> Moderation</Link></li>
            <li><Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-charcoal hover:bg-surface border-l-2 border-transparent hover:border-primary font-medium"><ShoppingBag size={18} /> Orders</Link></li>
            <li><Link href="/admin/vendors" className="flex items-center gap-3 px-4 py-3 text-charcoal hover:bg-surface border-l-2 border-transparent hover:border-primary font-medium"><Store size={18} /> Vendors</Link></li>
            <li><Link href="/admin/brands" className="flex items-center gap-3 px-4 py-3 text-charcoal hover:bg-surface border-l-2 border-transparent hover:border-primary font-medium"><Building2 size={18} /> Brands</Link></li>
            <li><Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-charcoal hover:bg-surface border-l-2 border-transparent hover:border-primary font-medium"><Users size={18} /> Users</Link></li>
            <li><Link href="/admin/payouts" className="flex items-center gap-3 px-4 py-3 text-charcoal hover:bg-surface border-l-2 border-transparent hover:border-primary font-medium"><Wallet size={18} /> Payouts</Link></li>
            <li><Link href="/admin/refunds" className="flex items-center gap-3 px-4 py-3 text-charcoal hover:bg-surface border-l-2 border-transparent hover:border-primary font-medium"><RotateCcw size={18} /> Refunds</Link></li>
            <li><Link href="/admin/roles" className="flex items-center gap-3 px-4 py-3 text-charcoal hover:bg-surface border-l-2 border-transparent hover:border-primary font-medium"><Shield size={18} /> Admin Roles</Link></li>
            <li><Link href="/admin/audit" className="flex items-center gap-3 px-4 py-3 text-charcoal hover:bg-surface border-l-2 border-transparent hover:border-primary font-medium"><ShieldAlert size={18} /> Audit Log</Link></li>
            <li className="border-t border-border mt-2 pt-2"><Link href="/admin/studio" className="flex items-center gap-3 px-4 py-3 text-primary hover:bg-primary/5 border-l-2 border-transparent hover:border-primary font-bold"><ImageIcon size={18} /> Storefront Studio</Link></li>
            <li className="pl-8"><Link href="/admin/collections" className="flex items-center gap-3 px-4 py-2 text-charcoal hover:bg-surface text-sm"><FolderTree size={16} /> Collections</Link></li>
            <li className="pl-8"><Link href="/admin/campaigns" className="flex items-center gap-3 px-4 py-2 text-charcoal hover:bg-surface text-sm"><Megaphone size={16} /> Campaigns</Link></li>
          </ul>
          <div className="border-t border-border p-2"><Link href="/" className="flex items-center gap-2 px-3 py-2 text-xs text-muted hover:text-primary rounded hover:bg-surface"><ArrowLeft size={14} /> Back to Storefront</Link></div>
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}