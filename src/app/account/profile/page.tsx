import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { User, Mail, Phone, Shield } from "lucide-react";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId }
  });

  if (!user) redirect("/login");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">My Profile</h1>
        <p className="text-sm text-muted">Manage your personal information.</p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 space-y-6">
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-lg font-bold text-charcoal">{user.name || "User"}</h2>
            
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Full Name</label>
            <div className="flex items-center gap-2 text-sm font-medium text-charcoal bg-surface p-3 rounded-md border border-border">
              <User size={16} className="text-muted" /> {user.name || "Not provided"}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Email Address</label>
            <div className="flex items-center gap-2 text-sm font-medium text-charcoal bg-surface p-3 rounded-md border border-border">
              <Mail size={16} className="text-muted" /> {user.email}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Phone Number</label>
            <div className="flex items-center gap-2 text-sm font-medium text-charcoal bg-surface p-3 rounded-md border border-border">
              <Phone size={16} className="text-muted" /> {user.phone || "Not provided"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}