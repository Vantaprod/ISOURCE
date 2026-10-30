import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Heart, MapPin, Star, RotateCcw, User, Bell, HelpCircle, Sun } from "lucide-react";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:py-8 grid md:grid-cols-[260px_1fr] gap-6">
      <aside className="md:sticky md:top-24 h-fit">
        <nav className="rounded-xl bg-charcoal text-white overflow-hidden">
          <div className="p-5 border-b border-white/10">
            <h2 className="font-extrabold text-lg tracking-wide">My Account</h2>
          </div>
          <ul className="py-2 text-sm text-white/70">
            <li><Link href="/account" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-primary bg-primary/20 text-white font-medium"><LayoutDashboard size={18} /> Dashboard</Link></li>
            <li><Link href="/account/orders" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><ShoppingBag size={18} /> My Orders</Link></li>
            <li><Link href="/wishlist" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><Heart size={18} /> Wishlist</Link></li>
            <li><Link href="/account/addresses" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><MapPin size={18} /> Addresses</Link></li>
            <li><Link href="/account/reviews" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><Star size={18} /> Reviews</Link></li>
            <li><Link href="/account/refunds" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><RotateCcw size={18} /> Returns & Refunds</Link></li>
            <li><Link href="/account/profile" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><User size={18} /> Profile</Link></li>
            <li><Link href="/account/notifications" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><Bell size={18} /> Notifications</Link></li>
            <li><Link href="/help" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 hover:text-white border-l-4 border-transparent"><HelpCircle size={18} /> Help & Support</Link></li>
          </ul>
          <div className="p-4 mt-4">
            <div className="rounded-xl overflow-hidden relative p-5 bg-gradient-to-br from-primary to-orange-600">
              <Sun size={40} className="absolute top-2 right-2 text-white/20" />
              <h3 className="font-bold text-white mb-1">Powering a Brighter Tomorrow</h3>
              <p className="text-xs text-white/80 mb-4">Quality solar solutions for your home and business.</p>
              <Link href="/category/solar-power" className="inline-block h-8 leading-8 px-4 rounded bg-white text-primary text-xs font-bold">Shop Solar</Link>
            </div>
          </div>
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}