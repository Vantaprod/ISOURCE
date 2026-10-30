import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CreateCollectionForm } from "./CreateCollectionForm";

export default async function AdminCollectionsPage() {
  const collections = await prisma.collection.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Collections</h1>
        <p className="text-sm text-muted">Curate product groupings that can be linked from banners or homepage sections.</p>
      </div>

      <CreateCollectionForm />

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-muted text-xs uppercase font-bold">
            <tr><th className="px-4 py-3">Collection</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Products</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {collections.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{c.slug}</td>
                <td className="px-4 py-3">{c._count.products}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.isActive ? "bg-success/10 text-success" : "bg-muted/10 text-muted"}`}>{c.isActive ? "ACTIVE" : "INACTIVE"}</span></td>
                <td className="px-4 py-3 text-right"><Link href={`/admin/collections/${c.id}/edit`} className="text-xs text-primary hover:underline">Edit →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {collections.length === 0 && <p className="p-8 text-center text-sm text-muted">No collections yet.</p>}
      </div>
    </div>
  );
}