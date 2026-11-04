import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

interface AuditInput {
  action: string;
  entityType: string;
  entityId: string;
  vendorId: string;
  metadata?: Record<string, unknown>;
}

/**
 * Write an audit log entry.
 * Never throws — logging failures should not break business operations.
 */
export async function logAudit(input: AuditInput): Promise<void> {
  try {
    const session = await getSession();
    if (!session) {
      // Anonymous action (e.g. during seed) — skip audit
      return;
    }
    await prisma.storeAuditLog.create({
      data: {
        actorId: session.userId,
        actorRole: session.role,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        vendorId: input.vendorId,
        metadata: (input.metadata as any) ?? null,
      },
    });
  } catch (err) {
    console.error("[AUDIT] Failed to write log:", err);
  }
}