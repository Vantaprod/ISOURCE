"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Heart, MapPin, Star, RotateCcw, User, Bell, HelpCircle } from "lucide-react";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/account", icon: LayoutDashboard },
  { label: "My Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Reviews", href: "/account/reviews", icon: Star },
  { label: "Returns & Refunds", href: "/account/refunds", icon: RotateCcw },
  { label: "Profile", href: "/account/profile", icon: User },
  { label: "Notifications", href: "/account/notifications", icon: Bell },
  { label: "Help & Support", href: "/help", icon: HelpCircle },
];

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <nav className="rounded-xl bg-charcoal text-white overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-white/10">
        <h2 className="font-extrabold text-lg tracking-wide">My Account</h2>
      </div>
      <ul className="py-2 text-sm text-white/70 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/account" && pathname.startsWith(item.href));
          
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-5 py-3 border-l-4 transition-colors",
                  isActive
                    ? "border-primary bg-primary/20 text-white font-medium"
                    : "border-transparent hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="p-4 mt-4">
        {/* ADDED BACKGROUND IMAGE HERE */}
        <div 
          className="rounded-xl overflow-hidden relative p-5 bg-cover bg-center border border-white/10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop')" }}
        >
          {/* Dark overlay to make text readable */}
          <div className="absolute inset-0 bg-black/50" />
          
          <div className="relative z-10">
            <h3 className="font-bold text-white mb-1">Powering a Brighter Tomorrow</h3>
            <p className="text-xs text-white/80 mb-4">Quality solar solutions for your home and business.</p>
            <Link href="/category/solar-power" className="inline-block h-8 leading-8 px-4 rounded bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-colors">Shop Solar</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}