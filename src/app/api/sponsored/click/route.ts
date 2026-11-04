import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildIdempotencyKey,
  hashIp,
  hashUa,
  isValidSessionId,
} from "@/lib/advertising/idempotency";
import { chargeClick } from "@/lib/advertising/wallet";

const BOT_UA_PATTERNS = [/bot/i, /crawler/i, /spider/i, /headless/i, /phantom/i, /selenium/i];

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body.campaignId !== "string" || !isValidSessionId(body.sessionId)) {
      return NextResponse.json({ ok: false, reason: "invalid_payload" }, { status: 400 });
    }

    const ua = req.headers.get("user-agent") || "";
    if (BOT_UA_PATTERNS.some((p) => p.test(ua))) {
      return NextResponse.json({ ok: false, reason: "bot" }, { status: 403 });
    }

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

    // Rate limit: max 5 clicks per IP per minute
    const minuteAgo = new Date(Date.now() - 60_000);
    const recent = await prisma.sponsoredEvent.count({
      where: { ipHash, eventType: "CLICK", createdAt: { gte: minuteAgo } },
    });
    if (recent >= 5) {
      return NextResponse.json({ ok: false, reason: "rate_limited" }, { status: 429 });
    }

    const idempotencyKey = buildIdempotencyKey({
      campaignId: body.campaignId,
      eventType: "CLICK",
      sessionId: body.sessionId,
      productId: campaign.productId,
    });

    const result = await chargeClick({
      campaignId: body.campaignId,
      sessionId: body.sessionId,
      ipHash,
      uaHash,
      idempotencyKey,
      productId: campaign.productId,
    });

    if (!result.ok) {
      const status = result.reason === "duplicate" ? 200 : 400;
      return NextResponse.json({ ok: false, reason: result.reason }, { status });
    }

    return NextResponse.json({
      ok: true,
      eventId: result.eventId,
      chargedKobo: result.chargedKobo,
    });
  } catch (err) {
    console.error("[sponsored/click]", err);
    return NextResponse.json({ ok: false, reason: "internal_error" }, { status: 500 });
  }
}