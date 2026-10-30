"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatNairaShort, discountPercent } from "@/lib/format";
import type { ProductWithVendor } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { useEffect, useRef } from "react";

export function ProductCard({ product }: { product: ProductWithVendor }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const inStock = product.stock > 0;
  const isFlash = product.tags.includes("flash-deal");
  const isSaved = has(product.id);
  const discount = discountPercent(product.priceKobo, product.originalPriceKobo);
  const trackedRef = useRef(false);

  // Fire sponsored impression once
  useEffect(() => {
    if (product.isSponsored && product.sponsoredCampaignId && !trackedRef.current) {
      trackedRef.current = true;
      fetch("/api/sponsored/impression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId: product.sponsoredCampaignId }),
      }).catch(() => {});
    }
  }, [product.isSponsored, product.sponsoredCampaignId]);

  function trackClick() {
    if (product.isSponsored && product.sponsoredCampaignId) {
      fetch("/api/sponsored/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId: product.sponsoredCampaignId }),
      }).catch(() => {});
    }
  }

  return (
    <div className="group flex flex-col rounded-lg border border-border bg-white overflow-hidden hover:shadow-md hover:border-primary/50 transition-all">
      <div className="relative">
        <Link href={`/product/${product.slug}`} onClick={trackClick} className="relative block aspect-square bg-surface p-4">
          <Image src={product.images[0]} alt={product.name} fill sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 50vw" className="object-contain transition-transform group-hover:scale-105" />
          {product.isSponsored && (
            <span className="absolute top-2 left-2 bg-charcoal/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">Sponsored</span>
          )}
          {isFlash && discount && !product.isSponsored && (
            <span className="absolute top-2 left-2 bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded">-{discount}%</span>
          )}
        </Link>
        <button onClick={() => toggle(product.id)} className={cn("absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center bg-white/90 border shadow-sm transition-colors", isSaved ? "text-danger border-danger" : "text-muted border-border hover:text-danger hover:border-danger")}>
          <Heart size={14} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <Link href={`/product/${product.slug}`} onClick={trackClick} className="text-[13px] text-charcoal line-clamp-2 min-h-[2.4rem] leading-snug hover:text-primary mb-1">{product.name}</Link>
        <div className="flex items-center gap-1 text-[11px] mb-1">
          <div className="flex text-warning"><Star size={10} fill="currentColor" /><span className="text-charcoal ml-1 font-medium">{product.rating.toFixed(1)}</span></div>
          <span className="text-muted">({product.reviewCount})</span>
        </div>
        <div className="flex flex-wrap items-baseline gap-2 mt-auto">
          <span className="font-bold text-charcoal text-sm md:text-base">{formatNairaShort(product.priceKobo)}</span>
          {product.originalPriceKobo && (<span className="text-muted text-xs line-through">{formatNairaShort(product.originalPriceKobo)}</span>)}
        </div>
        <p className="text-[10px] text-muted mt-1 mb-2 truncate">Sold by <span className="text-primary hover:underline">{product.vendor.name}</span></p>
        <button type="button" disabled={!inStock} onClick={() => add(product.id)} className="w-full h-8 mt-auto flex items-center justify-center gap-2 rounded border border-border text-charcoal text-xs font-medium hover:bg-surface hover:border-primary transition-colors disabled:opacity-50">
          <ShoppingCart size={14} /> {inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}