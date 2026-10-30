"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function reviewRefund(refundId: string, decision: "APPROVED" | "REJECTED", notes: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  const refund = await prisma.refund.findUnique({ where: { id: refundId } });
  if (!refund) throw new Error("Refund not found");

  await prisma.refund.update({
    where: { id: refundId },
    data: { status: decision, reviewedBy: session.userId, adminNotes: notes, processedAt: new Date() },
  });

  revalidatePath("/admin/refunds");
}