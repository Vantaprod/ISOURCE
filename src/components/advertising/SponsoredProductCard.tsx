"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type Props = {
  campaignId: string;
  productSlug: string;
  productName: string;
  priceKobo: number;
  imageUrl: string | null;
  vendorName: string | null;
};

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = sessionStorage.getItem("ad_sid");
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("ad_sid", sid);
  }
  return sid;
}

export function SponsoredProductCard({
  campaignId,
  productSlug,
  productName,
  priceKobo,
  imageUrl,
  vendorName,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const impressionFired = useRef(false);

  // Fire impression once, when the card enters the viewport
  useEffect(() => {
    if (!ref.current || impressionFired.current) return;
    const sid = getSessionId();
    if (!sid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !impressionFired.current) {
            impressionFired.current = true;
            fetch("/api/sponsored/impression", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ campaignId, sessionId: sid }),
            }).catch(() => {});
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [campaignId]);

  function handleClick() {
    const sid = getSessionId();
    if (!sid) return;
    // Fire-and-forget; navigation happens via Link
    fetch("/api/sponsored/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId, sessionId: sid }),
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <Link
      ref={ref}
      href={`/product/${productSlug}`}
      onClick={handleClick}
      className="group block rounded-lg border border-border bg-white p-3 hover:shadow-md transition-shadow relative"
    >
      {/* MANDATORY Sponsored label */}
      <span className="absolute top-2 right-2 inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 tracking-wide">
        Sponsored
      </span>

      <div className="aspect-square rounded-md bg-surface overflow-hidden mb-2">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted">
            No image
          </div>
        )}
      </div>

      <p className="text-xs text-muted truncate">{vendorName || "Isource"}</p>
      <p className="text-sm font-semibold text-charcoal line-clamp-2 group-hover:text-primary transition-colors">
        {productName}
      </p>
      <p className="text-sm font-extrabold text-primary mt-1">
        ₦{(priceKobo / 100).toLocaleString("en-NG")}
      </p>
    </Link>
  );
}