"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { PRODUCTS } from "@/data/products";
import { formatNairaShort } from "@/lib/format";
import { useMemo } from "react";
export default function CartPage() {
  const { lines, ready, setQty, remove } = useCart();
  const detailed = useMemo(() => { return lines.flatMap((line) => { const product = PRODUCTS.find((p) => p.id === line.productId); if (!product) return []; const variant = line.variantId ? product.variants?.find((v) => v.id === line.variantId) : undefined; const unitKobo = variant?.priceKobo ?? product.priceKobo; const stock = variant?.stock ?? product.stock; return [{ key: `${line.productId}::${line.variantId ?? "base"}`, productId: line.productId, variantId: line.variantId, qty: line.qty, product, variantLabel: variant?.label, unitKobo, stock, lineTotalKobo: unitKobo * line.qty }]; }); }, [lines]);
  const subtotalKobo = detailed.reduce((s, l) => s + l.lineTotalKobo, 0); const deliveryKobo = subtotalKobo > 5000000 ? 0 : 250000; const totalKobo = subtotalKobo + deliveryKobo;
  if (!ready) return <div className="mx-auto max-w-[1440px] px-4 py-16 text-sm text-muted">Loading cart…</div>;
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Your cart</h1>
      {detailed.length === 0 ? (<div className="rounded-lg border border-dashed border-border p-10 text-center"><p className="text-charcoal font-medium">Your cart is empty</p><p className="text-sm text-muted mt-1">Browse products and start shopping.</p><Link href="/" className="inline-block mt-4 h-10 px-4 leading-10 rounded bg-primary text-white text-sm font-medium">Continue shopping</Link></div>) : (
        <div className="grid md:grid-cols-[1fr_320px] gap-6">
          <ul className="divide-y divide-border rounded-lg border border-border">{detailed.map((l) => (<li key={l.key} className="flex gap-3 p-4"><div className="relative w-24 h-24 rounded bg-surface overflow-hidden flex-shrink-0"><Image src={l.product.images[0]} alt={l.product.name} fill sizes="96px" className="object-cover" /></div><div className="flex-1 min-w-0"><Link href={`/product/${l.product.slug}`} className="text-sm font-medium text-charcoal hover:text-primary line-clamp-2">{l.product.name}</Link>{l.variantLabel && <p className="text-xs text-muted mt-0.5">{l.variantLabel}</p>}<p className="text-sm font-semibold mt-1">{formatNairaShort(l.unitKobo)}</p><div className="mt-2 flex items-center gap-3"><div className="flex items-center rounded border border-border"><button onClick={() => setQty(l.productId, l.qty - 1, l.variantId)} className="px-2 h-8 text-sm">−</button><span className="w-8 text-center text-sm">{l.qty}</span><button onClick={() => setQty(l.productId, Math.min(l.stock, l.qty + 1), l.variantId)} disabled={l.qty >= l.stock} className="px-2 h-8 text-sm disabled:opacity-40">+</button></div><button onClick={() => remove(l.productId, l.variantId)} className="text-xs text-danger hover:underline">Remove</button></div>{l.qty > l.stock && (<p className="text-xs text-danger mt-1">Only {l.stock} available</p>)}</div><div className="text-sm font-semibold text-charcoal text-right whitespace-nowrap">{formatNairaShort(l.lineTotalKobo)}</div></li>))}</ul>
          <aside className="rounded-lg border border-border p-4 h-fit md:sticky md:top-24"><h2 className="font-semibold mb-3">Order summary</h2><dl className="space-y-2 text-sm"><div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatNairaShort(subtotalKobo)}</dd></div><div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{deliveryKobo === 0 ? "Free" : formatNairaShort(deliveryKobo)}</dd></div><div className="flex justify-between border-t border-border pt-2 mt-2 font-semibold"><dt>Total</dt><dd>{formatNairaShort(totalKobo)}</dd></div></dl><Link href="/checkout" className="mt-4 block h-11 leading-[44px] text-center rounded bg-primary text-white text-sm font-semibold hover:bg-primary-hover">Proceed to checkout</Link><Link href="/" className="mt-2 block text-center text-xs text-muted hover:text-primary">Continue shopping</Link><p className="mt-3 text-xs text-muted">Checkout is next phase. Prices and stock will be re-validated on the server before payment.</p></aside>
        </div>
      )}
    </div>
  );
}