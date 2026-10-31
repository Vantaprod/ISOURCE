import { User, Mail, Phone, Shield } from "lucide-react";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">My Profile</h1>
        <p className="text-sm text-muted mt-1">Manage your personal information and account security.</p>
      </div>
      <div className="rounded-xl border border-border bg-white p-6 md:p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-20 w-20 rounded-full bg-surface border border-border flex items-center justify-center">
            <User size={32} className="text-muted" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-charcoal">{user.name}</h2>
            <p className="text-sm text-muted">Customer Account</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-muted uppercase mb-2">Full Name</label>
            <div className="flex items-center gap-3 h-11 px-4 rounded-lg border border-border bg-surface">
              <User size={16} className="text-muted" />
              <span className="text-sm text-charcoal">{user.name}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-muted uppercase mb-2">Email Address</label>
            <div className="flex items-center gap-3 h-11 px-4 rounded-lg border border-border bg-surface">
              <Mail size={16} className="text-muted" />
              <span className="text-sm text-charcoal">{user.email}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-muted uppercase mb-2">Phone Number</label>
            <div className="flex items-center gap-3 h-11 px-4 rounded-lg border border-border bg-surface">
              <Phone size={16} className="text-muted" />
              <span className="text-sm text-charcoal">{user.phone || "Not provided"}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-muted uppercase mb-2">Account Role</label>
            <div className="flex items-center gap-3 h-11 px-4 rounded-lg border border-border bg-surface">
              <Shield size={16} className="text-muted" />
              <span className="text-sm text-charcoal capitalize">{user.role.toLowerCase()}</span>
            </div>
          </div>
        </div>
        <div className="mt-8 p-4 rounded-lg bg-warning/10 border border-warning/20 text-sm text-charcoal">
          <strong>Note:</strong> Profile editing is coming in a future update. If you need to change your email or password, please contact support.
        </div>
      </div>
    </div>
  );
}