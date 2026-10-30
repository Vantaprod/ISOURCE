import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await prisma.collection.findUnique({
    where: { slug, isActive: true },
    include: { products: { where: { isActive: true }, include: { images: { take: 1 }, vendor: true, category: true, variants: true, reviews: true } } },
  });
  if (!collection) notFound();

  // Map to the shape ProductCard expects
  const products = collection.products.map((p) => ({
    ...p,
    category: p.category.slug,
    vendorSlug: p.vendor.slug,
    images: p.images.map(i => i.url),
    specs: (p.specs as unknown) as { label: string; value: string }[],
    rating: p.rating,
    reviewCount: p.reviewCount,
    tags: p.tags as string[],
  }));

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8">
      <nav className="text-xs text-muted mb-4 flex gap-2"><Link href="/" className="hover:text-primary">Home</Link><span>/</span><span className="text-charcoal font-medium">{collection.name}</span></nav>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-charcoal">{collection.name}</h1>
        {collection.description && <p className="text-sm text-muted mt-2">{collection.description}</p>}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {products.map((p) => <ProductCard key={p.id} product={p as never} />)}
      </div>
      {products.length === 0 && <p className="p-8 text-center text-sm text-muted rounded-xl border border-border">This collection has no products yet.</p>}
    </div>
  );
}