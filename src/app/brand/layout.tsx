import Link from "next/link";
import { LayoutDashboard, Building2, Package, Users, UserCog, Megaphone, BarChart3, ShieldCheck, Settings, LifeBuoy, ArrowRight } from "lucide-react";

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:py-8 grid md:grid-cols-[260px_1fr] gap-6">
      <aside>
        <nav className="rounded-xl bg-charcoal text-white overflow-hidden sticky top-24">
          <div className="p-5 border-b border-white/10"><h2 className="font-extrabold text-lg">Brand Workspace</h2></div>
          <ul className="py-2 text-sm text-white/70">
            <li><Link href="/brand" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-primary bg-primary/20 text-white font-medium"><LayoutDashboard size={18} /> Dashboard</Link></li>
            <li><Link href="/brand/profile" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><Building2 size={18} /> Brand Profile</Link></li>
            <li><Link href="/brand/products" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><Package size={18} /> Products</Link></li>
            <li><Link href="/brand/sellers" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><Users size={18} /> Authorised Sellers</Link></li>
            <li><Link href="/brand/representatives" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><UserCog size={18} /> Representatives</Link></li>
            <li><Link href="/brand/campaigns" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><Megaphone size={18} /> Campaigns</Link></li>
            <li><Link href="/brand/analytics" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><BarChart3 size={18} /> Analytics</Link></li>
            <li><Link href="/brand/verification" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><ShieldCheck size={18} /> Verification</Link></li>
            <li><Link href="/brand/settings" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><Settings size={18} /> Settings</Link></li>
            <li><Link href="/contact" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><LifeBuoy size={18} /> Support</Link></li>
          </ul>
          <div className="p-4 mt-4">
            <div className="rounded-xl p-5 bg-gradient-to-br from-[#242424] to-[#1a1a1a] border border-white/10 relative overflow-hidden">
              <h3 className="font-bold text-white mb-1">Verified Brand</h3>
              <p className="text-xs text-white/60 mb-3">Your store is officially recognized by Isource.</p>
              <Link href={`/brand/profile`} className="inline-flex items-center gap-1 h-8 px-3 rounded bg-primary text-white text-xs font-bold">View Profile <ArrowRight size={12} /></Link>
            </div>
          </div>
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}