import Link from "next/link";
import { getAdvertisingOverview } from "@/app/actions/admin-advertising";

export const dynamic = "force-dynamic";

function naira(kobo: number) { return "₦" + (kobo / 100).toLocaleString("en-NG", { maximumFractionDigits: 0 }); }

export default async function AdminAdvertisingOverview() {
  const stats = await getAdvertisingOverview();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total Ad Revenue", value: naira(stats.totalSpentKobo), highlight: true },
          { label: "Active Campaigns", value: stats.activeCampaigns.toLocaleString() },
          { label: "Pending Approval", value: stats.pendingCampaigns.toLocaleString(), warning: stats.pendingCampaigns > 0 },
          { label: "Total Impressions", value: stats.totalImpressions.toLocaleString() },
          { label: "Total Clicks / CTR", value: `${stats.totalClicks.toLocaleString()} (${stats.ctr}%)` },
        ].map((k) => (
          <div key={k.label} className="rounded-lg border border-border bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-muted font-semibold">{k.label}</p>
            <p className={`text-xl md:text-2xl font-extrabold mt-1 ${k.highlight ? "text-primary" : k.warning ? "text-amber-600" : "text-charcoal"}`}>
              {k.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-white p-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-charcoal">Need to moderate campaigns?</h3>
          <p className="text-sm text-muted mt-1">You have {stats.pendingCampaigns} campaigns waiting for review.</p>
        </div>
        <Link href="/admin/advertising/campaigns?status=PENDING" className="h-10 px-5 rounded bg-primary text-white text-sm font-bold flex items-center hover:bg-primary-hover transition-colors">
          Review Now
        </Link>
      </div>
    </div>
  );
}