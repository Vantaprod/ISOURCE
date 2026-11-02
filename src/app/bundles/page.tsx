import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatNairaShort } from "@/lib/format";
import { AddBundleToCart } from "./AddBundleToCart";

export const dynamic = "force-dynamic";

export default async function BundlesPage() {
  const bundles = await prisma.bundle.findMany({
    where: { isActive: true, category: "solar-power" },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8">
      <nav className="text-xs text-muted mb-4 flex gap-2"><Link href="/" className="hover:text-primary">Home</Link><span>/</span><span className="text-charcoal font-medium">Solar Bundles</span></nav>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-charcoal">Solar Bundles</h1>
        <p className="text-sm text-muted mt-2">Complete kits to power your home or business. Save more when you buy together.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bundles.map((b) => (
          <div key={b.id} className="flex flex-col rounded-xl border border-border bg-white overflow-hidden">
            <div className="relative aspect-video bg-surface">
              <Image src={b.imageUrl || "/images/placeholder.svg"} alt={b.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain p-4" />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h2 className="text-lg font-bold text-charcoal mb-1">{b.title}</h2>
              <p className="text-sm text-muted line-clamp-2 mb-3">{b.description}</p>
              <ul className="text-xs text-charcoal/70 mb-4 space-y-1">
                {b.items.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-center gap-1">✓ {item.product.name}</li>
                ))}
                {b.items.length > 3 && <li>+ {b.items.length - 3} more items</li>}
              </ul>
              <div className="mt-auto">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-xl font-extrabold text-charcoal">{formatNairaShort(b.priceKobo)}</span>
                  {b.originalPriceKobo && <span className="text-sm text-muted line-through">{formatNairaShort(b.originalPriceKobo)}</span>}
                </div>
                <AddBundleToCart bundleId={b.id} />
              </div>
            </div>
          </div>
        ))}
        {bundles.length === 0 && <p className="text-muted col-span-full text-center py-12">No bundles available yet.</p>}
      </div>
    </div>
  );
}