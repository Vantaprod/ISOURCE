"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, Search, ShoppingCart, Heart, User, LogOut } from "lucide-react";
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
  const { itemCount } = useCart();
  const { count: wishCount } = useWishlist();
  const router = useRouter();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <>
      <AnnouncementBar />
      <header className="bg-white border-b border-border">
        <div className="mx-auto max-w-[1440px] px-4">
          <div className="flex items-center gap-4 py-3">
            <button className="md:hidden p-2 -ml-2" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
            <Link href="/" className="flex-shrink-0 font-extrabold text-2xl tracking-tight leading-none"><span className="text-primary">i</span><span className="text-charcoal">source</span></Link>
            
            <form onSubmit={submitSearch} role="search" className="hidden md:flex flex-1 max-w-2xl mx-auto">
              <div className="flex w-full items-center h-10 rounded-lg border border-border bg-surface overflow-hidden focus-within:border-primary transition-colors">
                <Search size={18} className="ml-3 text-muted flex-shrink-0" />
                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for products, brands and more…" className="h-full flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted" aria-label="Search products" />
                <button type="submit" aria-label="Search" className="flex h-8 w-8 flex-shrink-0 items-center justify-center m-1 rounded-md bg-primary text-white hover:bg-primary-hover"><Search size={16} /></button>
              </div>
            </form>

            <div className="ml-auto flex items-center gap-1 md:gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link href="/account" className="hidden lg:flex items-center gap-1.5 px-2 py-1 text-sm font-medium text-charcoal hover:text-primary">
                    <User size={18} /> Hi, {user.name.split(" ")[0]}
                  </Link>
                  <Link href="/account" className="lg:hidden flex items-center px-2 py-1 text-charcoal hover:text-primary" aria-label="Account">
                    <User size={20} />
                  </Link>
                  <form action={logoutAction}>
                    <button type="submit" className="hidden md:flex items-center gap-1.5 px-2 py-1 text-sm text-charcoal/70 hover:text-danger transition-colors" title="Log out">
                      <LogOut size={18} />
                    </button>
                  </form>
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-1.5 px-2 py-1 text-sm font-medium hover:text-primary">
                  <User size={20} /> <span className="hidden lg:inline">Login</span>
                </Link>
              )}
              
              <Link href="/wishlist" className="relative hidden md:flex items-center gap-2 px-2 py-1 text-sm hover:text-primary" aria-label="Wishlist">
                <Heart size={20} /><span className="hidden lg:inline">Wishlist</span>
                {wishCount > 0 && (<span className="absolute -top-1 -right-1 min-w-[18px] rounded-full bg-charcoal text-white text-[10px] leading-[18px] text-center font-bold px-1">{wishCount}</span>)}
              </Link>
              <Link href="/cart" className="relative flex items-center gap-2 px-2 py-1 text-sm hover:text-primary" aria-label="Cart">
                <ShoppingCart size={20} /><span className="hidden lg:inline">Cart</span>
                {itemCount > 0 && (<span className="absolute -top-1 -right-1 min-w-[18px] rounded-full bg-primary text-white text-[10px] leading-[18px] text-center font-bold px-1">{itemCount}</span>)}
              </Link>
            </div>
          </div>
          <form onSubmit={submitSearch} role="search" className="md:hidden pb-3">
            <div className="flex items-center h-10 rounded-lg border border-border bg-surface overflow-hidden focus-within:border-primary">
              <Search size={18} className="ml-3 text-muted" /><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" className="h-full flex-1 bg-transparent px-2 text-sm outline-none" aria-label="Search products" /><button type="submit" aria-label="Search" className="flex h-8 w-8 items-center justify-center m-1 rounded-md bg-primary text-white"><Search size={16} /></button>
            </div>
          </form>
        </div>
        <CategoryNav />
      </header>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}