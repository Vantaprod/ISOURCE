import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import { CollectionForm } from "@/components/store/CollectionForm";
import { ProductPicker } from "@/components/store/ProductPicker";

export const dynamic = "force-dynamic";

export default async function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const vendor = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!vendor) redirect("/vendor");

  const collection = await prisma.storeCollection.findFirst({
    where: { id, vendorId: vendor.id },
    include: { products: { select: { productId: true } } },
  });

  if (!collection) notFound();

  const allProducts = await prisma.product.findMany({
    where: { vendorId: vendor.id, isActive: true },
    include: { images: { take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Edit Collection</h1>
        <p className="text-sm text-muted">Update the collection details and manage products.</p>
      </div>

      <CollectionForm mode="edit" collectionId={collection.id}
        initialData={{ name: collection.name, description: collection.description, imageUrl: collection.imageUrl }} />

      <ProductPicker collectionId={collection.id}
        allProducts={allProducts.map(p => ({
          id: p.id, name: p.name, priceKobo: p.priceKobo,
          images: p.images.map(i => ({ url: i.url })),
        }))}
        initialSelectedIds={collection.products.map(p => p.productId)} />
    </div>
  );
}