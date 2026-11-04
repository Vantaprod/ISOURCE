import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { StoreHeroCarousel } from "@/components/store/StoreHeroCarousel";
import { FollowButton } from "@/components/store/FollowButton";
import { ProductCard } from "@/components/product/ProductCard";
import { getSession } from "@/lib/session";
import { isFollowingStore } from "@/app/actions/store-follow";
import { BadgeCheck, Package, Users, Star, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

// Maps DB section types to their human labels (used in logging / debugging)
const SECTION_LABELS: Record<string, string> = {
  HERO: "Hero",
  COLLECTIONS: "Collections",
  FEATURED_PRODUCTS: "Featured Products",
  ALL_PRODUCTS: "All Products",
  BRAND_STORY: "Brand Story",
  REVIEWS: "Customer Reviews",
  WARRANTY_INFO: "Warranty & Support",
};

export default async function PublicStorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getSession();

  const vendor = await prisma.vendor.findUnique({
    where: { slug },
    include: { _count: { select: { storeFollowers: true, products: true } } },
  });

  if (!vendor || vendor.status !== "APPROVED") notFound();

  // ─── Fetch all data in parallel for speed ───
  const [banners, collections, products, featuredProducts, reviews, sections, theme] = await Promise.all([
    prisma.storeBanner.findMany({ where: { vendorId: vendor.id, isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.storeCollection.findMany({
      where: { vendorId: vendor.id, isActive: true },
      include: {
        products: {
          include: {
            product: {
              include: {
                images: { take: 1 }, vendor: true, category: true, variants: true, reviews: true,
              },
            },
          },
          orderBy: { sortOrder: "asc" },
          take: 6,
        },
      },
    }),
    prisma.product.findMany({
      where: { vendorId: vendor.id, isActive: true, approvalStatus: "APPROVED" },
      include: { images: { take: 1 }, vendor: true, category: true, variants: true, reviews: true },
      orderBy: { createdAt: "desc" },
      take: 24,
    }),
    prisma.product.findMany({
      where: { vendorId: vendor.id, isActive: true, approvalStatus: "APPROVED", isFeatured: true },
      include: { images: { take: 1 }, vendor: true, category: true, variants: true, reviews: true },
      take: 8,
    }),
    prisma.productReview.findMany({
      where: { product: { vendorId: vendor.id } },
      include: { user: { select: { name: true } }, product: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.storeSection.findMany({
      where: { vendorId: vendor.id },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.storeTheme.findUnique({ where: { vendorId: vendor.id } }),
  ]);

  const isFollowing = session ? await isFollowingStore(vendor.id) : false;

  // Helper to normalize a product for ProductCard
  const mapProduct = (p: any) => ({
    ...p,
    category: p.category?.slug || "uncategorized",
    vendorSlug: p.vendor?.slug || "isource",
    images: p.images.map((i: any) => i.url),
    specs: (p.specs as unknown) as { label: string; value: string }[],
    tags: (p.tags as string[]) || [],
  });

  const mappedProducts = products.map(mapProduct);
  const mappedFeatured = featuredProducts.map(mapProduct);

  // Fallback section order if vendor hasn't customized yet
  const activeSections = sections.length > 0
    ? sections.filter(s => s.isActive)
    : [
        { type: "HERO", isActive: true },
        { type: "COLLECTIONS", isActive: true },
        { type: "ALL_PRODUCTS", isActive: true },
        { type: "BRAND_STORY", isActive: true },
      ];

  // ─── Render helpers ───
  const accent = theme?.accentColor || undefined;
  const bgColor = theme?.backgroundColor || "#FFFFFF";
  const buttonRadius = theme?.buttonStyle || "rounded-lg";

  const ctaClass = accent
    ? "inline-flex items-center justify-center font-bold text-white transition-opacity hover:opacity-90"
    : "inline-flex items-center justify-center font-bold bg-primary text-white hover:bg-primary-hover transition-colors";

  const renderSection = (section: any) => {
    switch (section.type) {
      case "HERO":
        return banners.length > 0 ? (
          <div key="hero" className="mx-auto max-w-[1440px] px-4 pt-6">
            <StoreHeroCarousel banners={banners} accent={accent} />
          </div>
        ) : null;

      case "BRAND_STORY":
        return vendor.description ? (
          <div key="story" className="mx-auto max-w-[1440px] px-4 py-8">
            <div className="max-w-3xl">
              <h2 className="text-xl md:text-2xl font-extrabold text-charcoal mb-3">About {vendor.name}</h2>
              <p className="text-sm md:text-base text-charcoal/80 leading-relaxed">{vendor.description}</p>
            </div>
          </div>
        ) : null;

      case "FEATURED_PRODUCTS":
        return mappedFeatured.length > 0 ? (
          <section key="featured" className="mx-auto max-w-[1440px] px-4 py-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-primary" />
              <h2 className="text-xl md:text-2xl font-extrabold text-charcoal">Featured Products</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mappedFeatured.map((p: any) => <ProductCard key={p.id} product={p as never} />)}
            </div>
          </section>
        ) : null;

      case "COLLECTIONS":
        return collections.length > 0 ? (
          <div key="collections" className="mx-auto max-w-[1440px] px-4 space-y-10 py-8">
            {collections.map((col) => (
              <section key={col.id}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-extrabold text-charcoal">{col.name}</h2>
                  <Link
                    href={`/brand/${vendor.slug}/collection/${col.slug}`}
                    className="text-sm font-bold hover:underline"
                    style={accent ? { color: accent } : undefined}
                  >
                    {accent ? null : <span className="text-primary">See All &rarr;</span>}
                    {accent && "See All →"}
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {col.products.map((cp: any) => {
                    const p = cp.product;
                    return <ProductCard key={p.id} product={mapProduct(p) as never} />;
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : null;

      case "ALL_PRODUCTS":
        return (
          <div key="all-products" className="mx-auto max-w-[1440px] px-4 py-8">
            <div className="flex items-center justify-between mb-6 pt-6 border-t border-border">
              <h2 className="text-xl md:text-2xl font-extrabold text-charcoal">All Products</h2>
              <span className="text-sm text-muted">{products.length} items</span>
            </div>
            {mappedProducts.length === 0 ? (
              <div className="text-center py-20 text-muted">
                <Package size={40} className="mx-auto mb-4 opacity-50" />
                <p>This store hasn&apos;t listed any products yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {mappedProducts.map((p: any) => <ProductCard key={p.id} product={p as never} />)}
              </div>
            )}
          </div>
        );

      case "REVIEWS":
        return reviews.length > 0 ? (
          <section key="reviews" className="mx-auto max-w-[1440px] px-4 py-8">
            <div className="flex items-center gap-2 mb-4">
              <Star size={20} className="text-primary fill-primary" />
              <h2 className="text-xl md:text-2xl font-extrabold text-charcoal">Customer Reviews</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {reviews.map((r: any) => (
                <div key={r.id} className="bg-white rounded-xl border border-border p-5">
                  <div className="flex text-primary mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < r.rating ? "fill-primary" : "fill-border"} />
                    ))}
                  </div>
                  <p className="text-sm text-charcoal/80 mb-3 line-clamp-3">{r.body || r.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span className="font-bold text-charcoal">{r.user?.name || "Verified Buyer"}</span>
                    <span>·</span>
                    <span>{r.product.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case "WARRANTY_INFO":
        return (
          <section key="warranty" className="mx-auto max-w-[1440px] px-4 py-8">
            <div className="bg-surface rounded-2xl border border-border p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-extrabold text-charcoal mb-4">Warranty & Support</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-bold text-sm text-charcoal mb-1">Warranty Coverage</h3>
                  <p className="text-sm text-muted">All products are covered per manufacturer terms. Contact us within the warranty period for claims.</p>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-charcoal mb-1">After-Sales Contact</h3>
                  <p className="text-sm text-muted">
                    {vendor.afterSalesPhone ? (
                      <a href={`tel:${vendor.afterSalesPhone}`} className="font-bold" style={accent ? { color: accent } : undefined}>{vendor.afterSalesPhone}</a>
                    ) : (
                      "Available on request"
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-charcoal mb-1">Returns</h3>
                  <p className="text-sm text-muted">Return requests are processed within 7 days of delivery per Isource policy.</p>
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      {/* Store Info Bar */}
      <div className="mx-auto max-w-[1440px] px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl bg-surface border border-border flex items-center justify-center overflow-hidden shrink-0">
              {vendor.logoUrl ? (
                <Image src={vendor.logoUrl} alt={vendor.name} width={80} height={80} className="object-contain" />
              ) : (
                <span className="text-2xl font-black text-primary">{vendor.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-extrabold text-charcoal">{vendor.name}</h1>
                <BadgeCheck size={20} className="text-primary" />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                <span className="flex items-center gap-1"><Users size={14} /> {vendor._count.storeFollowers} followers</span>
                <span className="flex items-center gap-1"><Package size={14} /> {vendor._count.products} products</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {session && <FollowButton vendorId={vendor.id} vendorSlug={vendor.slug} initialFollowing={isFollowing} />}
          </div>
        </div>
      </div>

      {/* Dynamic Sections */}
      {activeSections.map((section: any) => renderSection(section))}

      {/* Footer spacer */}
      <div className="h-16" />
    </div>
  );
}