"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Menu, Search, ShoppingCart, Heart, User, LogOut, Store, Bell, ChevronDown, ShieldAlert } from "lucide-react";
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
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  const activeWorkspace = user?.workspaces.find(w => w.id === user.activeWorkspaceId);

  return (
    <>
      <AnnouncementBar />
      <header className="bg-white border-b border-border">
        <div className="mx-auto max-w-[1440px] px-4">
          <div className="flex items-center gap-4 md:gap-6 py-3">
            <button className="md:hidden p-2 -ml-2" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 font-extrabold text-2xl tracking-tight leading-none flex items-center">
              <span className="text-primary">i</span>
              <span className="text-charcoal">source</span>
            </Link>

            {/* Desktop Search */}
            <form onSubmit={submitSearch} role="search" className="hidden md:flex flex-1 max-w-3xl mx-auto">
              <div className="flex w-full items-center h-10 rounded-lg border border-border bg-surface overflow-hidden focus-within:border-primary transition-colors">
                <Search size={18} className="ml-4 text-muted flex-shrink-0" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for products, brands, orders and more..."
                  className="h-full flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted"
                  aria-label="Search products"
                />
                <button type="submit" className="flex h-7 w-7 flex-shrink-0 items-center justify-center mr-1.5 rounded-sm bg-primary text-white hover:bg-primary-hover" aria-label="Search">
                  <Search size={14} />
                </button>
              </div>
            </form>

            {/* Actions — Cart & Wishlist always visible */}
            <div className="ml-auto flex items-center gap-2 md:gap-4">
              {/* Account (signed in or sign in link) */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center gap-2 px-2 py-1 text-sm hover:text-primary"
                    aria-label="Account menu"
                  >
                    <User size={20} />
                    <span className="hidden lg:inline">{user.name.split(" ")[0]}</span>
                    <ChevronDown size={14} className="hidden lg:inline text-muted" />
                  </button>

                  {showMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                      <div className="absolute right-0 top-full mt-1 w-56 rounded-lg border border-border bg-white shadow-lg py-2 z-50">
                        <div className="px-4 py-2 border-b border-border">
                          <p className="text-xs font-bold text-charcoal truncate">{user.email}</p>
                          <p className="text-[10px] text-muted mt-0.5">{activeWorkspace?.name || "Customer"}</p>
                        </div>
                        <Link href="/account" onClick={() => setShowMenu(false)} className="block px-4 py-2 text-sm text-charcoal hover:bg-surface">My Account</Link>
                        {user.role === "ADMIN" && (
                          <Link href="/admin" onClick={() => setShowMenu(false)} className="block px-4 py-2 text-sm text-charcoal hover:bg-surface">
                            <ShieldAlert size={14} className="inline mr-1" /> Admin Panel
                          </Link>
                        )}
                        {user.role === "VENDOR" && (
                          <Link href="/vendor" onClick={() => setShowMenu(false)} className="block px-4 py-2 text-sm text-charcoal hover:bg-surface">
                            <Store size={14} className="inline mr-1" /> Vendor Portal
                          </Link>
                        )}
                        <div className="border-t border-border mt-2 pt-2">
                          <button
                            onClick={() => startTransition(async () => { await logoutAction(); })}
                            className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/5 flex items-center gap-2"
                          >
                            <LogOut size={14} /> Log out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-1.5 px-2 py-1 text-sm font-medium hover:text-primary">
                  <User size={20} />
                  <span className="hidden lg:inline">Sign In</span>
                </Link>
              )}

              {/* Wishlist — ALWAYS VISIBLE */}
              <Link href="/wishlist" className="relative flex items-center gap-2 px-2 py-1 text-sm hover:text-primary" aria-label="Wishlist">
                <Heart size={20} />
                <span className="hidden lg:inline">Wishlist</span>
                {wishCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-charcoal text-white text-[10px] flex items-center justify-center font-bold px-1">
                    {wishCount}
                  </span>
                )}
              </Link>

              {/* Cart — ALWAYS VISIBLE */}
              <Link href="/cart" className="relative flex items-center gap-2 px-2 py-1 text-sm hover:text-primary" aria-label="Cart">
                <ShoppingCart size={20} />
                <span className="hidden lg:inline">Cart</span>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold px-1">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Notifications bell — only if logged in */}
              {user && (
                <Link href="/account/notifications" className="relative hidden md:flex items-center px-1 py-1 hover:text-primary" aria-label="Notifications">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-danger border border-white" />
                </Link>
              )}
            </div>
          </div>

          {/* Mobile search */}
          <form onSubmit={submitSearch} role="search" className="md:hidden pb-3">
            <div className="flex items-center h-10 rounded-lg border border-border bg-surface overflow-hidden focus-within:border-primary">
              <Search size={18} className="ml-3 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
                className="h-full flex-1 bg-transparent px-2 text-sm outline-none"
                aria-label="Search products"
              />
              <button type="submit" className="flex h-8 w-8 items-center justify-center m-1 rounded-sm bg-primary text-white" aria-label="Search">
                <Search size={16} />
              </button>
            </div>
          </form>
        </div>
        <CategoryNav />
      </header>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}