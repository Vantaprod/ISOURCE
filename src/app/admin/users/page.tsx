import { prisma } from "@/lib/prisma";
import { UserRow } from "./UserRow";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { vendor: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Platform Users</h1>
        <p className="text-sm text-muted">Manage roles and access for all registered accounts.</p>
      </div>

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <UserRow key={u.id} user={{
                  id: u.id,
                  name: u.name || "N/A",
                  email: u.email,
                  joined: u.createdAt.toISOString(),
                  role: u.role,
                  hasVendorProfile: !!u.vendor
                }} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}