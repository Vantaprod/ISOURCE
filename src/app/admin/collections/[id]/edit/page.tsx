import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditCollectionForm } from "./EditCollectionForm";
import { ProductPicker } from "./ProductPicker";

export default async function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [collection, products] = await Promise.all([
    prisma.collection.findUnique({ where: { id }, include: { products: { include: { images: true } } } }),
    prisma.product.findMany({ where: { isActive: true }, take: 100, include: { images: true } }),
  ]);
  if (!collection) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Collection</h1>
        <p className="text-sm text-muted">Manage {collection.name}.</p>
      </div>
      <EditCollectionForm collection={collection} />
      <ProductPicker collectionId={collection.id} current={collection.products.map(p => p.id)} allProducts={products.map(p => ({ id: p.id, name: p.name, image: p.images[0]?.url || "/images/placeholder.svg", priceKobo: p.priceKobo }))} />
    </div>
  );
}