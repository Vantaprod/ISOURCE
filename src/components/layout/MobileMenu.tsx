"use client";
import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div className={`fixed inset-0 z-50 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <aside className={`absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`} role="dialog" aria-modal="true" aria-label="Main menu">
        <div className="flex items-center justify-between border-b border-border px-4 py-3"><span className="font-bold text-primary text-lg">Isource</span><button onClick={onClose} className="p-2 text-charcoal" aria-label="Close menu">✕</button></div>
        <nav className="px-2 py-2"><p className="px-3 py-2 text-xs uppercase tracking-wide text-muted">Shop categories</p><ul>{CATEGORIES.map((c) => (<li key={c.slug}><Link href={`/category/${c.slug}`} onClick={onClose} className="block rounded px-3 py-2 text-sm text-charcoal hover:bg-surface">{c.name}</Link></li>))}</ul></nav>
      </aside>
    </div>
  );
}