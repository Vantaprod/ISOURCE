"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import type { UserRole } from "@prisma/client";

export async function updateUserRole(userId: string, role: UserRole) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}