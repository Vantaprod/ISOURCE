import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Activity, ShieldCheck, Store, Image as ImageIcon, Layers, Palette } from "lucide-react";

export const dynamic = "force-dynamic";

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  "banner.create":            { label: "Banner Uploaded",       color: "bg-blue-100 text-blue-700" },
  "banner.toggle":            { label: "Banner Visibility",     color: "bg-gray-100 text-gray-700" },
  "banner.delete":            { label: "Banner Deleted",        color: "bg-red-100 text-red-700" },
  "admin.banner.approve":     { label: "Admin Approved Banner", color: "bg-green-100 text-green-700" },
  "admin.banner.reject":      { label: "Admin Rejected Banner", color: "bg-red-100 text-red-700" },
  "collection.create":        { label: "Collection Created",    color: "bg-blue-100 text-blue-700" },
  "collection.update":        { label: "Collection Updated",    color: "bg-gray-100 text-gray-700" },
  "collection.delete":        { label: "Collection Deleted",    color: "bg-red-100 text-red-700" },
  "collection.products.update":{ label: "Collection Products",  color: "bg-blue-100 text-blue-700" },
  "admin.collection.approve": { label: "Admin Approved Collection", color: "bg-green-100 text-green-700" },
  "admin.collection.reject":  { label: "Admin Rejected Collection", color: "bg-red-100 text-red-700" },
  "sections.reorder":         { label: "Sections Reordered",    color: "bg-gray-100 text-gray-700" },
  "theme.update":             { label: "Theme Updated",         color: "bg-purple-100 text-purple-700" },
};

const ENTITY_ICONS: Record<string, any> = {
  StoreBanner: ImageIcon,
  StoreCollection: Layers,
  StoreTheme: Palette,
  StoreSection: Activity,
};

export default async function StoreAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; role?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const filterAction = sp.action || "";
  const filterRole = sp.role || "";
  const page = parseInt(sp.page || "1");
  const pageSize = 50;
  const skip = (page - 1) * pageSize;

  const where: any = {};
  if (filterAction) where.action = filterAction;
  if (filterRole) where.actorRole = filterRole;

  const [logs, total, allActions] = await Promise.all([
    prisma.storeAuditLog.findMany({
      where,
      include: { vendor: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.storeAuditLog.count({ where }),
    prisma.storeAuditLog.groupBy({ by: ["action"], _count: { action: true } }),
  ]);

  const totalPages = Math.ceil(total / pageSize);
  const actionSummary = allActions.map(a => ({ action: a.action, count: a._count.action }));

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
            <Activity size={22} /> Store Audit Log
          </h1>
          <p className="text-sm text-muted">
            Complete record of every store action — vendor uploads, admin approvals, theme changes.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="font-bold text-charcoal">{total}</span> total entries
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4 flex flex-wrap gap-3 items-center">
        <span className="text-xs font-bold text-charcoal uppercase">Filter by:</span>

        <Link href="/admin/store-audit" className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${!filterAction && !filterRole ? "bg-primary text-white border-primary" : "border-border hover:bg-surface"}`}>
          All
        </Link>

        <Link href="/admin/store-audit?role=ADMIN" className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${filterRole === "ADMIN" ? "bg-primary text-white border-primary" : "border-border hover:bg-surface"}`}>
          <ShieldCheck size={12} className="inline mr-1" /> Admin Only
        </Link>

        <Link href="/admin/store-audit?role=VENDOR" className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${filterRole === "VENDOR" ? "bg-primary text-white border-primary" : "border-border hover:bg-surface"}`}>
          <Store size={12} className="inline mr-1" /> Vendor Only
        </Link>

        <div className="w-px h-6 bg-border" />

        {actionSummary.slice(0, 6).map((a) => (
          <Link key={a.action}
            href={`/admin/store-audit?action=${encodeURIComponent(a.action)}`}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${filterAction === a.action ? "bg-primary text-white border-primary" : "border-border hover:bg-surface"}`}
          >
            {ACTION_LABELS[a.action]?.label || a.action} ({a.count})
          </Link>
        ))}
      </div>

      {/* Log List */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-12 text-center text-muted text-sm">
            <Activity size={32} className="mx-auto mb-3 opacity-40" />
            <p>No audit entries match your filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {logs.map((log) => {
              const meta = ACTION_LABELS[log.action] || { label: log.action, color: "bg-gray-100 text-gray-700" };
              const Icon = ENTITY_ICONS[log.entityType] || Activity;
              return (
                <div key={log.id} className="p-4 hover:bg-surface/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${meta.color}`}>
                      <Icon size={18} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${meta.color}`}>
                          {meta.label}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${log.actorRole === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                          {log.actorRole}
                        </span>
                        <span className="text-xs text-muted">{new Date(log.createdAt).toLocaleString()}</span>
                      </div>

                      <p className="text-sm text-charcoal">
                        <Link href={`/brand/${log.vendor.slug}`} className="font-bold text-primary hover:underline">
                          {log.vendor.name}
                        </Link>{" "}
                        <span className="text-muted">·</span>{" "}
                        <span className="text-muted">{log.entityType}</span>
                      </p>

                      {log.metadata && Object.keys(log.metadata as any).length > 0 && (
                        <div className="mt-2 bg-surface rounded-md p-2 text-xs font-mono text-charcoal/80 overflow-x-auto">
                          {Object.entries(log.metadata as any).map(([k, v]) => (
                            <div key={k}>
                              <span className="text-muted">{k}:</span> {typeof v === "object" ? JSON.stringify(v) : String(v)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-muted/60 shrink-0">
                      {log.id.slice(-8)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/admin/store-audit?${filterAction ? `action=${filterAction}&` : ""}${filterRole ? `role=${filterRole}&` : ""}page=${page - 1}`}
              className="h-9 px-4 rounded-md border border-border text-sm font-bold hover:bg-surface"
            >
              ← Prev
            </Link>
          )}
          <span className="text-sm text-muted">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <Link
              href={`/admin/store-audit?${filterAction ? `action=${filterAction}&` : ""}${filterRole ? `role=${filterRole}&` : ""}page=${page + 1}`}
              className="h-9 px-4 rounded-md border border-border text-sm font-bold hover:bg-surface"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}