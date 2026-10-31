"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Menu, Search, ShoppingCart, Heart, User, LogOut, Store, Bell, ChevronDown, ShieldAlert, MessageSquare, Settings } from "lucide-react";
import { AnnouncementBar } from "./AnnouncementBar";
import { CategoryNav } from "./CategoryNav";
import { MobileMenu } from "./MobileMenu";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { logoutAction } from "@/app/actions/auth";
import type { SessionPayload } from "@/lib/session";

export function Header({ user }: { user: SessionPayload | null }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [, startTransition] = useTransition();
  const { itemCount } = useCart();
  const { count: wishCount } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = pathname?.startsWith("/admin");
  const hideStorefrontNav = isAdmin || pathname?.startsWith("/vendor") || pathname?.startsWith("/account") || pathname === "/cart" || pathname?.startsWith("/checkout");

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <>
      {!isAdmin && <AnnouncementBar />}
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="mx-auto max-w-[1440px] px-4">
          <div className="flex items-center gap-4 md:gap-6 py-3">
            <button className="md:hidden p-2 -ml-2" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>

            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image 
                src="/images/logo-black.png" 
                alt="Isource" 
                width={140} 
                height={48} 
                className="h-10 w-auto object-contain" 
                priority
              />
            </Link>

            {isAdmin ? (
              <form role="search" className="hidden md:flex flex-1 max-w-2xl mx-auto">
                <div className="flex w-full items-center h-10 rounded-lg border border-border bg-surface overflow-hidden focus-within:border-primary transition-all">
                  <Search size={18} className="ml-4 text-muted flex-shrink-0" />
                  <input type="search" placeholder="Search users, vendors, brands, products, orders..." className="h-full flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted" />
                </div>
              </form>
            ) : (
              <form onSubmit={submitSearch} role="search" className="hidden md:flex flex-1 max-w-3xl mx-auto">
                <div className="flex w-full items-center h-10 rounded-lg border border-border bg-surface overflow-hidden focus-within:border-primary transition-all">
                  <Search size={18} className="ml-4 text-muted flex-shrink-0" />
                  <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for products, brands, orders and more..." className="h-full flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted" />
                  <button type="submit" className="flex h-8 w-8 flex-shrink-0 items-center justify-center m-1 rounded-md bg-primary text-white hover:bg-primary-hover"><Search size={16} /></button>
                </div>
              </form>
            )}

            <div className="ml-auto flex items-center gap-2 md:gap-4">
              {isAdmin ? (
                <div className="flex items-center gap-4">
                  <button className="text-charcoal/70 hover:text-primary relative"><Bell size={20} /><span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-danger border border-white" /></button>
                  <button className="text-charcoal/70 hover:text-primary"><MessageSquare size={20} /></button>
                  <button className="text-charcoal/70 hover:text-primary"><Settings size={20} /></button>
                  <div className="border-l border-border pl-4 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">GO</div>
                    <div className="hidden lg:block"><p className="text-xs font-bold text-charcoal">Grace Okafar</p><p className="text-[10px] text-muted">Super Admin</p></div>
                    <ChevronDown size={14} className="text-muted" />
                  </div>
                </div>
              ) : (
                <>
                  {user ? (
                    <div className="relative">
                      <button onClick={() => setShowMenu(!showMenu)} className="flex items-center gap-2 px-2 py-1 text-sm hover:text-primary">
                        <User size={20} /><span className="hidden lg:inline">{user.name.split(" ")[0]}</span><ChevronDown size={14} className="hidden lg:inline text-muted" />
                      </button>
                      {showMenu && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                          <div className="absolute right-0 top-full mt-1 w-56 rounded-lg border border-border bg-white shadow-lg py-2 z-50">
                            <Link href="/account" className="block px-4 py-2 text-sm text-charcoal hover:bg-surface">My Account</Link>
                            {user.role === "ADMIN" && <Link href="/admin" className="block px-4 py-2 text-sm text-charcoal hover:bg-surface"><ShieldAlert size={14} className="inline mr-1" /> Admin Panel</Link>}
                            {user.role === "VENDOR" && <Link href="/vendor" className="block px-4 py-2 text-sm text-charcoal hover:bg-surface"><Store size={14} className="inline mr-1" /> Vendor Portal</Link>}
                            <button onClick={() => startTransition(async () => { await logoutAction(); })} className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/5 flex items-center gap-2"><LogOut size={14} /> Log out</button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <Link href="/login" className="flex items-center gap-1.5 px-2 py-1 text-sm font-medium hover:text-primary"><User size={20} /><span className="hidden lg:inline">Sign In</span></Link>
                  )}
                  <Link href="/wishlist" className="relative flex items-center gap-2 px-2 py-1 text-sm hover:text-primary"><Heart size={20} />{wishCount > 0 && <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-charcoal text-white text-[10px] flex items-center justify-center font-bold px-1">{wishCount}</span>}</Link>
                  <Link href="/cart" className="relative flex items-center gap-2 px-2 py-1 text-sm hover:text-primary"><ShoppingCart size={20} />{itemCount > 0 && <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold px-1">{itemCount}</span>}</Link>
                </>
              )}
            </div>
          </div>
        </div>
        {!hideStorefrontNav && <CategoryNav />}
      </header>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}