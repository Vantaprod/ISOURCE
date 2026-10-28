"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { User, Package, MapPin, Settings, Heart, AlertTriangle } from "lucide-react";
import { formatNairaShort } from "@/lib/format";
import type { OrderDraft } from "@/lib/checkout-schema";

type Tab = "profile" | "orders" | "addresses" | "settings";

export default function AccountPage() {
  const [tab, setTab] = useState<Tab>("profile");
  const [lastOrder, setLastOrder] = useState<OrderDraft | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("isource.order-draft.v1");
      if (raw) setLastOrder(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "profile", label: "Profile", icon: <User size={16} /> },
    { key: "orders", label: "Orders", icon: <Package size={16} /> },
    { key: "addresses", label: "Addresses", icon: <MapPin size={16} /> },
    { key: "settings", label: "Settings", icon: <Settings size={16} /> },
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">My Account</h1>

      <div className="rounded-md border border-warning/30 bg-warning/10 p-3 mb-6 text-xs text-charcoal flex gap-2">
        <AlertTriangle size={16} className="text-warning flex-shrink-0 mt-0.5" />
        <div><strong className="text-warning">Demo profile:</strong> Real account data (profile, orders, addresses) requires database and authentication configuration.</div>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-6">
        <aside>
          <nav className="rounded-lg border border-border bg-white overflow-hidden">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`w-full flex items-center gap-2 px-4 py-3 text-sm text-left border-l-2 transition-colors ${tab === t.key ? "border-primary bg-primary/5 text-primary font-semibold" : "border-transparent text-charcoal hover:bg-surface"}`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
            <div className="border-t border-border">
              <Link href="/wishlist" className="w-full flex items-center gap-2 px-4 py-3 text-sm text-left text-charcoal hover:bg-surface">
                <Heart size={16} /> Wishlist
              </Link>
              <button className="w-full flex items-center gap-2 px-4 py-3 text-sm text-left text-danger hover:bg-danger/5">
                Log out (demo)
              </button>
            </div>
          </nav>
        </aside>

        <main>
          {tab === "profile" && (
            <div className="rounded-lg border border-border bg-white p-4 md:p-6">
              <h2 className="font-semibold mb-4">Profile information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium mb-1 text-muted">First name</label><input type="text" defaultValue="Demo" className="h-10 w-full rounded border border-border px-3 text-sm bg-surface cursor-not-allowed" disabled /></div>
                <div><label className="block text-xs font-medium mb-1 text-muted">Last name</label><input type="text" defaultValue="User" className="h-10 w-full rounded border border-border px-3 text-sm bg-surface cursor-not-allowed" disabled /></div>
                <div className="sm:col-span-2"><label className="block text-xs font-medium mb-1 text-muted">Email</label><input type="email" defaultValue="demo@isource.ng" className="h-10 w-full rounded border border-border px-3 text-sm bg-surface cursor-not-allowed" disabled /></div>
                <div className="sm:col-span-2"><label className="block text-xs font-medium mb-1 text-muted">Phone</label><input type="tel" defaultValue="+234 800 000 0000" className="h-10 w-full rounded border border-border px-3 text-sm bg-surface cursor-not-allowed" disabled /></div>
              </div>
              <p className="mt-4 text-xs text-muted">Profile editing requires a connected database.</p>
            </div>
          )}

          {tab === "orders" && (
            <div className="space-y-3">
              <h2 className="font-semibold">Order history</h2>
              {!lastOrder ? (
                <div className="rounded-lg border border-dashed border-border p-10 text-center">
                  <Package className="mx-auto text-muted mb-3" size={32} />
                  <p className="text-charcoal font-medium">No orders yet</p>
                  <p className="text-sm text-muted mt-1">Orders placed through the demo checkout will appear here.</p>
                  <Link href="/" className="inline-block mt-4 h-10 px-4 leading-10 rounded bg-primary text-white text-sm font-medium hover:bg-primary-hover">Start shopping</Link>
                </div>
              ) : (
                <div className="rounded-lg border border-border bg-white overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div>
                      <p className="font-mono font-semibold text-charcoal text-sm">#{lastOrder.orderNumber}</p>
                      <p className="text-xs text-muted mt-0.5">{new Date(lastOrder.createdAt).toLocaleString("en-NG")}</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-warning/10 text-warning px-2.5 py-1 text-xs font-semibold">Not paid (demo)</span>
                  </div>
                  <ul className="divide-y divide-border">
                    {lastOrder.items.map((it, idx) => (
                      <li key={idx} className="flex items-center justify-between gap-3 p-3 text-sm">
                        <div className="min-w-0">
                          <p className="text-charcoal line-clamp-1">{it.name}</p>
                          <p className="text-xs text-muted">Qty {it.qty}{it.variantLabel ? ` · ${it.variantLabel}` : ""}</p>
                        </div>
                        <p className="font-semibold whitespace-nowrap">{formatNairaShort(it.lineTotalKobo)}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="p-4 border-t border-border flex items-center justify-between text-sm font-semibold bg-surface">
                    <span>Total</span>
                    <span>{formatNairaShort(lastOrder.totalKobo)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "addresses" && (
            <div className="space-y-3">
              <h2 className="font-semibold">Saved addresses</h2>
              <div className="rounded-lg border border-dashed border-border p-10 text-center">
                <MapPin className="mx-auto text-muted mb-3" size={32} />
                <p className="text-charcoal font-medium">No saved addresses</p>
                <p className="text-sm text-muted mt-1">Addresses are stored after your first order once the database is configured.</p>
              </div>
            </div>
          )}

          {tab === "settings" && (
            <div className="rounded-lg border border-border bg-white p-4 md:p-6 space-y-4">
              <h2 className="font-semibold">Account settings</h2>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <p className="text-sm font-medium text-charcoal">Email notifications</p>
                  <p className="text-xs text-muted">Order updates and promotions</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <p className="text-sm font-medium text-charcoal">Two-factor authentication</p>
                  <p className="text-xs text-muted">Requires configured auth backend</p>
                </div>
                <input type="checkbox" disabled className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal">Delete account</p>
                  <p className="text-xs text-muted">Permanently remove all data</p>
                </div>
                <button disabled className="h-8 px-3 rounded border border-danger text-danger text-xs font-semibold opacity-50 cursor-not-allowed">Delete</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}