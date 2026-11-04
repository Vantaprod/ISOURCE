"use client";

export function ReviewHighlights({ rating, reviewCount, categorySlug }: { rating: number, reviewCount: number, categorySlug: string }) {
  if (reviewCount === 0) return null;

  // Only show sizing bars for Fashion/Apparel/Shoes
  const showSizing = categorySlug?.toLowerCase().match(/(fashion|clothing|shoes|apparel|wear)/);

  // Dynamic Logic: Calculate sizing stats based on rating
  let trueToSize = 90, small = 5, large = 5;
  if (rating >= 4.5) { trueToSize = 94; small = 3; large = 3; }
  else if (rating >= 4.0) { trueToSize = 85; small = 8; large = 7; }
  else if (rating >= 3.0) { trueToSize = 70; small = 20; large = 10; }
  else { trueToSize = 50; small = 35; large = 15; }

  // Dynamic Logic: Generate tags based on rating
  const tags = [];
  if (rating >= 4.5) tags.push("Original Brand", "Fast Delivery", "Brand New", "Excellent Quality");
  else if (rating >= 4.0) tags.push("Fast Delivery", "Brand New", "Good Value");
  else tags.push("Delivery delayed", "Okay quality", "Value for money");

  return (
    <div className="mb-6">
      
      {/* SIZING BARS (Conditional) */}
      {showSizing && (
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-4 text-sm">
            <span className="w-24 text-charcoal">Small</span>
            <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden"><div className="h-full bg-charcoal" style={{ width: `${small}%` }} /></div>
            <span className="w-10 text-right text-charcoal font-medium">{small}%</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="w-24 text-charcoal font-bold">True to size</span>
            <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden"><div className="h-full bg-charcoal" style={{ width: `${trueToSize}%` }} /></div>
            <span className="w-10 text-right text-charcoal font-bold">{trueToSize}%</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="w-24 text-charcoal">Large</span>
            <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden"><div className="h-full bg-charcoal" style={{ width: `${large}%` }} /></div>
            <span className="w-10 text-right text-charcoal font-medium">{large}%</span>
          </div>
        </div>
      )}

      {/* TAGS (With proper margin bottom so they don't overlap) */}
      <div className="flex flex-wrap gap-2 pb-4">
        {tags.map((tag, i) => {
          const count = Math.max(1, Math.floor(reviewCount * (0.1 + (i * 0.05))));
          return (
            <button key={i} className="px-4 py-1.5 rounded-full border border-border text-xs font-medium text-charcoal hover:bg-surface transition-colors bg-white">
              {tag} ({count})
            </button>
          );
        })}
      </div>
    </div>
  );
}