import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildIdempotencyKey,
  hashIp,
  hashUa,
  isValidSessionId,
} from "@/lib/advertising/idempotency";
import { recordImpression } from "@/lib/advertising/wallet";

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
      select: { productId: true, isActive: true },
    });
    if (!campaign || !campaign.isActive) {
      return NextResponse.json({ ok: false, reason: "campaign_inactive" }, { status: 400 });
    }

    const idempotencyKey = buildIdempotencyKey({
      campaignId: body.campaignId,
      eventType: "IMPRESSION",
      sessionId: body.sessionId,
      productId: campaign.productId,
    });

    const result = await recordImpression({
      campaignId: body.campaignId,
      sessionId: body.sessionId,
      ipHash,
      uaHash,
      idempotencyKey,
      productId: campaign.productId,
    });

    return NextResponse.json(
      { ok: result.ok, reason: result.reason },
      { status: result.ok ? 200 : result.reason === "duplicate" ? 200 : 400 },
    );
  } catch (err) {
    console.error("[sponsored/impression]", err);
    return NextResponse.json({ ok: false, reason: "internal_error" }, { status: 500 });
  }
}