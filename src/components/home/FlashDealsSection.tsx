import Link from "next/link";
import { Countdown } from "@/components/ui/Countdown";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductWithVendor } from "@/lib/catalog";

// Custom Premium Flash Icon
const FlashIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#F07824" stroke="#242424" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="url(#paint0_linear)" fillOpacity="0.3"/>
    <defs>
      <linearGradient id="paint0_linear" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F07824"/>
        <stop offset="1" stopColor="#FFC107"/>
      </linearGradient>
    </defs>
  </svg>
);

export function FlashDealsSection({ products }: { products: ProductWithVendor[] }) {
  if (products.length === 0) return null;
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-charcoal">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shadow-sm border border-primary/20">
              <FlashIcon />
            </span>
            Flash Deals
          </h2>
          <Countdown />
        </div>
        <Link href="/search?q=flash" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">See All <span aria-hidden="true">&rarr;</span></Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.slice(0, 5).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}