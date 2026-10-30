import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { campaignId } = await req.json();
    if (!campaignId) return NextResponse.json({ ok: false });

    const campaign = await prisma.sponsoredCampaign.findUnique({ where: { id: campaignId } });
    if (!campaign) return NextResponse.json({ ok: false });

    const newSpend = campaign.spendKobo + campaign.costPerClickKobo;
    const overBudget = campaign.budgetKobo > 0 && newSpend > campaign.budgetKobo;

    await prisma.sponsoredCampaign.update({
      where: { id: campaignId },
      data: {
        clicks: { increment: 1 },
        spendKobo: { increment: campaign.costPerClickKobo },
        isActive: overBudget ? false : campaign.isActive,
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}