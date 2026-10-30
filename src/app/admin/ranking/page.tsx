import { getRankingConfig } from "@/lib/ranking";
import { RankingForm } from "./RankingForm";

export default async function AdminRankingPage() {
  const config = await getRankingConfig();
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Organic Ranking</h1>
        <p className="text-sm text-muted">Configure the weights used to rank products in search and category pages. Higher weight = more influence. Sponsored products are <strong>always labeled and inserted separately</strong> — these weights only affect organic results.</p>
      </div>
      <RankingForm config={config} />
      <div className="rounded-xl border border-border bg-surface p-5 text-sm text-muted">
        <p className="font-bold text-charcoal mb-2">How scoring works</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Relevance</strong> — exact match &gt; prefix &gt; contains &gt; word overlap.</li>
          <li><strong>Sales</strong> — normalized order volume vs. top product in the result set.</li>
          <li><strong>Conversion</strong> — approximated by review count / 100.</li>
          <li><strong>Rating</strong> — customer star rating (0–5) normalized.</li>
          <li><strong>Stock</strong> — 1 if in stock, 0 otherwise.</li>
          <li><strong>Delivery</strong> — vendor fulfillment performance (default 1 for all).</li>
          <li><strong>Completeness</strong> — has image, has specs, description ≥ 50 chars.</li>
        </ul>
      </div>
    </div>
  );
}