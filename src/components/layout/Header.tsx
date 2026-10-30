"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Menu, Search, ShoppingCart, Heart, User, LogOut, Store, Bell, ChevronDown } from "lucide-react";
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

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim(); if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  const activeWorkspace = user?.workspaces.find(w => w.id === user.activeWorkspaceId);

  return (
    <>
      <AnnouncementBar />
      <header className="bg-white border-b border-border">
        <div className="mx-auto max-w-[1440px] px-4">
          <div className="flex items-center gap-6 py-3">
            <button className="md:hidden p-2 -ml-2" onClick={() => setMobileOpen(true)}><Menu size={22} /></button>
            <Link href="/" className="flex-shrink-0 font-extrabold text-2xl tracking-tight leading-none"><span className="text-primary">i</span><span className="text-charcoal">source</span></Link>
            
            <form onSubmit={submitSearch} role="search" className="hidden md:flex flex-1 max-w-3xl mx-auto">
              <div className="flex w-full items-center h-10 rounded-lg border border-border bg-surface overflow-hidden focus-within:border-primary transition-colors">
                <Search size={18} className="ml-4 text-muted flex-shrink-0" />
                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for products, brands, orders and more..." className="h-full flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted" />
                <button type="submit" className="flex h-7 w-7 flex-shrink-0 items-center justify-center mr-1.5 rounded-sm bg-primary text-white hover:bg-primary-hover"><Search size={14} /></button>
              </div>
            </form>

            <div className="ml-auto flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4 relative">
                  {activeWorkspace?.type !== "CUSTOMER" && (
                    <Link href={activeWorkspace?.type === "VENDOR" ? "/vendor" : "/brand"} className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      <Store size={14} /> {activeWorkspace?.type}
                    </Link>
                  )}
                  
                  <Link href="/account/notifications" className="relative hidden md:block" title="Notifications">
                    <Bell size={20} className="text-charcoal/70" />
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-danger border border-white" />
                  </Link>

                  <Link href="/wishlist" className="relative hidden md:block"><Heart size={20} /><span className="absolute -top-1 -right-1 text-[10px] font-bold bg-charcoal text-white px-1 rounded-full">{wishCount}</span></Link>
                  <Link href="/cart" className="relative hidden md:block"><ShoppingCart size={20} /><span className="absolute -top-1 -right-1 text-[10px] font-bold bg-primary text-white px-1 rounded-full">{itemCount}</span></Link>
                  
                  <div className="relative">
                    <button onClick={() => setShowMenu(!showMenu)} className="flex items-center gap-2 border-l border-border pl-4">
                      <div className="h-8 w-8 rounded-full bg-surface border border-border flex items-center justify-center overflow-hidden"><User size={16} /></div>
                      <div className="hidden lg:block text-left">
                        <p className="text-xs font-bold text-charcoal">{user.name}</p>
                        <p className="text-[10px] text-muted">{activeWorkspace?.name || "Customer"}</p>
                      </div>
                      <ChevronDown size={14} className="text-muted" />
                    </button>
                    
                    {showMenu && (
                      <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-white shadow-lg py-2 z-50">
                        <div className="px-4 py-2 border-b border-border mb-2">
                          <p className="text-xs font-bold text-charcoal">Switch Workspace</p>
                        </div>
                        {user.workspaces.map(w => (
                          <button key={w.id} className="w-full text-left px-4 py-2 text-sm hover:bg-surface flex items-center justify-between">
                            {w.name} <span className="text-[10px] uppercase text-muted">{w.type}</span>
                          </button>
                        ))}
                        <div className="border-t border-border mt-2 pt-2">
                          <button onClick={() => startTransition(async () => { await logoutAction(); })} className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/5 flex items-center gap-2">
                            <LogOut size={14} /> Log out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-2 text-sm font-medium hover:text-primary"><User size={20} /> Sign In</Link>
              )}
            </div>
          </div>
        </div>
        <CategoryNav />
      </header>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}