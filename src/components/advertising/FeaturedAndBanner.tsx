import Link from "next/link";
import { prisma } from "@/lib/prisma";

export async function FeaturedProducts({ placementSlug = "homepage-featured" }: { placementSlug?: string }) {
  const now = new Date();
  const placements = await prisma.featuredPlacement.findMany({
    where: {
      status: "ACTIVE",
      startAt: { lte: now },
      endAt: { gte: now },
      placement: { slug: placementSlug }
    },
    take: 8
  });

  if (placements.length === 0) return null;

  const productIds = placements.map(p => p.productId).filter(Boolean) as string[];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { images: { take: 1 }, vendor: true }
  });

  if (products.length === 0) return null;

  return (
    <section className="my-8">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-extrabold text-charcoal">Featured Products</h2>
        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">Ad</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <Link key={p.id} href={`/product/${p.slug}`} className="group block rounded-lg border border-border bg-white p-3 hover:shadow-md transition-shadow relative">
            <span className="absolute top-2 right-2 bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">Sponsored</span>
            <div className="aspect-square bg-surface rounded-md overflow-hidden mb-2">
              {p.images[0] ? <img src={p.images[0].url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <div className="w-full h-full flex items-center justify-center text-xs text-muted">No image</div>}
            </div>
            <p className="text-xs text-muted truncate">{p.vendor?.name}</p>
            <p className="text-sm font-semibold text-charcoal line-clamp-2">{p.name}</p>
            <p className="text-sm font-extrabold text-primary mt-1">₦{(p.priceKobo / 100).toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export async function SponsoredBanner() {
  const now = new Date();
  const banner = await prisma.sponsoredCampaign.findFirst({
    where: {
      campaignType: "BANNER",
      status: "ACTIVE",
      startDate: { lte: now },
      endDate: { gte: now },
      placement: { slug: "banner-homepage" }
    },
    orderBy: { createdAt: "desc" }
  });

  if (!banner) return null;
  const targeting = banner.targeting as any;
  if (!targeting?.imageUrl) return null;

  return (
    <div className="my-8 relative">
      <a href={targeting.ctaUrl} className="block w-full rounded-xl overflow-hidden hover:opacity-95 transition-opacity">
        <img src={targeting.imageUrl} alt={targeting.title} className="w-full h-auto object-cover max-h-[250px]" />
      </a>
      <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider">AD</span>
    </div>
  );
}