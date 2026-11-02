"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PromoBanner } from "@prisma/client";

export function PromoSlider({ banners }: { banners: PromoBanner[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 2) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 2 >= banners.length ? 0 : prev + 2));
    }, 10000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const visible = banners.slice(index, index + 2);
  if (visible.length < 2 && banners.length > 1) {
      visible.push(banners[0]);
  }

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-6">
      <div className="grid md:grid-cols-2 gap-4">
        {visible.map((banner, i) => {
            let bg = "bg-primary text-white";
            let btn = "bg-white text-charcoal hover:bg-white/90";
            let sub = "text-white/90";

            if (banner.theme === "cream") {
                bg = "bg-[#FDF6ED] text-charcoal";
                btn = "bg-primary text-white hover:bg-primary-hover";
                sub = "text-charcoal/70";
            } else if (banner.theme === "charcoal") {
                bg = "bg-charcoal text-white";
                btn = "bg-primary text-white hover:bg-primary-hover";
                sub = "text-white/80";
            }

            return (
                <div key={`${banner.id}-${i}`} className={`relative rounded-xl overflow-hidden ${bg} flex items-center justify-between p-6 md:p-8 min-h-[170px] md:min-h-[200px]`}>
                    <div className="relative z-10 max-w-[60%]">
                        <h3 className="text-xl md:text-2xl font-bold leading-tight">{banner.title}</h3>
                        <p className={`mt-1 text-sm ${sub}`}>{banner.subtitle}</p>
                        <Link href={banner.ctaUrl} className={`inline-flex items-center gap-2 mt-4 h-9 px-4 rounded-md text-xs md:text-sm font-semibold ${btn} transition-colors`}>
                            {banner.ctaLabel} <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="relative w-[35%] h-[140px] md:h-[170px] flex-shrink-0">
                        <Image src={banner.imageUrl || "/images/placeholder.svg"} alt="" fill sizes="240px" className="object-contain opacity-90" unoptimized />
                    </div>
                </div>
            );
        })}
      </div>
    </section>
  );
}