import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Flame } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";

export async function FlashDealsSection() {
  const products = await prisma.product.findMany({
    where: { isActive: true, approvalStatus: "APPROVED", originalPriceKobo: { not: null } },
    include: { images: { take: 1 }, vendor: true, category: true, variants: true, reviews: true },
    take: 6,
    orderBy: { createdAt: "desc" }
  });

  if (products.length === 0) return null;

  const mappedProducts = products.map(p => ({
    ...p,
    category: p.category.slug,
    vendorSlug: p.vendor.slug,
    images: p.images.map(i => i.url),
    specs: (p.specs as unknown) as { label: string; value: string }[],
    tags: p.tags as string[],
  }));

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary p-2 rounded-lg">
            <Flame size={24} className="fill-primary" />
          </div>
          <h2 className="text-2xl font-extrabold text-charcoal">Flash Deals</h2>
        </div>
        <Link href="/search?q=deal" className="text-sm font-bold text-primary hover:underline">
          See All &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {mappedProducts.map((p) => (
          <ProductCard key={p.id} product={p as never} />
        ))}
      </div>
    </section>
  );
}