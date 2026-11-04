import Link from "next/link";
import { getMyAdvertisingOverview, listMyCampaigns } from "@/app/actions/advertising-campaign";

export const dynamic = "force-dynamic";

function nairaFromKobo(kobo: number | string): string {
  const n = Number(kobo) / 100;
  return "₦" + n.toLocaleString("en-NG", { maximumFractionDigits: 0 });
}

function fmtDate(d: Date | string): string {
  return new Date(d).toLocaleDateString("en-NG", { dateStyle: "medium" });
}

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  PENDING: "bg-amber-100 text-amber-700",
  PAUSED: "bg-gray-100 text-gray-700",
  ENDED: "bg-gray-100 text-gray-500",
  REJECTED: "bg-red-100 text-red-700",
};

export default async function AdvertisingOverviewPage() {
  const [stats, campaigns] = await Promise.all([getMyAdvertisingOverview(), listMyCampaigns()]);
  const recent = campaigns.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header bar with CTA */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs uppercase text-muted font-semibold tracking-wide">Wallet Balance</p>
          <p className="text-2xl font-extrabold text-primary">{nairaFromKobo(stats.walletAvailableKobo)}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/vendor/advertising/wallet"
            className="h-10 px-4 rounded border border-charcoal text-charcoal text-sm font-bold flex items-center hover:bg-charcoal hover:text-white transition-colors"
          >
            Fund Wallet
          </Link>
          <Link
            href="/vendor/advertising/create"
            className="h-10 px-5 rounded bg-primary text-white text-sm font-bold flex items-center hover:bg-primary-hover transition-colors"
          >
            + Create Campaign
          </Link>
        </div>
      </div>

      {/* KPI strip (Image 1 pattern) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total Spend", value: nairaFromKobo(stats.totalSpendKobo) },
          { label: "Impressions", value: stats.totalImpressions.toLocaleString() },
          { label: "Clicks", value: stats.totalClicks.toLocaleString() },
          { label: "CTR", value: `${stats.ctr}%` },
          { label: "Avg CPC", value: nairaFromKobo(stats.avgCpcKobo) },
        ].map((k) => (
          <div key={k.label} className="rounded-lg border border-border bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-muted font-semibold">{k.label}</p>
            <p className="text-xl md:text-2xl font-extrabold text-charcoal mt-1">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Active / pending summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-white p-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-muted font-semibold">Active Campaigns</p>
            <p className="text-2xl font-extrabold text-green-600 mt-1">{stats.activeCampaigns}</p>
          </div>
          <Link href="/vendor/advertising/campaigns?status=ACTIVE" className="text-xs font-bold text-primary hover:underline">
            View →
          </Link>
        </div>
        <div className="rounded-lg border border-border bg-white p-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-muted font-semibold">Awaiting Approval</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">{stats.pendingCampaigns}</p>
          </div>
          <Link href="/vendor/advertising/campaigns?status=PENDING" className="text-xs font-bold text-primary hover:underline">
            View →
          </Link>
        </div>
      </div>

      {/* Recent campaigns */}
      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="text-sm font-bold text-charcoal">Recent Campaigns</h3>
            <p className="text-xs text-muted mt-0.5">Latest 5</p>
          </div>
          <Link href="/vendor/advertising/campaigns" className="text-xs font-bold text-primary hover:underline">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-muted mb-3">No campaigns yet.</p>
            <Link href="/vendor/advertising/create" className="inline-block h-10 px-5 rounded bg-primary text-white text-sm font-bold leading-10">
              Create your first campaign
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface text-xs uppercase text-muted">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Product</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-right px-5 py-3 font-semibold">Spend</th>
                  <th className="text-right px-5 py-3 font-semibold">Clicks</th>
                  <th className="text-right px-5 py-3 font-semibold">Impr.</th>
                  <th className="text-left px-5 py-3 font-semibold">Ends</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((c) => (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {c.product?.images?.[0]?.url && (
                          <img src={c.product.images[0].url} alt="" className="w-8 h-8 rounded object-cover" />
                        )}
                        <span className="font-medium text-charcoal truncate max-w-[200px]">{c.product?.name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${STATUS_STYLE[c.status] || ""}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-charcoal">{nairaFromKobo(c.spendKobo)}</td>
                    <td className="px-5 py-3 text-right text-charcoal">{c.clicks.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-charcoal">{c.impressions.toLocaleString()}</td>
                    <td className="px-5 py-3 text-charcoal whitespace-nowrap">{fmtDate(c.endDate)}</td>
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