"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { getInfiniteProducts } from "@/app/actions/feed";
import { ProductCard } from "@/components/product/ProductCard";
import { Loader2 } from "lucide-react";

export function InfiniteProductFeed() {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      // Fetch 10 items at a time (Marketplace style)
      const newProducts = await getInfiniteProducts(page, 10);
      
      if (newProducts.length === 0) {
        setHasMore(false);
      }
      
      setProducts((prev) => {
        const existingIds = new Set(prev.map(p => p.id));
        const uniqueNew = newProducts.filter(p => !existingIds.has(p.id));
        return [...prev, ...uniqueNew];
      });
      
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to load more", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pre-fetch logic: Trigger when user is 600px away from the bottom
  // This ensures the next batch is loaded BEFORE they finish scrolling
  const lastProductRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    }, {
      rootMargin: "600px" // LOAD 600PX EARLY (Marketplace trick)
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMore]);

  return (
    <div className="block md:hidden w-full bg-white pb-20">
      <div className="flex items-center justify-between px-3 py-4 sticky top-16 bg-white/90 backdrop-blur-md z-10 border-b border-border">
        <h2 className="text-lg font-extrabold text-charcoal flex items-center gap-2">
          Just For You 
        </h2>
      </div>

      {/* MASONRY LAYOUT: 2 columns, tight spacing, infinite cards */}
      <div className="columns-2 gap-2 px-2 pt-2">
        {products.map((product, index) => {
          const isLast = products.length === index + 1;
          return (
            <div 
              key={product.id} 
              ref={isLast ? lastProductRef : null}
              className="mb-2 break-inside-avoid"
            >
              {/* We wrap ProductCard in a div to force image aspect ratio */}
              <div className="rounded-lg overflow-hidden border border-border/50 bg-white shadow-sm">
                <ProductCard product={product} />
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-6 text-muted gap-2">
          <Loader2 className="animate-spin text-primary" size={24} />
          <span className="text-xs font-medium">Finding more great deals...</span>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div className="text-center py-10 text-muted text-xs font-medium border-t border-border mx-4 mt-4">
          You've seen it all! Check back later for new arrivals.
        </div>
      )}
    </div>
  );
}