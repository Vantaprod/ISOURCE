import Link from "next/link";
import { listMyCampaigns } from "@/app/actions/advertising-campaign";
import { CampaignActions } from "./CampaignActions";

export const dynamic = "force-dynamic";

function nairaFromKobo(kobo: number | string): string {
  return "₦" + (Number(kobo) / 100).toLocaleString("en-NG", { maximumFractionDigits: 0 });
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

const TABS = [
  { key: "ALL", label: "All" },
  { key: "ACTIVE", label: "Active" },
  { key: "PENDING", label: "Pending" },
  { key: "PAUSED", label: "Paused" },
  { key: "ENDED", label: "Ended" },
];

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const activeTab = (params.status || "ALL").toUpperCase();
  const campaigns = await listMyCampaigns();
  const filtered = activeTab === "ALL" ? campaigns : campaigns.filter((c) => c.status === activeTab);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-charcoal">Campaigns</h2>
          <p className="text-xs text-muted mt-0.5">{campaigns.length} total · {filtered.length} shown</p>
        </div>
        <Link
          href="/vendor/advertising/create"
          className="h-10 px-5 rounded bg-primary text-white text-sm font-bold flex items-center hover:bg-primary-hover transition-colors"
        >
          + Create Campaign
        </Link>
      </div>

      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {TABS.map((t) => {
          const active = t.key === activeTab;
          return (
            <Link
              key={t.key}
              href={`/vendor/advertising/campaigns?status=${t.key}`}
              className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-charcoal hover:text-primary"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      <div className="rounded-lg border border-border bg-white overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted">
            No campaigns in this view.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface text-xs uppercase text-muted">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Product</th>
                  <th className="text-left px-5 py-3 font-semibold">Type</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-right px-5 py-3 font-semibold">Budget</th>
                  <th className="text-right px-5 py-3 font-semibold">Spent</th>
                  <th className="text-right px-5 py-3 font-semibold">Impr.</th>
                  <th className="text-right px-5 py-3 font-semibold">Clicks</th>
                  <th className="text-right px-5 py-3 font-semibold">CPC</th>
                  <th className="text-left px-5 py-3 font-semibold">Dates</th>
                  <th className="text-right px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {c.product?.images?.[0]?.url && (
                          <img src={c.product.images[0].url} alt="" className="w-8 h-8 rounded object-cover" />
                        )}
                        <span className="font-medium text-charcoal truncate max-w-[180px]">
                          {c.product?.name || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-charcoal">{c.campaignType}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${STATUS_STYLE[c.status] || ""}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-charcoal">{nairaFromKobo(c.budgetKobo)}</td>
                    <td className="px-5 py-3 text-right text-charcoal">{nairaFromKobo(c.spendKobo)}</td>
                    <td className="px-5 py-3 text-right text-charcoal">{c.impressions.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-charcoal">{c.clicks.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-charcoal">{nairaFromKobo(c.costPerClickKobo)}</td>
                    <td className="px-5 py-3 text-xs text-charcoal whitespace-nowrap">
                      {fmtDate(c.startDate)} → {fmtDate(c.endDate)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <CampaignActions id={c.id} status={c.status} />
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