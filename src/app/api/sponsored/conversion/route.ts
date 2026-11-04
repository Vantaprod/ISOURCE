import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildIdempotencyKey,
  hashIp,
  hashUa,
  isValidSessionId,
} from "@/lib/advertising/idempotency";
import { recordConversion } from "@/lib/advertising/wallet";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (
      !body ||
      typeof body.campaignId !== "string" ||
      !isValidSessionId(body.sessionId) ||
      typeof body.revenueKobo !== "number" ||
      body.revenueKobo <= 0
    ) {
      return NextResponse.json({ ok: false, reason: "invalid_payload" }, { status: 400 });
    }

    const ua = req.headers.get("user-agent") || "";
    const ipRaw =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "0.0.0.0";
    const ipHash = hashIp(ipRaw);
    const uaHash = hashUa(ua);

    const campaign = await prisma.sponsoredCampaign.findUnique({
      where: { id: body.campaignId },
      select: { productId: true },
    });
    if (!campaign) {
      return NextResponse.json({ ok: false, reason: "campaign_not_found" }, { status: 404 });
    }

    const idempotencyKey = buildIdempotencyKey({
      campaignId: body.campaignId,
      eventType: "CONVERSION",
      sessionId: body.sessionId,
      productId: campaign.productId,
    });

    const result = await recordConversion({
      campaignId: body.campaignId,
      sessionId: body.sessionId,
      ipHash,
      uaHash,
      idempotencyKey,
      productId: campaign.productId,
      revenueKobo: Math.round(body.revenueKobo),
    });

    return NextResponse.json({ ok: result.ok, reason: result.reason });
  } catch (err) {
    console.error("[sponsored/conversion]", err);
    return NextResponse.json({ ok: false, reason: "internal_error" }, { status: 500 });
  }
}