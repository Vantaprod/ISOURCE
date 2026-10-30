import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { campaignId } = await req.json();
    if (!campaignId) return NextResponse.json({ ok: false });
    await prisma.sponsoredCampaign.update({
      where: { id: campaignId },
      data: { impressions: { increment: 1 } },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}