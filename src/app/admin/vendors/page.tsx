import { prisma } from "@/lib/prisma";
import { VendorRow } from "./VendorRow";
import { Store } from "lucide-react";

export default async function AdminVendorsPage() {
  const vendors = await prisma.vendor.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Vendor Management</h1>
        <p className="text-sm text-muted">Approve, suspend, or monitor marketplace sellers.</p>
      </div>

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3">Store Name</th>
                <th className="px-5 py-3">Owner</th>
                <th className="px-5 py-3">Products</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {vendors.map((v) => (
                <VendorRow key={v.id} vendor={{
                  id: v.id,
                  name: v.name,
                  email: v.user.email,
                  productCount: v._count.products,
                  location: v.location || "Nigeria",
                  status: v.status
                }} />
              ))}
            </tbody>
          </table>
        </div>
        {vendors.length === 0 && (
          <div className="p-10 text-center">
            <Store className="mx-auto text-muted mb-3" size={32} />
            <p className="text-charcoal font-medium">No vendors yet</p>
            <p className="text-sm text-muted mt-1">Vendors will appear here after they apply via the /sell page.</p>
          </div>
        )}
      </div>
    </div>
  );
}