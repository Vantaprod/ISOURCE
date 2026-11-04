"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function markNotificationRead(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  await prisma.notification.updateMany({
    where: { id, userId: session.userId },
    data: { isRead: true },
  });
  revalidatePath("/account/notifications");
}

export async function markAllNotificationsRead() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  await prisma.notification.updateMany({
    where: { userId: session.userId, isRead: false },
    data: { isRead: true },
  });
  revalidatePath("/account/notifications");
}

export async function getUnreadCount() {
  const session = await getSession();
  if (!session) return 0;
  return prisma.notification.count({
    where: { userId: session.userId, isRead: false },
  });
}