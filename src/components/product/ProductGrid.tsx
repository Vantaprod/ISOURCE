import { ProductCard } from "./ProductCard";
import type { ProductWithVendor } from "@/lib/catalog";
export function ProductGrid({ products }: { products: ProductWithVendor[] }) {
  if (products.length === 0) return (<div className="rounded-lg border border-dashed border-border p-10 text-center"><p className="text-charcoal font-medium">No products found</p><p className="text-sm text-muted mt-1">Try a different search or category.</p></div>);
  return (<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">{products.map((p) => (<ProductCard key={p.id} product={p} />))}</div>);
}