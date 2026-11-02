"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Truck, ShieldCheck, RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroBanner } from "@prisma/client";

export function HeroSlider({ banners }: { banners: HeroBanner[] }) {
  const [current, setCurrent] = useState(0);

  // Auto-play logic
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 10000); // Changes every 10 seconds
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const nextSlide = () => setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1440px] px-4 pt-4 md:pt-6">
        <div className="grid lg:grid-cols-[1fr_280px] gap-4">
          
          {/* Main Slider Area */}
          <div className="relative rounded-xl overflow-hidden border border-border group bg-[#FDF6ED]">
            
            {/* Slides Container */}
            <div className="relative w-full h-[300px] md:h-[400px]">
              {banners.map((banner, index) => {
                const isActive = index === current;
                return (
                  <div 
                    key={banner.id} 
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
                  >
                    <div className="flex flex-col md:flex-row items-center h-full">
                      {/* Text Side */}
                      <div className="p-8 md:p-12 md:w-1/2 relative z-20">
                        <p className="text-primary font-bold text-sm mb-2 uppercase tracking-wide">
                          {banner.subtitle || "Isource Deals"}
                        </p>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-charcoal leading-[1.1] tracking-tight mb-4">
                          {banner.title}
                        </h1>
                        <p className="text-charcoal/70 mb-6 line-clamp-2">
                          {banner.description}
                        </p>
                        
                        {/* Dynamic Button */}
                        {banner.ctaLabel && banner.ctaUrl && (
                          <Link 
                            href={banner.ctaUrl} 
                            className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
                          >
                            {banner.ctaLabel} <ArrowRight size={16} />
                          </Link>
                        )}
                      </div>

                      {/* Image Side */}
                      <div className="relative md:w-1/2 h-[200px] md:h-full w-full">
                        {/* Decorative Orange Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FDF6ED] via-transparent to-transparent z-10 hidden md:block" />
                        <div className="absolute top-0 right-0 w-[120%] h-full bg-primary rounded-l-[100px] transform translate-x-1/4 skew-x-[-15deg] z-0" />
                        
                        {/* Dynamic Image */}
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <Image 
                            src={banner.imageUrl || "/images/placeholder.svg"} 
                            alt={banner.title} 
                            fill 
                            sizes="(max-width: 768px) 100vw, 50vw" 
                            className="object-contain p-8 drop-shadow-2xl" unoptimized 
                            priority={index === 0}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Arrows (Only show if more than 1 slide) */}
            {banners.length > 1 && (
              <>
                <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-white/80 shadow-md flex items-center justify-center text-charcoal opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-white/80 shadow-md flex items-center justify-center text-charcoal opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {banners.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2">
                {banners.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrent(idx)}
                    className={`h-2 rounded-full transition-all ${idx === current ? "w-6 bg-primary" : "w-2 bg-primary/30"}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Static Trust Badges Sidebar */}
          <div className="hidden lg:flex flex-col gap-3">
            <div className="flex-1 rounded-xl border border-border bg-white p-5 flex flex-col justify-center gap-6">
              <div className="flex gap-4 items-start">
                <CheckCircle2 className="text-primary flex-shrink-0" size={24} />
                <div><h3 className="font-bold text-sm text-charcoal">Genuine Products</h3><p className="text-xs text-muted mt-0.5">From verified sellers</p></div>
              </div>
              <div className="flex gap-4 items-start">
                <Truck className="text-primary flex-shrink-0" size={24} />
                <div><h3 className="font-bold text-sm text-charcoal">Fast Delivery</h3><p className="text-xs text-muted mt-0.5">Across Nigeria</p></div>
              </div>
              <div className="flex gap-4 items-start">
                <ShieldCheck className="text-primary flex-shrink-0" size={24} />
                <div><h3 className="font-bold text-sm text-charcoal">Secure Payments</h3><p className="text-xs text-muted mt-0.5">Paystack & Flutterwave</p></div>
              </div>
              <div className="flex gap-4 items-start">
                <RefreshCcw className="text-primary flex-shrink-0" size={24} />
                <div><h3 className="font-bold text-sm text-charcoal">Easy Returns</h3><p className="text-xs text-muted mt-0.5">Hassle-free</p></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}