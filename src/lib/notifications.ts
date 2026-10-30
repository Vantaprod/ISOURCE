import { prisma } from "@/lib/prisma";

export async function createNotification(userId: string, title: string, message: string, type: "INFO" | "SUCCESS" | "WARNING" | "ALERT" = "INFO", link?: string) {
  try {
    await prisma.notification.create({ data: { userId, title, message, type, link } });
  } catch (err) {
    console.error("Failed to create notification:", err);
  }
}