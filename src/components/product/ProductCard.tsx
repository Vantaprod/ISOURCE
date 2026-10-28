"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import type { ProductWithVendor } from "@/lib/catalog";
export function ProductCard({ product }: { product: ProductWithVendor }) {
  const { add } = useCart(); const inStock = product.stock > 0; const isFlash = product.tags.includes("flash-deal");
  return (
    <div className="group flex flex-col rounded-lg border border-border bg-white overflow-hidden hover:border-primary/60 transition-colors">
      <Link href={`/product/${product.slug}`} className="relative block aspect-square bg-surface overflow-hidden">
        <Image src={product.images[0]} alt={product.name} fill sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 50vw" className="object-contain p-2" />
        {isFlash && <span className="absolute top-2 left-2"><Badge tone="danger">Flash</Badge></span>}
        {!inStock && <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-semibold text-charcoal">Out of stock</span>}
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link href={`/product/${product.slug}`} className="text-[13px] md:text-sm text-charcoal line-clamp-2 min-h-[2.4rem] leading-snug hover:text-primary">{product.name}</Link>
        <p className="text-[11px] md:text-xs text-muted line-clamp-1">{product.specs[0]?.value ?? `Sold by ${product.vendor.name}`}</p>
        <Price priceKobo={product.priceKobo} originalKobo={product.originalPriceKobo} size="md" />
        <button type="button" disabled={!inStock} onClick={() => add(product.id)} className="mt-2 h-9 rounded-md bg-primary text-white text-xs md:text-sm font-semibold hover:bg-primary-hover disabled:bg-border disabled:text-muted disabled:cursor-not-allowed transition-colors">{inStock ? "Add to Cart" : "Out of stock"}</button>
      </div>
    </div>
  );
}