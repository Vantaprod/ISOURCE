import { ReviewForm } from "@/components/product/ReviewForm";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductOptions } from "@/components/product/ProductOptions";
import { ReviewHighlights } from "@/components/product/ReviewHighlights";
import { ProductCard } from "@/components/product/ProductCard";
import { formatNairaShort } from "@/lib/format";
import { Star, ShieldCheck, Truck, RotateCcw, ShoppingCart, Tag, Store } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // NEXT.JS 15 FIX: Await params
  const { slug } = await params;
  const session = await getSession();

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      vendor: true,
      brand: true,
      category: true,
      variants: true, 
      reviews: { take: 4, orderBy: { createdAt: 'desc' }, include: { user: true } }, 
    },
  });

  if (!product) notFound();

  let relatedProducts = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, isActive: true, approvalStatus: "APPROVED" },
    include: { images: { take: 1 }, vendor: true, category: true, variants: true, reviews: true },
    take: 6,
  });

  const mappedRelated = relatedProducts.map((p) => ({
    ...p, category: p.category?.slug || "uncategorized", vendorSlug: p.vendor?.slug || "isource",
    images: p.images.map((i) => i.url), specs: (p.specs as unknown) as { label: string; value: string }[], tags: (p.tags as string[]) || [],
  }));

  const imageUrls = product.images.map((img) => img.url);
  const discount = product.originalPriceKobo 
    ? Math.round(((product.originalPriceKobo - product.priceKobo) / product.originalPriceKobo) * 100) : 0;
  const mappedVariants = product.variants.map(v => ({ name: v.name, value: v.value }));

  return (
    <div className="w-full max-w-[1440px] mx-auto bg-surface/30 pb-20 overflow-x-hidden">
      <div className="p-4 md:px-8 text-xs text-muted flex flex-wrap gap-2">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href={`/category/${product.category.slug}`} className="hover:text-primary">{product.category.name}</Link>
        <span>/</span>
        <span className="text-charcoal font-bold truncate">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-12 gap-8 md:gap-12 px-4 md:px-8 w-full">
        
        {/* LEFT COLUMN: Images */}
        <div className="w-full min-w-0 md:col-span-5">
          <ProductGallery images={imageUrls} productName={product.name} />
        </div>

        {/* RIGHT COLUMN: Details */}
        <div className="w-full min-w-0 md:col-span-7 space-y-6">
          
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 bg-[#111] text-[#FBAF3C] px-3 py-1 rounded-md text-[10px] font-bold border border-[#FBAF3C]">
                <Tag size={12} /> Black Friday Deal
              </div>
              <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-md text-[10px] font-bold">
                <ShieldCheck size={12} /> 100% Genuine
              </div>
            </div>

            <div className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">
              {product.brand?.name || "Generic Brand"}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-extrabold text-charcoal leading-tight mb-3 break-words">
              {product.name}
            </h1>
            
            <div className="flex items-end gap-3 mb-4 flex-wrap">
              <span className="text-3xl font-black text-charcoal">{formatNairaShort(product.priceKobo)}</span>
              {product.originalPriceKobo && <span className="text-lg text-muted line-through mb-1">{formatNairaShort(product.originalPriceKobo)}</span>}
              {discount > 0 && <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded mb-1">-{discount}%</span>}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm mb-6 pb-6 border-b border-border">
              <div className="flex items-center gap-1 text-primary">
                <Star size={16} className="fill-primary" />
                <span className="font-bold text-charcoal">{product.rating.toFixed(1)}</span>
                <span className="text-muted">({product.reviewCount} reviews)</span>
              </div>
              <div className="w-px h-4 bg-border hidden md:block"></div>
              <div className="text-muted">
                Sold by <Link href={`/brand/${product.vendor?.slug}`} className="font-bold text-charcoal hover:text-primary">{product.vendor?.name || "Isource Official"}</Link>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-charcoal mb-2">About this item</h3>
            <ul className="text-sm text-charcoal/80 leading-relaxed list-disc list-inside space-y-1 break-words">
              {(product.description || product.shortDescription).split('\n').map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>

          <ProductOptions variants={mappedVariants} />

          <div className="bg-surface rounded-xl border border-border p-4 space-y-3 w-full">
            <div className="flex flex-wrap items-center gap-3 pb-3 border-b border-border/50">
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-border shrink-0">
                <Store size={18} className="text-charcoal" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-charcoal truncate">{product.vendor?.name || "Isource Official"}</p>
                <p className="text-xs text-muted">Verified Seller</p>
              </div>
              <Link href={`/brand/${product.vendor?.slug}`} className="text-xs font-bold text-primary hover:underline ml-auto">Visit Store</Link>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <Truck size={16} className="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-charcoal">Fast Delivery</p>
                  <p className="text-xs text-muted">1-3 business days</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <RotateCcw size={16} className="text-orange-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-charcoal">Easy Returns</p>
                  <p className="text-xs text-muted">Within 7 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* WARRANTY BOX */}
          <div className="w-full min-w-0 bg-surface rounded-xl border border-border p-4 overflow-hidden">
            <h3 className="text-sm font-bold text-charcoal mb-2">Warranty & Support</h3>
            <div className="space-y-1 text-sm text-muted">
              {product.warrantyRepair ? (
                <p className="flex items-start gap-2 text-wrap break-words"><span className="text-green-600">✓</span> Repair Warranty Offered</p>
              ) : (
                <p className="flex items-start gap-2 text-wrap break-words"><span className="text-red-500">✗</span> No Repair Warranty Offered</p>
              )}
              {product.warrantyReplacement ? (
                <p className="flex items-start gap-2 text-wrap break-words"><span className="text-green-600">✓</span> Replacement Warranty Offered</p>
              ) : (
                <p className="flex items-start gap-2 text-wrap break-words"><span className="text-red-500">✗</span> No Replacement Warranty Offered</p>
              )}
            </div>
            {product.vendor?.afterSalesPhone && (
              <div className="mt-3 pt-3 border-t border-border/50 text-xs">
                <span className="font-bold text-charcoal">After-Sales Support: </span>
                <a href={`tel:${product.vendor.afterSalesPhone}`} className="text-primary hover:underline">{product.vendor.afterSalesPhone}</a>
              </div>
            )}
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border md:static md:bg-transparent md:border-none md:p-0 z-50 pt-4">
            <button className="w-full h-12 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 shadow-sm">
              <ShoppingCart size={18} /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* FULL WIDTH REVIEWS SECTION */}
      <div className="mt-16 px-4 md:px-8">
        <h2 className="text-xl font-extrabold text-charcoal mb-6">Customer Reviews</h2>
        <ReviewHighlights rating={product.rating} reviewCount={product.reviewCount} categorySlug={product.category?.slug || ""} />
        
        {session && (
          <div className="mb-6">
            <ReviewForm productId={product.id} productSlug={product.slug} />
          </div>
        )}
        
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex flex-col items-center shrink-0">
              <span className="text-5xl font-black text-charcoal">{product.rating.toFixed(1)}</span>
              <div className="flex text-primary my-2">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} className={i < Math.round(product.rating) ? "fill-primary" : "fill-border"} />)}
              </div>
              <span className="text-sm text-muted">{product.reviewCount} reviews</span>
            </div>
            
            <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8 space-y-4">
              {product.reviews.map(review => (
                <div key={review.id}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-charcoal">{review.user?.name || "Verified Buyer"}</span>
                    <span className="text-xs text-muted">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-charcoal/80">{review.body || "No written text."}</p>
                </div>
              ))}
              {product.reviews.length === 0 && <p className="text-sm text-muted italic">No reviews yet.</p>}
            </div>
          </div>
        </div>
      </div>

      {mappedRelated.length > 0 && (
        <div className="mt-16 px-4 md:px-8 border-t border-border pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-charcoal">You May Also Like</h2>
            <Link href={`/category/${product.category.slug}`} className="text-sm font-bold text-primary hover:underline">See All &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mappedRelated.map((p) => <ProductCard key={p.id} product={p as never} />)}
          </div>
        </div>
      )}
    </div>
  );
}