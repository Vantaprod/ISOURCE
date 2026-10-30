import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CreateCampaignForm } from "./CreateCampaignForm";

export default async function AdminCampaignsPage() {
  const [campaigns, banners] = await Promise.all([
    prisma.campaign.findMany({ orderBy: { startDate: "desc" }, include: { banner: true } }),
    prisma.heroBanner.findMany({ where: { isActive: true }, orderBy: { position: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Campaigns</h1>
        <p className="text-sm text-muted">Seasonal campaigns that display a themed banner on the storefront.</p>
      </div>

      <CreateCampaignForm banners={banners.map(b => ({ id: b.id, title: b.title }))} />

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-muted text-xs uppercase font-bold">
            <tr><th className="px-4 py-3">Campaign</th><th className="px-4 py-3">Dates</th><th className="px-4 py-3">Theme</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {campaigns.map((c) => {
              const now = new Date();
              const isLive = c.isActive && c.startDate <= now && c.endDate >= now;
              return (
                <tr key={c.id}>
                  <td className="px-4 py-3"><p className="font-medium">{c.name}</p>{c.banner && <p className="text-xs text-muted">Banner: {c.banner.title}</p>}</td>
                  <td className="px-4 py-3 text-xs text-muted">{c.startDate.toLocaleDateString("en-NG")} – {c.endDate.toLocaleDateString("en-NG")}</td>
                  <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 text-xs"><span className="h-3 w-3 rounded-full" style={{ background: c.themeColor }} /> {c.themeColor}</span></td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isLive ? "bg-success/10 text-success" : c.isActive ? "bg-warning/10 text-warning" : "bg-muted/10 text-muted"}`}>{isLive ? "LIVE" : c.isActive ? "SCHEDULED/EXPIRED" : "INACTIVE"}</span></td>
                  <td className="px-4 py-3 text-right"><Link href={`/admin/campaigns/${c.id}/edit`} className="text-xs text-primary hover:underline">Edit →</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {campaigns.length === 0 && <p className="p-8 text-center text-sm text-muted">No campaigns yet.</p>}
      </div>
    </div>
  );
}