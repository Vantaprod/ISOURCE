"use client";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatNairaShort } from "@/lib/format";
import { useMemo } from "react";
import type { ProductWithVendor } from "@/lib/catalog";

export function WishlistClient({ allProducts }: { allProducts: ProductWithVendor[] }) {
  const { ids, ready, remove } = useWishlist();
  const { add } = useCart();
  const items = useMemo(() => ids.flatMap((id) => { const p = allProducts.find((x) => x.id === id); return p ? [p] : []; }), [ids, allProducts]);

  if (!ready) return <div className="mx-auto max-w-[1440px] px-4 py-16 text-sm text-muted">Loading wishlist…</div>;

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Your wishlist</h1>
      {items.length === 0 ? (<div className="rounded-lg border border-dashed border-border p-10 text-center"><p className="text-charcoal font-medium">Your wishlist is empty</p><p className="text-sm text-muted mt-1">Save products you love to view them here.</p><Link href="/" className="inline-block mt-4 h-10 px-4 leading-10 rounded bg-primary text-white text-sm font-medium">Continue shopping</Link></div>) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">{items.map((p) => (<li key={p.id} className="rounded-lg border border-border bg-white overflow-hidden flex flex-col"><Link href={`/product/${p.slug}`} className="relative block aspect-square bg-surface"><Image src={p.images[0]} alt={p.name} fill sizes="25vw" className="object-contain p-2" /></Link><div className="p-3 flex flex-col gap-2"><Link href={`/product/${p.slug}`} className="text-sm line-clamp-2 min-h-[2.4rem] text-charcoal hover:text-primary">{p.name}</Link><p className="text-sm font-semibold">{formatNairaShort(p.priceKobo)}</p><div className="flex gap-2 mt-1"><button onClick={() => add(p.id)} className="flex-1 h-9 rounded bg-primary text-white text-xs font-semibold hover:bg-primary-hover inline-flex items-center justify-center gap-1"><ShoppingCart size={14} /> Add</button><button onClick={() => remove(p.id)} aria-label="Remove from wishlist" className="h-9 w-9 rounded border border-border text-danger hover:bg-danger/10 inline-flex items-center justify-center"><Trash2 size={14} /></button></div></div></li>))}</ul>
      )}
    </div>
  );
}