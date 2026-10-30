import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Shield } from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin — full access",
  ADMIN: "Administrator — standard admin",
  CATALOGUE_MANAGER: "Catalogue — products & categories",
  VENDOR_MANAGER: "Vendor — applications & stores",
  BRAND_OFFICER: "Brand — verification & claims",
  ORDER_MANAGER: "Orders — fulfillment & disputes",
  FINANCE_OFFICER: "Finance — payments & payouts",
  SUPPORT_OFFICER: "Support — customers & tickets",
  MARKETING_MANAGER: "Marketing — banners & campaigns",
};

export default async function AdminRolesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const me = await prisma.adminUser.findUnique({ where: { userId: session.userId } });
  if (!me || me.role !== "SUPER_ADMIN") {
    return (
      <div className="rounded-xl border border-warning/30 bg-warning/5 p-8 text-center">
        <Shield className="mx-auto text-warning mb-3" size={32} />
        <p className="font-bold">Only Super Admins can access this page</p>
        <p className="text-sm text-muted mt-1">Contact the platform owner to request elevated access.</p>
      </div>
    );
  }

  const admins = await prisma.adminUser.findMany({
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Admin Roles</h1>
        <p className="text-sm text-muted">Assign granular roles to platform operators.</p>
      </div>

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-muted text-xs uppercase font-bold">
            <tr>
              <th className="px-4 py-3">Admin</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Since</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {admins.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3 font-medium">{a.user.name}</td>
                <td className="px-4 py-3 text-muted">{a.user.email}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-0.5 rounded bg-charcoal text-white text-[10px] font-bold uppercase">{a.role.replace(/_/g, " ")}</span>
                </td>
                <td className="px-4 py-3 text-muted text-xs">{a.createdAt.toLocaleDateString("en-NG", { dateStyle: "medium" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="font-bold text-charcoal mb-3">Available Roles</h3>
        <ul className="space-y-2 text-sm">
          {Object.entries(ROLE_LABELS).map(([key, label]) => (
            <li key={key} className="flex gap-3"><span className="font-mono text-xs text-primary w-40">{key}</span><span className="text-muted">{label}</span></li>
          ))}
        </ul>
        <p className="text-xs text-muted mt-4">To assign a role, a Super Admin runs the CLI: <code className="bg-charcoal text-white px-2 py-0.5 rounded">npx tsx scripts/make-admin.ts email@example.com ROLE</code></p>
      </div>
    </div>
  );
}