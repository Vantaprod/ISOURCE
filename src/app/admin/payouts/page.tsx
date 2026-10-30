import { prisma } from "@/lib/prisma";
import { formatNairaShort } from "@/lib/format";
import { PayoutClient } from "./PayoutClient";

export default async function AdminPayoutsPage() {
  const vendors = await prisma.vendor.findMany({
    where: { status: "APPROVED" },
    include: { ledgerEntries: true },
  });

  const vendorBalances = vendors.map((v) => ({
    id: v.id,
    name: v.name,
    email: "",
    balanceKobo: v.ledgerEntries.reduce((s, e) => s + e.amountKobo, 0),
    commissionRate: v.commissionRate,
  }));

  const payouts = await prisma.payout.findMany({
    orderBy: { createdAt: "desc" },
    include: { vendor: { select: { name: true } } },
    take: 20,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Vendor Payouts</h1>
        <p className="text-sm text-muted">View vendor balances and trigger payouts.</p>
      </div>

      <PayoutClient vendors={vendorBalances} />

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="p-4 border-b border-border"><h2 className="font-bold text-charcoal">Recent Payouts</h2></div>
        {payouts.length === 0 ? (
          <p className="p-8 text-sm text-muted text-center">No payouts yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted text-xs uppercase font-bold">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payouts.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-mono text-xs">{p.reference}</td>
                  <td className="px-4 py-3 font-medium">{p.vendor.name}</td>
                  <td className="px-4 py-3 font-bold">{formatNairaShort(p.amountKobo)}</td>
                  <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${p.status === "PAID" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{p.status}</span></td>
                  <td className="px-4 py-3 text-muted text-xs">{p.createdAt.toLocaleDateString("en-NG")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}