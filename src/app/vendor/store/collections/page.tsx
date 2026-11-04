import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CollectionRow } from "./CollectionRow";
import { Layers, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const vendor = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!vendor) redirect("/vendor");

  const collections = await prisma.storeCollection.findMany({
    where: { vendorId: vendor.id },
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Collections</h1>
          <p className="text-sm text-muted">Group products into collections for your storefront.</p>
        </div>
        <Link href="/vendor/store/collections/new"
          className="h-10 px-4 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-hover flex items-center gap-2">
          <Plus size={16} /> New Collection
        </Link>
      </div>

      {collections.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
          <Layers size={40} className="mx-auto text-muted mb-4" />
          <h3 className="font-bold text-charcoal mb-1">No collections yet</h3>
          <p className="text-sm text-muted mb-4">Create collections like "Best Sellers" or "Solar Bundles" to organize your store.</p>
          <Link href="/vendor/store/collections/new" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-bold text-white hover:bg-primary-hover">
            Create Your First Collection
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {collections.map(c => <CollectionRow key={c.id} collection={c} />)}
        </div>
      )}
    </div>
  );
}