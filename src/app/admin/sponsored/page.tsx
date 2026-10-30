import { prisma } from "@/lib/prisma";
import { CreateSponsoredForm } from "./CreateSponsoredForm";
import { SponsoredRow } from "./SponsoredRow";

export default async function AdminSponsoredPage() {
  const [campaigns, products] = await Promise.all([
    prisma.sponsoredCampaign.findMany({ orderBy: { createdAt: "desc" }, include: { product: { include: { images: true } } } }),
    prisma.product.findMany({ where: { isActive: true, stock: { gt: 0 } }, include: { images: true }, take: 100, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Sponsored Products</h1>
        <p className="text-sm text-muted">
          {"Paid placements that appear at the top of search and category results. All sponsored products are clearly labeled "}
          <strong>Sponsored</strong>
          {" on the storefront."}
        </p>
      </div>

      <CreateSponsoredForm products={products.map(p => ({ id: p.id, name: p.name }))} />

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-muted text-xs uppercase font-bold">
            <tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Window</th><th className="px-4 py-3">Budget</th><th className="px-4 py-3">Performance</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {campaigns.map((c) => <SponsoredRow key={c.id} campaign={{
              id: c.id, productName: c.product.name, startDate: c.startDate.toISOString(), endDate: c.endDate.toISOString(),
              budgetKobo: c.budgetKobo, spendKobo: c.spendKobo, impressions: c.impressions, clicks: c.clicks, isActive: c.isActive, priority: c.priority,
            }} />)}
          </tbody>
        </table>
        {campaigns.length === 0 && <p className="p-8 text-center text-sm text-muted">No sponsored campaigns yet.</p>}
      </div>
    </div>
  );
}