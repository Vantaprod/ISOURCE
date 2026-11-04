import { prisma } from "@/lib/prisma";

interface NotifyInput {
  userId: string;
  title: string;
  message: string;
  type?: "ORDER" | "PAYMENT" | "REFUND" | "MODERATION" | "SYSTEM" | "WELCOME";
  linkUrl?: string;
}

/**
 * Create an in-app notification. Never throws.
 */
export async function notify(input: NotifyInput) {
  try {
    await prisma.notification.create({
      data: {
        userId: input.userId,
        title: input.title,
        message: input.message,
        type: input.type ?? "SYSTEM",
        linkUrl: input.linkUrl ?? null,
      },
    });
  } catch (err) {
    console.error("[NOTIFY] Failed:", err);
  }
}

/**
 * Find the vendor's userId from their vendorId. Helper for vendor notifications.
 */
export async function getVendorUserId(vendorId: string): Promise<string | null> {
  try {
    const v = await prisma.vendor.findUnique({
      where: { id: vendorId },
      select: { userId: true },
    });
    return v?.userId ?? null;
  } catch {
    return null;
  }
}