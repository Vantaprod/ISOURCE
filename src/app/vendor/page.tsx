import Link from "next/link";
import Image from "next/image";
import { PlusCircle, Edit, Trash2, PackageX, DollarSign, ShoppingBag, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { formatNairaShort } from "@/lib/format";
import { deleteProduct } from "@/app/actions/vendor";
import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default async function VendorDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.userId },
    include: { products: { include: { images: true, category: true }, orderBy: { createdAt: "desc" } } }
  });

  if (!vendor) return <div>Vendor profile missing. Contact support.</div>;

  // If pending, show a lock screen
  if (vendor.status === "PENDING") {
    return (
      <div className="rounded-xl border border-warning/30 bg-warning/5 p-10 text-center max-w-2xl mx-auto mt-10">
        <AlertTriangle size={48} className="mx-auto text-warning mb-4" />
        <h2 className="text-2xl font-bold text-charcoal">Application Under Review</h2>
        <p className="text-muted mt-2">Your vendor application is currently pending approval by an administrator. You will be able to add products once approved.</p>
      </div>
    );
  }

  // Fetch stats
  const orderItems = await prisma.orderItem.findMany({ where: { vendorId: vendor.id, fulfillmentStatus: { not: "PENDING" } } });
  const totalRevenue = orderItems.reduce((sum, item) => sum + item.lineTotalKobo, 0);
  const totalOrders = orderItems.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{vendor.name}</h1>
          <p className="text-sm text-muted">Manage your products and inventory.</p>
        </div>
        <Link href="/vendor/products/new" className="inline-flex h-10 items-center gap-2 rounded bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover">
          <PlusCircle size={16} /> Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-white p-4">
          <div className="flex items-center gap-2 text-muted mb-2"><DollarSign size={16} /><p className="text-xs uppercase font-medium">Revenue</p></div>
          <p className="text-2xl font-bold">{formatNairaShort(totalRevenue)}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <div className="flex items-center gap-2 text-muted mb-2"><ShoppingBag size={16} /><p className="text-xs uppercase font-medium">Orders</p></div>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <div className="flex items-center gap-2 text-muted mb-2"><PackageX size={16} /><p className="text-xs uppercase font-medium">Out of Stock</p></div>
          <p className="text-2xl font-bold text-danger">{vendor.products.filter(p => p.stock <= 0).length}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <div className="flex items-center gap-2 text-muted mb-2"><Clock size={16} /><p className="text-xs uppercase font-medium">Total Products</p></div>
          <p className="text-2xl font-bold">{vendor.products.length}</p>
        </div>
      </div>

      {/* Product Table */}
      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Product Inventory</h2>
        </div>
        {vendor.products.length === 0 ? (
          <div className="p-10 text-center">
            <PackageX className="mx-auto text-muted mb-3" size={32} />
            <p className="text-charcoal font-medium">No products yet</p>
            <p className="text-sm text-muted mt-1">{"Click \u201cAdd Product\u201d to create your first listing."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-muted text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {vendor.products.map((p) => (
                  <tr key={p.id} className="hover:bg-surface/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded border border-border bg-white overflow-hidden flex-shrink-0">
                          <Image src={p.images[0]?.url || "/images/placeholder.svg"} alt={p.name} fill sizes="40px" className="object-contain p-1" />
                        </div>
                        <span className="font-medium text-charcoal line-clamp-2">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">{p.category.name}</td>
                    <td className="px-4 py-3 font-medium">{formatNairaShort(p.priceKobo)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${p.stock > 0 ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/vendor/products/${p.id}/edit`} className="h-8 w-8 rounded border border-border flex items-center justify-center hover:border-primary hover:text-primary">
                          <Edit size={14} />
                        </Link>
                        <form action={async () => { "use server"; await deleteProduct(p.id); }}>
                          <button type="submit" className="h-8 w-8 rounded border border-border flex items-center justify-center text-danger hover:bg-danger/10 hover:border-danger">
                            <Trash2 size={14} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}