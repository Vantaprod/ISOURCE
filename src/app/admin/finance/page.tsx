import { getAdminFinanceOverview } from "@/app/actions/admin-finance";
import { formatNairaShort } from "@/lib/format";
import { TrendingUp, DollarSign, Clock, Wallet, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminFinanceOverview() {
  const stats = await getAdminFinanceOverview();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Finance Overview</h1>
        <p className="text-sm text-muted">Platform-wide financial health and vendor liabilities.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm border-l-4 border-l-primary">
          <div className="flex items-center gap-2 text-muted mb-2">
            <TrendingUp size={16} /> <span className="text-xs font-bold uppercase">Gross Volume</span>
          </div>
          <p className="text-2xl font-extrabold text-charcoal">{formatNairaShort(Number(stats.totalVolumeKobo))}</p>
          <p className="text-xs text-muted mt-1">{stats.successfulPaymentsCount} successful payments</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-sm border-l-4 border-l-green-500">
          <div className="flex items-center gap-2 text-muted mb-2">
            <DollarSign size={16} /> <span className="text-xs font-bold uppercase">Isource Revenue</span>
          </div>
          <p className="text-2xl font-extrabold text-charcoal">{formatNairaShort(Number(stats.totalCommissionKobo))}</p>
          <p className="text-xs text-green-600 mt-1 font-medium">Commission earned</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-sm border-l-4 border-l-orange-500">
          <div className="flex items-center gap-2 text-muted mb-2">
            <Clock size={16} /> <span className="text-xs font-bold uppercase">Vendor Pending Liability</span>
          </div>
          <p className="text-2xl font-extrabold text-charcoal">{formatNairaShort(Number(stats.pendingLiabilityKobo))}</p>
          <p className="text-xs text-orange-500 mt-1 font-medium">Awaiting delivery</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-muted mb-2">
            <Wallet size={16} /> <span className="text-xs font-bold uppercase">Vendor Available</span>
          </div>
          <p className="text-2xl font-extrabold text-charcoal">{formatNairaShort(Number(stats.availableLiabilityKobo))}</p>
          <p className="text-xs text-muted mt-1">Owed to vendors</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-muted mb-2">
            <DollarSign size={16} /> <span className="text-xs font-bold uppercase">Total Paid Out</span>
          </div>
          <p className="text-2xl font-extrabold text-charcoal">{formatNairaShort(Number(stats.totalPaidKobo))}</p>
          <p className="text-xs text-muted mt-1">Settlements completed</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-muted mb-2">
            <AlertCircle size={16} /> <span className="text-xs font-bold uppercase">Total Refunds</span>
          </div>
          <p className="text-2xl font-extrabold text-charcoal">{formatNairaShort(Number(stats.totalRefundsKobo))}</p>
          <p className="text-xs text-muted mt-1">Customer refunds processed</p>
        </div>
      </div>

      {/* Quick Action */}
      <div className="rounded-xl bg-primary/10 border border-primary/20 p-5 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-charcoal mb-1">Settlement Queue</h3>
          <p className="text-sm text-muted">{stats.pendingSettlementsCount} vendor withdrawal request(s) awaiting action</p>
        </div>
        <Link href="/admin/finance/settlements" className="inline-flex items-center gap-2 h-10 px-5 rounded-md bg-primary text-white text-sm font-bold hover:bg-primary-hover">
          Review Settlements <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}