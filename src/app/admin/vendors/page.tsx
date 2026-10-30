import { prisma } from "@/lib/prisma";
import { VendorRow } from "./VendorRow";

export default async function AdminVendorsPage() {
  const vendors = await prisma.vendor.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Vendors</h1>
        <p className="text-sm text-muted">Approve or suspend marketplace sellers.</p>
      </div>

      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Store</th>
                <th className="px-4 py-3">Owner Email</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {vendors.map((v) => (
                <VendorRow key={v.id} vendor={{
                  id: v.id,
                  name: v.name,
                  email: v.user.email,
                  productCount: v._count.products,
                  status: v.status
                }} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}