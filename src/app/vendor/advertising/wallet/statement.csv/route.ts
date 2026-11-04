import { getWalletTransactions } from "@/app/actions/advertising-wallet";
import { NextResponse } from "next/server";

export async function GET() {
  const txs = await getWalletTransactions(500);

  const header = "Date,Type,Amount_Naira,Balance_After_Naira,Reference,CampaignId\n";
  const rows = txs
    .map((t) => {
      const amtNaira = (Number(t.amountKobo) / 100).toFixed(2);
      const balNaira = (Number(t.balanceAfterKobo) / 100).toFixed(2);
      return [t.createdAt, t.type, amtNaira, balNaira, t.reference, t.campaignId || ""]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",");
    })
    .join("\n");

  return new NextResponse(header + rows, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="advertising-wallet-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}