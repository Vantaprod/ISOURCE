"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function updateRankingWeights(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  const data = {
    relevanceWeight: Number(formData.get("relevanceWeight") || 30),
    salesWeight: Number(formData.get("salesWeight") || 25),
    conversionWeight: Number(formData.get("conversionWeight") || 10),
    ratingWeight: Number(formData.get("ratingWeight") || 15),
    stockWeight: Number(formData.get("stockWeight") || 10),
    deliveryWeight: Number(formData.get("deliveryWeight") || 5),
    completenessWeight: Number(formData.get("completenessWeight") || 5),
  };

  await prisma.rankingConfig.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  await logAudit("RANKING_WEIGHTS_UPDATED", "RankingConfig", "singleton", data);
  revalidatePath("/admin/ranking");
  revalidatePath("/search");
  revalidatePath("/category", "layout");
}