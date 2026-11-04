import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ModerationButtons } from "./ModerationButtons";
import { ShieldCheck, Image as ImageIcon, Layers, AlertCircle, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ModerationDashboard() {
  const [pendingBanners, pendingCollections, recentBanners, recentCollections] = await Promise.all([
    prisma.storeBanner.findMany({
      where: { approvalStatus: "PENDING" },
      include: { vendor: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.storeCollection.findMany({
      where: { approvalStatus: "PENDING" },
      include: { vendor: { select: { name: true, slug: true } }, _count: { select: { products: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.storeBanner.findMany({
      where: { approvalStatus: { in: ["APPROVED", "REJECTED"] } },
      include: { vendor: { select: { name: true, slug: true } } },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
    prisma.storeCollection.findMany({
      where: { approvalStatus: { in: ["APPROVED", "REJECTED"] } },
      include: { vendor: { select: { name: true, slug: true } }, _count: { select: { products: true } } },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
  ]);

  const statusColor = (s: string) =>
    s === "APPROVED" ? "bg-green-100 text-green-700" :
    s === "REJECTED" ? "bg-red-100 text-red-700" :
    "bg-orange-100 text-orange-700";

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
          <ShieldCheck size={22} /> Store Content Moderation
        </h1>
        <p className="text-sm text-muted">
          Review vendor-submitted banners and collections. Only APPROVED content appears on public storefronts.
        </p>
      </div>

      {/* ─── Pending Queue ─── */}
      <section>
        <h2 className="font-bold text-charcoal text-lg mb-3 flex items-center gap-2">
          <AlertCircle size={18} className="text-orange-500" /> Pending Review
          <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
            {pendingBanners.length + pendingCollections.length}
          </span>
        </h2>

        {pendingBanners.length === 0 && pendingCollections.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-white p-8 text-center text-muted text-sm">
            ✅ Nothing waiting for review. All caught up!
          </div>
        ) : (
          <div className="space-y-3">
            {/* Pending Banners */}
            {pendingBanners.map((b) => (
              <div key={b.id} className="bg-white rounded-xl border border-border p-4 flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-56 h-32 shrink-0 rounded-lg overflow-hidden bg-surface">
                  <img src={b.desktopUrl} alt="Banner" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded">BANNER</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${statusColor(b.approvalStatus)}`}>{b.approvalStatus}</span>
                    <span className="text-xs text-muted">{new Date(b.createdAt).toLocaleString()}</span>
                  </div>
                  <h3 className="font-bold text-charcoal">{b.heading || "Untitled Banner"}</h3>
                  <p className="text-sm text-muted line-clamp-2 mb-2">{b.description || "No description"}</p>
                  <p className="text-xs text-muted">
                    From: <Link href={`/brand/${b.vendor.slug}`} target="_blank" className="font-bold text-primary hover:underline inline-flex items-center gap-1">
                      {b.vendor.name} <ExternalLink size={10} />
                    </Link>
                  </p>
                </div>
                <ModerationButtons id={b.id} type="banner" currentStatus={b.approvalStatus as any} />
              </div>
            ))}

            {/* Pending Collections */}
            {pendingCollections.map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-border p-4 flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-56 h-32 shrink-0 rounded-lg overflow-hidden bg-surface flex items-center justify-center">
                  {c.imageUrl ? (
                    <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    <Layers size={32} className="text-muted" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">COLLECTION</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${statusColor(c.approvalStatus)}`}>{c.approvalStatus}</span>
                    <span className="text-xs text-muted">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <h3 className="font-bold text-charcoal">{c.name}</h3>
                  <p className="text-sm text-muted line-clamp-2 mb-2">{c.description || "No description"}</p>
                  <p className="text-xs text-muted">{c._count.products} products · From{" "}
                    <Link href={`/brand/${c.vendor.slug}`} target="_blank" className="font-bold text-primary hover:underline inline-flex items-center gap-1">
                      {c.vendor.name} <ExternalLink size={10} />
                    </Link>
                  </p>
                </div>
                <ModerationButtons id={c.id} type="collection" currentStatus={c.approvalStatus as any} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── Recent Decisions ─── */}
      <section>
        <h2 className="font-bold text-charcoal text-lg mb-3">Recent Decisions</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {[...recentBanners.map(b => ({ ...b, kind: "banner" as const })), ...recentCollections.map(c => ({ ...c, kind: "collection" as const }))]
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 6)
            .map((item: any) => (
              <div key={item.id} className="bg-white rounded-lg border border-border p-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded bg-surface shrink-0 flex items-center justify-center overflow-hidden">
                  {item.kind === "banner" ? <ImageIcon size={16} className="text-muted" /> : <Layers size={16} className="text-muted" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-charcoal truncate">{item.heading || item.name}</p>
                  <p className="text-xs text-muted truncate">{item.vendor.name}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${statusColor(item.approvalStatus)}`}>{item.approvalStatus}</span>
              </div>
            ))}
          {recentBanners.length + recentCollections.length === 0 && (
            <p className="text-sm text-muted col-span-full">No decisions yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}