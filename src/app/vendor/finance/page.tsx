import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { formatNairaShort } from "@/lib/format";
import { Wallet, ArrowDownRight, ArrowUpRight, Clock } from "lucide-react";

export default async function VendorFinancePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const vendor = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!vendor) redirect("/account");

  const entries = await prisma.vendorLedgerEntry.findMany({
    where: { vendorId: vendor.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const balance = entries.reduce((sum, e) => sum + e.amountKobo, 0);
  const totalSales = entries.filter(e => e.type === "SALE").reduce((s, e) => s + e.amountKobo, 0);
  const totalCommission = entries.filter(e => e.type === "COMMISSION").reduce((s, e) => s + Math.abs(e.amountKobo), 0);
  const totalPayouts = entries.filter(e => e.type === "PAYOUT").reduce((s, e) => s + Math.abs(e.amountKobo), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Financial Overview</h1>
        <p className="text-sm text-muted">Your earnings, commissions and payouts.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-2 text-muted mb-2"><Wallet size={16} /><p className="text-xs uppercase font-bold">Available Balance</p></div>
          <p className="text-2xl font-extrabold text-success">{formatNairaShort(balance)}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-2 text-muted mb-2"><ArrowUpRight size={16} /><p className="text-xs uppercase font-bold">Total Sales</p></div>
          <p className="text-2xl font-extrabold text-charcoal">{formatNairaShort(totalSales)}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-2 text-muted mb-2"><ArrowDownRight size={16} /><p className="text-xs uppercase font-bold">Commission ({vendor.commissionRate}%)</p></div>
          <p className="text-2xl font-extrabold text-danger">{formatNairaShort(totalCommission)}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-2 text-muted mb-2"><Clock size={16} /><p className="text-xs uppercase font-bold">Total Paid Out</p></div>
          <p className="text-2xl font-extrabold text-charcoal">{formatNairaShort(totalPayouts)}</p>
        </div>
      </div>

      {/* Ledger */}
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="p-4 border-b border-border"><h2 className="font-bold text-charcoal">Transaction Ledger</h2></div>
        {entries.length === 0 ? (
          <p className="p-8 text-sm text-muted text-center">No transactions yet. Your sales will appear here.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-muted text-xs uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td className="px-4 py-3 text-muted">{e.createdAt.toLocaleDateString("en-NG", { dateStyle: "medium" })}</td>
                    <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                      e.type === "SALE" ? "bg-success/10 text-success" :
                      e.type === "COMMISSION" ? "bg-danger/10 text-danger" :
                      e.type === "PAYOUT" ? "bg-primary/10 text-primary" :
                      "bg-surface text-charcoal"
                    }`}>{e.type}</span></td>
                    <td className="px-4 py-3 text-charcoal">{e.description}</td>
                    <td className={`px-4 py-3 text-right font-bold ${e.amountKobo >= 0 ? "text-success" : "text-danger"}`}>
                      {e.amountKobo >= 0 ? "+" : ""}{formatNairaShort(e.amountKobo)}
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