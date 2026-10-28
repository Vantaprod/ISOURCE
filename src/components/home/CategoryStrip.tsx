import Link from "next/link";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
export function CategoryStrip() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-6 md:py-8"><div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 md:gap-3">
      {CATEGORIES.map((c) => { const Icon = (Icons as unknown as Record<string, LucideIcon>)[c.icon] ?? Icons.ShoppingBag; return (
        <Link key={c.slug} href={`/category/${c.slug}`} className="group flex flex-col items-center justify-start gap-2 rounded-lg border border-border bg-white px-2 py-4 text-center hover:border-primary hover:shadow-sm transition">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors"><Icon size={22} strokeWidth={1.75} /></span>
          <span className="text-[11px] md:text-xs font-medium text-charcoal leading-tight">{c.name}</span>
        </Link>
      ); })}
    </div></section>
  );
}