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
import { formatNairaShort } from "@/lib/format";

interface Props { params: Promise<{ slug: string }>; }
export async function generateStaticParams() { return (await getAllProducts()).map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const product = await getProductBySlug(slug); if (!product) return {}; return { title: product.name, description: product.shortDescription }; }

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const cat = getCategory(product.category);
  const related = await getRelated(product, 5);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            image: product.images,
            description: product.shortDescription,
            sku: product.sku,
            brand: { "@type": "Brand", name: product.vendor.name },
            offers: {
              "@type": "Offer",
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`,
              priceCurrency: "NGN",
              price: (product.priceKobo / 100).toFixed(2),
              itemCondition: "https://schema.org/NewCondition",
              availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              seller: { "@type": "Organization", name: product.vendor.name },
            },
            ...(product.reviewCount > 0 && product.rating > 0 ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: product.rating,
                reviewCount: product.reviewCount,
              }
            } : {})
          }),
        }}
      />

      <nav className="text-xs text-muted mb-4">
        <Link href="/" className="hover:text-primary">Home</Link><span className="mx-1">/</span>
        {cat && <><Link href={`/category/${cat.slug}`} className="hover:text-primary">{cat.name}</Link><span className="mx-1">/</span></>}
        <span className="text-charcoal line-clamp-1 inline">{product.name}</span>
      </nav>
      <div className="grid gap-6 md:gap-8 lg:grid-cols-[1fr_1fr_280px]">
        <ProductGallery images={product.images} name={product.name} />
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {product.tags.includes("flash-deal") && <Badge tone="danger">Flash deal</Badge>}
            {product.tags.includes("best-seller") && <Badge tone="warning">Best seller</Badge>}
            {product.tags.includes("new") && <Badge tone="success">New</Badge>}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm"><span className="text-warning">{"★".repeat(Math.round(product.rating))}<span className="text-border">{"★".repeat(5 - Math.round(product.rating))}</span></span><span className="text-muted">{product.rating.toFixed(1)} · {product.reviewCount} review{product.reviewCount === 1 ? "" : "s"}</span></div>
          <p className="text-sm text-muted mt-2">{product.shortDescription}</p>
          <p className="text-xs text-muted mt-2">Sold by <span className="text-charcoal font-medium">{product.vendor.name}</span>{product.vendor.isIsource && <span className="ml-1 text-primary">· Isource Official</span>}</p>
          <div className="mt-4"><Price priceKobo={product.priceKobo} originalKobo={product.originalPriceKobo} size="lg" /></div>
          <div className="mt-2 text-sm">{product.stock > 0 ? <span className="text-success">In stock ({product.stock} available)</span> : <span className="text-danger">Out of stock</span>}</div>
          <AddToCart productId={product.id} disabled={product.stock <= 0} variants={product.variants} />
          <div className="mt-3"><WishlistButton productId={product.id} /></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 text-sm"><div className="rounded-md border border-border p-3"><p className="font-semibold mb-1">Delivery</p><p className="text-muted">Lagos, Abuja &amp; PH: 1–3 working days. Other states: 3–7 days.</p></div><div className="rounded-md border border-border p-3"><p className="font-semibold mb-1">Returns</p><p className="text-muted">7-day return window for eligible items.</p></div></div>
        </div>
        <aside className="hidden lg:block">
          <div className="rounded-lg border border-border bg-white p-3 sticky top-24">
            <h2 className="text-sm font-bold mb-3">Similar Products</h2>
            {related.length === 0 ? <p className="text-xs text-muted">No similar products yet.</p> : (
              <ul className="space-y-3">{related.map((p) => (<li key={p.id}><Link href={`/product/${p.slug}`} className="flex gap-2 items-start group"><div className="relative w-16 h-16 rounded border border-border bg-surface flex-shrink-0 overflow-hidden"><Image src={p.images[0]} alt={p.name} fill sizes="64px" className="object-contain p-1" /></div><div className="min-w-0"><p className="text-xs line-clamp-2 text-charcoal group-hover:text-primary">{p.name}</p><p className="text-xs font-semibold mt-1">{formatNairaShort(p.priceKobo)}</p></div></Link></li>))}</ul>
            )}
            <Link href={cat ? `/category/${cat.slug}` : "/search"} className="mt-3 block text-center text-xs font-medium text-primary hover:underline">View All →</Link>
          </div>
        </aside>
      </div>
      <ProductTabs description={product.description} specs={product.specs} sku={product.sku} reviews={product.reviews} />
      {related.length > 0 && (<section className="mt-10 lg:hidden"><h2 className="text-lg font-bold mb-3">Related products</h2><div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{related.map((p) => (<Link key={p.id} href={`/product/${p.slug}`} className="group rounded-lg border border-border bg-white overflow-hidden hover:border-primary"><div className="relative aspect-square bg-surface"><Image src={p.images[0]} alt={p.name} fill sizes="33vw" className="object-contain p-2" /></div><div className="p-2"><p className="text-xs line-clamp-2 text-charcoal group-hover:text-primary min-h-[2rem]">{p.name}</p><p className="text-xs font-semibold mt-1">{formatNairaShort(p.priceKobo)}</p></div></Link>))}</div></section>)}
    </div>
  );
}