import Link from "next/link";
import { Zap } from "lucide-react";
import { Countdown } from "@/components/ui/Countdown";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductWithVendor } from "@/lib/catalog";
export function FlashDealsSection({ products }: { products: ProductWithVendor[] }) {
  if (products.length === 0) return null;
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-6 md:py-8">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-3 flex-wrap"><h2 className="flex items-center gap-2 text-lg md:text-xl font-bold text-charcoal"><Zap size={20} className="text-primary" fill="currentColor" />Flash Deals</h2><Countdown /></div>
        <Link href="/category/electronics" className="text-sm font-medium text-primary hover:underline">View All →</Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">{products.slice(0, 5).map((p) => (<ProductCard key={p.id} product={p} />))}</div>
    </section>
  );
}