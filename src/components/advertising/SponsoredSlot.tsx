import { selectSponsoredForPlacement } from "@/lib/advertising/select-sponsored";
import { SponsoredProductCard } from "./SponsoredProductCard";

type Props = {
  placementSlug: string;
  categoryId?: string | null;
  keywords?: string[];
  limit?: number;
  title?: string;
};

/**
 * Server component. Renders a labeled "Sponsored" group.
 * If no campaigns are eligible, renders nothing (no empty box).
 */
export async function SponsoredSlot({
  placementSlug,
  categoryId,
  keywords,
  limit = 2,
  title = "Sponsored",
}: Props) {
  const hits = await selectSponsoredForPlacement({
    placementSlug,
    categoryId,
    keywords,
    limit,
  });

  if (hits.length === 0) return null;

  return (
    <section className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
          {title}
        </h3>
        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
          Ad
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {hits.map((h) => (
          <SponsoredProductCard
            key={h.campaignId}
            campaignId={h.campaignId}
            productSlug={h.productSlug}
            productName={h.productName}
            priceKobo={h.priceKobo}
            imageUrl={h.imageUrl}
            vendorName={h.vendorName}
          />
        ))}
      </div>
    </section>
  );
}