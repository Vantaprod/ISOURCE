import { prisma } from "@/lib/prisma";
import { BrandRow } from "./BrandRow";

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { createdAt: "desc" },
    include: { owner: true, _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Brand Management</h1>
        <p className="text-sm text-muted">Verify brands, add logos, and feature them on the homepage.</p>
      </div>

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3">Brand</th>
                <th className="px-5 py-3">Featured</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {brands.map((b) => (
                <BrandRow key={b.id} brand={{
                  id: b.id, name: b.name, ownerEmail: b.owner.email,
                  isFeatured: b.isFeatured, status: b.status
                }} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}