import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelated, getAllProducts } from "@/lib/catalog";
import { getCategory } from "@/data/categories";
import { Price } from "@/components/ui/Price";
import { Badge } from "@/components/ui/Badge";
import { AddToCart } from "./AddToCart";
interface Props { params: Promise<{ slug: string }>; }
export async function generateStaticParams() { return getAllProducts().map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const product = getProductBySlug(slug); if (!product) return {}; return { title: product.name, description: product.shortDescription }; }
export default async function ProductPage({ params }: Props) {
  const { slug } = await params; const product = getProductBySlug(slug); if (!product) notFound(); const cat = getCategory(product.category); const related = getRelated(product, 4);
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:py-8">
      <nav className="text-xs text-muted mb-4"><Link href="/" className="hover:text-primary">Home</Link><span className="mx-1">/</span>{cat && <Link href={`/category/${cat.slug}`} className="hover:text-primary">{cat.name}</Link>}<span className="mx-1">/</span><span className="text-charcoal line-clamp-1 inline">{product.name}</span></nav>
      <div className="grid gap-6 md:gap-10 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface overflow-hidden"><div className="relative aspect-square"><Image src={product.images[0]} alt={product.name} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" priority /></div></div>
        <div>
          {product.tags.includes("flash-deal") && <Badge tone="danger">Flash deal</Badge>}
          <h1 className="mt-2 text-2xl md:text-3xl font-bold leading-tight">{product.name}</h1>
          <p className="text-sm text-muted mt-2">{product.shortDescription}</p>
          <p className="text-xs text-muted mt-2">Sold by <span className="text-charcoal font-medium">{product.vendor.name}</span>{product.vendor.isIsource && <span className="ml-1 text-primary">· Isource Official</span>}</p>
          <div className="mt-4"><Price priceKobo={product.priceKobo} originalKobo={product.originalPriceKobo} size="lg" /></div>
          <div className="mt-2 text-sm">{product.stock > 0 ? (<span className="text-success">In stock ({product.stock} available)</span>) : (<span className="text-danger">Out of stock</span>)}</div>
          <AddToCart productId={product.id} disabled={product.stock <= 0} variants={product.variants} />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 text-sm"><div className="rounded-md border border-border p-3"><p className="font-semibold mb-1">Delivery</p><p className="text-muted">Lagos, Abuja &amp; PH: 1–3 working days. Other states: 3–7 days.</p></div><div className="rounded-md border border-border p-3"><p className="font-semibold mb-1">Returns</p><p className="text-muted">7-day return window for eligible items. See return policy.</p></div></div>
        </div>
      </div>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <section><h2 className="text-lg font-bold mb-2">Description</h2><p className="text-sm leading-relaxed text-charcoal/90">{product.description}</p></section>
        <section><h2 className="text-lg font-bold mb-2">Specifications</h2><dl className="divide-y divide-border rounded border border-border">{product.specs.map((s) => (<div key={s.label} className="grid grid-cols-2 gap-4 px-3 py-2 text-sm"><dt className="text-muted">{s.label}</dt><dd className="text-charcoal">{s.value}</dd></div>))}<div className="grid grid-cols-2 gap-4 px-3 py-2 text-sm"><dt className="text-muted">SKU</dt><dd className="text-charcoal">{product.sku}</dd></div></dl></section>
      </div>
      <section className="mt-10"><h2 className="text-lg font-bold mb-3">Reviews</h2>{product.reviews.length === 0 ? (<div className="rounded border border-dashed border-border p-6 text-sm text-muted">No reviews yet. Be the first to review this product after purchase.</div>) : (<ul className="space-y-3">{product.reviews.map((r) => (<li key={r.id} className="rounded border border-border p-4"><div className="flex items-center justify-between"><p className="font-medium text-sm">{r.title}</p><span className="text-xs text-muted">{"★".repeat(r.rating)}</span></div><p className="text-sm text-charcoal/80 mt-1">{r.body}</p><p className="text-xs text-muted mt-2">— {r.author}</p></li>))}</ul>)}</section>
      {related.length > 0 && (<section className="mt-10"><h2 className="text-lg font-bold mb-3">Related products</h2><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">{related.map((p) => (<Link key={p.id} href={`/product/${p.slug}`} className="group rounded-lg border border-border bg-white overflow-hidden hover:border-primary"><div className="relative aspect-square bg-surface"><Image src={p.images[0]} alt={p.name} fill sizes="25vw" className="object-cover" /></div><div className="p-3"><p className="text-sm line-clamp-2 text-charcoal group-hover:text-primary min-h-[2.5rem]">{p.name}</p><p className="text-sm font-semibold mt-1">{new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(p.priceKobo / 100)}</p></div></Link>))}</div></section>)}
    </div>
  );
}