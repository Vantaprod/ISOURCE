import { prisma } from "@/lib/prisma";
import { ModerationRow } from "./ModerationRow";

export default async function AdminModerationPage() {
  const products = await prisma.product.findMany({
    where: { approvalStatus: { in: ["PENDING", "REJECTED", "NEEDS_REVISION"] } },
    include: { vendor: true, images: { take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  const counts = await prisma.product.groupBy({
    by: ["approvalStatus"],
    _count: true,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Product Moderation Queue</h1>
        <p className="text-sm text-muted">Approve products before they appear on the storefront.</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {counts.map((c) => (
          <div key={c.approvalStatus} className="rounded-lg border border-border bg-white p-3">
            <p className="text-[10px] uppercase text-muted font-bold">{c.approvalStatus}</p>
            <p className="text-xl font-extrabold text-charcoal">{c._count}</p>
          </div>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="p-8 text-sm text-muted text-center rounded-xl border border-border bg-white">No products pending review.</p>
      ) : (
        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted text-xs uppercase font-bold">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => (
                <ModerationRow key={p.id} product={{
                  id: p.id, name: p.name, slug: p.slug,
                  image: p.images[0]?.url || "/images/placeholder.svg",
                  priceKobo: p.priceKobo, vendorName: p.vendor.name,
                  status: p.approvalStatus,
                }} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}