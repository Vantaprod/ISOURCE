import Link from "next/link";
import { getAllCampaigns } from "@/app/actions/admin-advertising";
import { AdminCampaignActions } from "./AdminCampaignActions";

export const dynamic = "force-dynamic";

function naira(kobo: number) { return "₦" + (kobo / 100).toLocaleString("en-NG", { maximumFractionDigits: 0 }); }
function fmtDate(d: Date | string) { return new Date(d).toLocaleDateString("en-NG", { dateStyle: "medium" }); }

export default async function AdminCampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status || "ALL";
  let campaigns = await getAllCampaigns();

  if (statusFilter !== "ALL") {
    campaigns = campaigns.filter(c => c.status === statusFilter);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {["ALL", "PENDING", "ACTIVE", "PAUSED", "REJECTED"].map(s => (
          <Link key={s} href={`/admin/advertising/campaigns?status=${s}`} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${statusFilter === s ? "bg-charcoal text-white" : "bg-surface text-charcoal border border-border hover:border-charcoal"}`}>
            {s}
          </Link>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-white overflow-hidden">
        {campaigns.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted">No campaigns found for this filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface text-xs uppercase text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Budget / Spend</th>
                  <th className="px-5 py-3 font-semibold text-right">Metrics</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {c.product?.images?.[0]?.url && <img src={c.product.images[0].url} className="w-8 h-8 rounded object-cover" />}
                        <span className="font-medium truncate max-w-[200px]">{c.product?.name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs">{c.campaignType}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        c.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                        c.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                        c.status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                      }`}>{c.status}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="text-charcoal font-medium">{naira(c.budgetKobo)}</div>
                      <div className="text-xs text-muted">Spent: {naira(c.spendKobo)}</div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="text-charcoal">{c.clicks} clicks</div>
                      <div className="text-xs text-muted">{c.impressions} impr.</div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <AdminCampaignActions id={c.id} status={c.status} />
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