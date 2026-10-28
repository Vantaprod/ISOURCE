"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { ProductVariant } from "@/types/catalog";
export function AddToCart({ productId, disabled, variants }: { productId: string; disabled: boolean; variants?: ProductVariant[]; }) {
  const { add } = useCart(); const [qty, setQty] = useState(1); const [variantId, setVariantId] = useState<string | undefined>(variants?.[0]?.id); const [added, setAdded] = useState(false);
  function handleAdd() { if (disabled) return; add(productId, qty, variantId); setAdded(true); setTimeout(() => setAdded(false), 1500); }
  return (
    <div className="mt-6 space-y-3">
      {variants && variants.length > 0 && (<div><label htmlFor="variant" className="block text-sm font-medium mb-1">Variant</label><select id="variant" value={variantId} onChange={(e) => setVariantId(e.target.value)} className="h-10 w-full rounded border border-border px-2 text-sm bg-white">{variants.map((v) => (<option key={v.id} value={v.id}>{v.label}</option>))}</select></div>)}
      <div className="flex items-stretch gap-3">
        <div className="flex items-center rounded border border-border"><button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 h-10 text-lg hover:bg-surface" aria-label="Decrease quantity">−</button><input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className="w-12 h-10 text-center text-sm outline-none" aria-label="Quantity" /><button type="button" onClick={() => setQty((q) => q + 1)} className="px-3 h-10 text-lg hover:bg-surface" aria-label="Increase quantity">+</button></div>
        <button type="button" disabled={disabled} onClick={handleAdd} className="flex-1 h-10 rounded bg-primary text-white text-sm font-medium hover:bg-primary-hover disabled:bg-border disabled:text-muted disabled:cursor-not-allowed">{added ? "Added to cart ✓" : disabled ? "Out of stock" : "Add to cart"}</button>
      </div>
    </div>
  );
}