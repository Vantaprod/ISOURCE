import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, PackageX } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { formatNairaShort } from "@/lib/format";
import { deleteProduct } from "@/app/actions/vendor";
import { redirect } from "next/navigation";

export default async function VendorProductsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const vendor = await prisma.vendor.findUnique({ where: { userId: session.userId }, include: { products: { include: { images: true, category: true } } } });
  if (!vendor) redirect("/vendor");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Products</h1><p className="text-sm text-muted">Manage your store inventory.</p></div>
        <Link href="/vendor/products/new" className="h-10 px-4 rounded bg-primary text-white text-sm font-bold inline-flex items-center gap-2"><Plus size={16} /> Add Product</Link>
      </div>
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        {vendor.products.length === 0 ? (
          <div className="p-10 text-center"><PackageX className="mx-auto text-muted mb-3" size={32} /><p className="font-bold">No products yet</p><Link href="/vendor/products/new" className="inline-block mt-3 h-9 px-4 leading-9 rounded bg-primary text-white text-xs font-bold">Create your first listing</Link></div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted text-xs uppercase"><tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-border">
              {vendor.products.map(p => (
                <tr key={p.id}>
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="relative h-10 w-10 rounded border border-border overflow-hidden"><Image src={p.images[0]?.url || "/images/placeholder.svg"} alt={p.name} fill sizes="40px" className="object-contain p-1" /></div><span className="font-medium text-charcoal">{p.name}</span></div></td>
                  <td className="px-4 py-3 text-muted">{p.category.name}</td>
                  <td className="px-4 py-3 font-medium">{formatNairaShort(p.priceKobo)}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.stock > 0 ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>{p.stock}</span></td>
                  <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-2"><Link href={`/vendor/products/${p.id}/edit`} className="h-8 w-8 rounded border border-border flex items-center justify-center hover:border-primary hover:text-primary"><Edit size={14} /></Link><form action={async () => { "use server"; await deleteProduct(p.id); }}><button className="h-8 w-8 rounded border border-border text-danger hover:bg-danger/10 hover:border-danger"><Trash2 size={14} /></button></form></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}