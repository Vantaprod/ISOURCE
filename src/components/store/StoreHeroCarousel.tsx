"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  id: string;
  desktopUrl: string;
  mobileUrl: string | null;
  heading: string | null;
  description: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
}

export function StoreHeroCarousel({ banners, accent }: { banners: Banner[]; accent?: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;
  const current = banners[active];

  const ctaStyle = accent ? { backgroundColor: accent } : undefined;
  const ctaClass = accent
    ? "inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-bold text-white transition-opacity hover:opacity-90"
    : "inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-bold text-white hover:bg-primary-hover transition-colors";

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-surface md:aspect-[1920/600] aspect-[4/3]">
      <div className="absolute inset-0">
        <Image src={current.desktopUrl} alt={current.heading || "Store Banner"} fill className="object-cover hidden md:block" priority />
        <Image src={current.mobileUrl || current.desktopUrl} alt={current.heading || "Store Banner"} fill className="object-cover md:hidden" priority />
      </div>

      {(current.heading || current.description || current.ctaLabel) && (
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
          <div className="px-8 md:px-16 max-w-lg">
            {current.heading && (
              <h2 className="text-2xl md:text-5xl font-extrabold text-white leading-tight mb-3">{current.heading}</h2>
            )}
            {current.description && (
              <p className="text-sm md:text-lg text-white/90 mb-5">{current.description}</p>
            )}
            {current.ctaLabel && current.ctaUrl && (
              <Link href={current.ctaUrl} className={ctaClass} style={ctaStyle}>
                {current.ctaLabel}
              </Link>
            )}
          </div>
        </div>
      )}

      {banners.length > 1 && (
        <>
          <button onClick={() => setActive((prev) => (prev - 1 + banners.length) % banners.length)} className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white shadow-lg transition-colors" aria-label="Previous banner">
            <ChevronLeft size={20} className="text-charcoal" />
          </button>
          <button onClick={() => setActive((prev) => (prev + 1) % banners.length)} className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white shadow-lg transition-colors" aria-label="Next banner">
            <ChevronRight size={20} className="text-charcoal" />
          </button>
        </>
      )}

      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} className={`h-2 rounded-full transition-all ${i === active ? "w-8 bg-white" : "w-2 bg-white/60"}`} aria-label={`Go to banner ${i + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
}