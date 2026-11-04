"use server";
import { prisma } from "@/lib/prisma";

export async function getPickupStationsByState(state: string) {
  return prisma.pickupStation.findMany({
    where: { isActive: true, zone: { states: { has: state } } },
    select: { id: true, name: true, address: true, zone: { select: { name: true } } },
    orderBy: { name: "asc" },
  });
}