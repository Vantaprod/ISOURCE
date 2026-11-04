import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { StoreHeroCarousel } from "@/components/store/StoreHeroCarousel";
import { ProductCard } from "@/components/product/ProductCard";
import { PreviewBanner } from "@/components/store/PreviewBanner";
import { PendingWrapper } from "@/components/store/PendingWrapper";
import { BadgeCheck, Package, Users, Star, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StorePreviewPage() {
  const session = await getSession();
  if (!session || session.role !== "VENDOR") redirect("/login");

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.userId },
    include: { _count: { select: { storeFollowers: true, products: true } } },
  });

  if (!vendor) notFound();

  // ─── Fetch ALL data (including PENDING items for preview) ───
  const [banners, collections, products, featuredProducts, sections, theme] = await Promise.all([
    prisma.storeBanner.findMany({
      where: { vendorId: vendor.id, approvalStatus: { in: ["APPROVED", "PENDING"] } },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.storeCollection.findMany({
      where: { vendorId: vendor.id, approvalStatus: { in: ["APPROVED", "PENDING"] } },
      include: {
        products: {
          include: {
            product: {
              include: { images: { take: 1 }, vendor: true, category: true, variants: true, reviews: true },
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
    prisma.storeSection.findMany({
      where: { vendorId: vendor.id },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.storeTheme.findUnique({ where: { vendorId: vendor.id } }),
  ]);

  // ─── Helpers ───
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

  // Active sections
  const activeSections = sections.length > 0
    ? sections.filter(s => s.isActive)
    : [
        { type: "HERO", isActive: true },
        { type: "COLLECTIONS", isActive: true },
        { type: "ALL_PRODUCTS", isActive: true },
        { type: "BRAND_STORY", isActive: true },
      ];

  // Theme
  const accent = theme?.accentColor || undefined;
  const bgColor = theme?.backgroundColor || "#FFFFFF";

  // Split banners: currently-active vs future vs expired
  const now = new Date();
  const activeBanners = banners.filter(
    (b) =>
      b.isActive &&
      b.approvalStatus === "APPROVED" &&
      (!b.startsAt || new Date(b.startsAt) <= now) &&
      (!b.endsAt || new Date(b.endsAt) > now)
  );
  const pendingBanners = banners.filter((b) => b.approvalStatus === "PENDING");

  const renderSection = (section: any) => {
    switch (section.type) {
      case "HERO":
        // In preview, show only currently-active approved banners.
        // Pending banners get their own dedicated preview panel below.
        return activeBanners.length > 0 ? (
          <div key="hero" className="mx-auto max-w-[1440px] px-4 pt-6">
            <StoreHeroCarousel banners={activeBanners} accent={accent} />
          </div>
        ) : pendingBanners.length > 0 ? (
          <div key="hero" className="mx-auto max-w-[1440px] px-4 pt-6">
            <div className="aspect-[1920/600] rounded-2xl border-2 border-dashed border-yellow-400 bg-yellow-50 flex flex-col items-center justify-center">
              <p className="text-yellow-800 font-bold text-lg mb-1">Your hero banner is pending approval</p>
              <p className="text-sm text-yellow-700">It will appear here once an admin reviews it</p>
            </div>
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
              <PendingWrapper key={col.id} status={col.approvalStatus as any}>
                <section className="pt-2">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl md:text-2xl font-extrabold text-charcoal">{col.name}</h2>
                    {col.approvalStatus === "APPROVED" && (
                      <Link href={`/brand/${vendor.slug}/collection/${col.slug}`} className="text-sm font-bold hover:underline text-primary">
                        See All →
                      </Link>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {col.products.map((cp: any) => {
                      const p = cp.product;
                      return <ProductCard key={p.id} product={mapProduct(p) as never} />;
                    })}
                  </div>
                </section>
              </PendingWrapper>
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
                <p>No products listed yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {mappedProducts.map((p: any) => <ProductCard key={p.id} product={p as never} />)}
              </div>
            )}
          </div>
        );

      case "REVIEWS":
        return null; // Skip in preview for simplicity

      case "WARRANTY_INFO":
        return (
          <section key="warranty" className="mx-auto max-w-[1440px] px-4 py-8">
            <div className="bg-surface rounded-2xl border border-border p-6">
              <h2 className="text-xl font-extrabold text-charcoal mb-4">Warranty & Support</h2>
              <p className="text-sm text-muted">Coverage details and after-sales contact info will appear here.</p>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      <PreviewBanner storeUrl={`/brand/${vendor.slug}`} />

      {/* Store info bar */}
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
        </div>
      </div>

      {/* Dynamic sections */}
      {activeSections.map((s: any) => renderSection(s))}

      {/* Pending banners panel */}
      {pendingBanners.length > 0 && (
        <div className="mx-auto max-w-[1440px] px-4 py-8">
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6">
            <h3 className="font-bold text-yellow-900 mb-3">Pending Banner Previews ({pendingBanners.length})</h3>
            <p className="text-sm text-yellow-800 mb-4">These banners will appear on your storefront once approved by an admin.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {pendingBanners.map((b) => (
                <div key={b.id} className="relative bg-white rounded-xl overflow-hidden border border-yellow-300">
                  <div className="aspect-[1920/600] bg-surface relative">
                    <img src={b.desktopUrl} alt={b.heading || "Banner"} className="w-full h-full object-cover opacity-70" />
                    <div className="absolute top-2 right-2 bg-yellow-400 text-charcoal text-[10px] font-bold px-2 py-1 rounded-full">PENDING</div>
                  </div>
                  {b.heading && (
                    <div className="p-3">
                      <p className="font-bold text-charcoal text-sm">{b.heading}</p>
                      {b.description && <p className="text-xs text-muted mt-0.5">{b.description}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="h-16" />
    </div>
  );
}