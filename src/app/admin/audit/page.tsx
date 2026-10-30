import { prisma } from "@/lib/prisma";
import { ShieldAlert } from "lucide-react";
import { format } from "date-fns";

export default async function AdminAuditPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldAlert size={24} className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Audit Log</h1>
          <p className="text-sm text-muted">Every privileged action is recorded here.</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        {logs.length === 0 ? (
          <p className="p-8 text-sm text-muted text-center">No audit events yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted text-xs uppercase font-bold">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-surface/30">
                  <td className="px-4 py-2 text-xs text-muted whitespace-nowrap">{format(new Date(l.createdAt), "dd MMM HH:mm")}</td>
                  <td className="px-4 py-2 text-xs">{l.actorEmail}</td>
                  <td className="px-4 py-2"><span className="inline-flex px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase">{l.action}</span></td>
                  <td className="px-4 py-2 text-xs text-muted">{l.entityType}{l.entityId ? ` · ${l.entityId.slice(0, 8)}` : ""}</td>
                  <td className="px-4 py-2 text-xs text-muted truncate max-w-[200px]">{l.metadata ? JSON.stringify(l.metadata).slice(0, 80) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}