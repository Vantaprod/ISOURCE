import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function logAudit(action: string, entityType: string, entityId?: string, metadata?: Record<string, unknown>) {
  try {
    const session = await getSession();
    if (!session) return;
    await prisma.auditLog.create({
      data: {
        actorId: session.userId,
        actorEmail: session.email,
        actorRole: session.role,
        action,
        entityType,
        entityId,
        metadata: metadata as Record<string, unknown> | undefined,
      },
    });
  } catch (err) {
    console.error("Audit log failed:", err);
  }
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");
  return session;
}

export async function requireAdminRole(allowed: string[]) {
  const session = await requireAdmin();
  if (session.role === "ADMIN" && session.email) {
    // Check AdminUser record for granular role
    const admin = await prisma.adminUser.findUnique({ where: { userId: session.userId } });
    if (admin) {
      if (admin.role === "SUPER_ADMIN") return { session, admin };
      if (!allowed.includes(admin.role)) throw new Error("Insufficient permissions");
      return { session, admin };
    }
  }
  return { session, admin: null };
}