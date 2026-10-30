import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelated, getAllProducts } from "@/lib/catalog";
import { getCategory } from "@/data/categories";
import { Price } from "@/components/ui/Price";
import { Badge } from "@/components/ui/Badge";
import { AddToCart } from "./AddToCart";
import { ProductGallery } from "./ProductGallery";
import { ProductTabs } from "./ProductTabs";
import { WishlistButton } from "./WishlistButton";
import { ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import { formatNairaShort } from "@/lib/format";

interface Props { params: Promise<{ slug: string }>; }
export async function generateStaticParams() { return (await getAllProducts()).map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const product = await getProductBySlug(slug); if (!product) return {}; return { title: product.name, description: product.shortDescription }; }

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const cat = getCategory(product.category);
  const related = await getRelated(product, 4);
  
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name, image: product.images, description: product.shortDescription, sku: product.sku,
            brand: { "@type": "Brand", name: product.vendor.name },
            offers: {
              "@type": "Offer", url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`,
              priceCurrency: "NGN", price: (product.priceKobo / 100).toFixed(2),
              availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              seller: { "@type": "Organization", name: product.vendor.name },
            }
          }),
        }}
      />

      <nav className="text-xs text-muted mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
        {cat && <><Link href={`/category/${cat.slug}`} className="hover:text-primary">{cat.name}</Link><span>/</span></>}
        <span className="text-charcoal font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr_320px]">
        {/* Gallery */}
        <ProductGallery images={product.images} name={product.name} />

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {product.tags.includes("flash-deal") && <Badge tone="danger">Flash deal</Badge>}
            {product.tags.includes("best-seller") && <Badge tone="warning">Best seller</Badge>}
            {product.tags.includes("new") && <Badge tone="success">New</Badge>}
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold leading-tight text-charcoal">{product.name}</h1>
          
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center text-warning">
              <span className="text-lg">{"★".repeat(Math.round(product.rating))}</span>
              <span className="text-border text-lg">{"★".repeat(5 - Math.round(product.rating))}</span>
            </div>
            <span className="text-sm text-muted font-medium">{product.rating.toFixed(1)} ({product.reviewCount} reviews)</span>
          </div>

          <p className="text-sm text-charcoal/70 mt-4">{product.shortDescription}</p>
          
          <div className="mt-6 py-4 border-y border-border">
            <Price priceKobo={product.priceKobo} originalKobo={product.originalPriceKobo} size="lg" />
            <div className="mt-2 text-sm font-medium">
              {product.stock > 0 ? <span className="text-success">In stock ({product.stock} available)</span> : <span className="text-danger">Out of stock</span>}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-muted mb-1">Sold by</p>
            <Link href={`/search?q=${product.vendor.name}`} className="font-semibold text-primary hover:underline text-sm flex items-center gap-1">
              {product.vendor.name} {product.vendor.isIsource && <Badge tone="primary" className="ml-1">Official</Badge>}
            </Link>
          </div>

          <div className="mt-6 flex gap-3">
            <div className="flex-1"><AddToCart productId={product.id} disabled={product.stock <= 0} variants={product.variants} /></div>
            <WishlistButton productId={product.id} />
          </div>

          {/* Trust Badges */}
          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            <div className="flex flex-col items-center gap-2 rounded-lg bg-surface p-3"><ShieldCheck size={20} className="text-primary" /><span className="text-[10px] font-medium text-charcoal">Secure Payment</span></div>
            <div className="flex flex-col items-center gap-2 rounded-lg bg-surface p-3"><Truck size={20} className="text-primary" /><span className="text-[10px] font-medium text-charcoal">Fast Delivery</span></div>
            <div className="flex flex-col items-center gap-2 rounded-lg bg-surface p-3"><RefreshCcw size={20} className="text-primary" /><span className="text-[10px] font-medium text-charcoal">7-Day Returns</span></div>
          </div>
        </div>

        {/* Similar Products Sidebar */}
        <aside className="hidden lg:block">
          <div className="rounded-xl border border-border bg-white p-4 sticky top-24">
            <h2 className="text-sm font-bold mb-4">Similar Products</h2>
            {related.length === 0 ? <p className="text-xs text-muted">No similar products.</p> : (
              <ul className="space-y-4">{related.map((p) => (<li key={p.id}><Link href={`/product/${p.slug}`} className="flex gap-3 items-start group"><div className="relative w-16 h-16 rounded border border-border bg-surface flex-shrink-0 p-1"><Image src={p.images[0]} alt={p.name} fill sizes="64px" className="object-contain" /></div><div className="min-w-0"><p className="text-xs line-clamp-2 font-medium text-charcoal group-hover:text-primary">{p.name}</p><p className="text-xs font-bold mt-1 text-charcoal">{formatNairaShort(p.priceKobo)}</p></div></Link></li>))}</ul>
            )}
          </div>
        </aside>
      </div>

      <ProductTabs description={product.description} specs={product.specs} sku={product.sku} reviews={product.reviews} />
    </div>
  );
}