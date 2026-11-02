import { getVendorFinanceData, requestWithdrawal } from "@/app/actions/vendor-finance";
import { formatNairaShort } from "@/lib/format";
import { Wallet, Clock, TrendingUp, DollarSign, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function VendorFinanceOverview() {
  const data = await getVendorFinanceData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Financial Overview</h1>
        <p className="text-sm text-muted">Track your earnings, commissions, and request payouts.</p>
      </div>

      {/* Top Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm border-l-4 border-l-primary">
          <div className="flex items-center gap-2 text-muted mb-2">
            <Wallet size={16} /> <span className="text-xs font-bold uppercase">Available Balance</span>
          </div>
          <p className="text-2xl font-extrabold text-charcoal">{formatNairaShort(Number(data.availableKobo))}</p>
          <p className="text-xs text-green-600 mt-1 font-medium">Ready for withdrawal</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-muted mb-2">
            <Clock size={16} /> <span className="text-xs font-bold uppercase">Pending Earnings</span>
          </div>
          <p className="text-2xl font-extrabold text-charcoal">{formatNairaShort(Number(data.pendingKobo))}</p>
          <p className="text-xs text-orange-500 mt-1 font-medium">Awaiting delivery</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-muted mb-2">
            <TrendingUp size={16} /> <span className="text-xs font-bold uppercase">Total Sales</span>
          </div>
          <p className="text-2xl font-extrabold text-charcoal">{formatNairaShort(Number(data.totalSalesKobo))}</p>
          <p className="text-xs text-muted mt-1 font-medium">All-time gross</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-muted mb-2">
            <DollarSign size={16} /> <span className="text-xs font-bold uppercase">Total Paid Out</span>
          </div>
          <p className="text-2xl font-extrabold text-charcoal">{formatNairaShort(Number(data.totalPaidKobo))}</p>
          <p className="text-xs text-muted mt-1 font-medium">Successfully settled</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Recent Earnings */}
        <div className="md:col-span-2 rounded-xl border border-border bg-white overflow-hidden">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h2 className="font-bold text-charcoal">Recent Earnings</h2>
            <Link href="/vendor/finance/earnings" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-surface text-muted border-b border-border">
              <tr>
                <th className="text-left py-3 px-5 font-medium">Order</th>
                <th className="text-left py-3 px-5 font-medium">Date</th>
                <th className="text-left py-3 px-5 font-medium">Status</th>
                <th className="text-right py-3 px-5 font-medium">Net Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-surface/50">
                  <td className="py-3 px-5 font-bold text-charcoal">{order.orderNumber}</td>
                  <td className="py-3 px-5 text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-5">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      ["DELIVERED", "COMPLETED"].includes(order.status) ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right font-bold text-charcoal">{formatNairaShort(Number(order.vendorNetKobo))}</td>
                </tr>
              ))}
              {data.orders.length === 0 && (
                <tr><td colSpan={4} className="text-center py-8 text-muted">No earnings yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Withdrawal Panel */}
        <div className="rounded-xl border border-border bg-white p-5 h-fit">
          <h2 className="font-bold text-charcoal mb-4">Request Withdrawal</h2>
          
          <div className="bg-surface p-4 rounded-lg mb-4">
            <p className="text-xs text-muted mb-1">Available to withdraw</p>
            <p className="text-xl font-extrabold text-primary">{formatNairaShort(Number(data.availableKobo))}</p>
          </div>

          <form action={async (formData) => {
            "use server";
            const amount = Number(formData.get("amount")) * 100;
            await requestWithdrawal(amount);
          }} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">Amount (₦)</label>
              <input name="amount" type="number" max={Number(data.availableKobo)/100} min="1000" required className="w-full h-10 rounded border border-border px-3 text-sm focus:border-primary outline-none" placeholder="Enter amount" />
            </div>
            <button type="submit" className="w-full h-10 bg-primary text-white font-bold rounded-md hover:bg-primary-hover flex items-center justify-center gap-2">
              <ShieldCheck size={16} /> Request Payout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}