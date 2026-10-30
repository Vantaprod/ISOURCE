"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import type { AdminRole } from "@prisma/client";

export async function assignAdminRole(targetUserId: string, role: AdminRole) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  // Only SUPER_ADMIN can assign roles
  const selfAdmin = await prisma.adminUser.findUnique({ where: { userId: session.userId } });
  if (!selfAdmin || selfAdmin.role !== "SUPER_ADMIN") throw new Error("Only Super Admins can manage admin roles");

  await prisma.user.update({ where: { id: targetUserId }, data: { role: "ADMIN" } });
  await prisma.adminUser.upsert({
    where: { userId: targetUserId },
    update: { role },
    create: { userId: targetUserId, role },
  });

  await logAudit("ROLE_ASSIGNED", "AdminUser", targetUserId, { role });
  revalidatePath("/admin/roles");
}