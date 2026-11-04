"use client";
import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

export function ProductGallery({ images, productName }: { images: string[], productName: string }) {
  const [activeImg, setActiveImg] = useState(0);
  
  // Ensure we always have an array
  const safeImages = images && images.length > 0 ? images : ["/images/placeholder.svg"];

  // Pad the array so we always have at least 6 slots visually
  const displayCount = Math.max(6, safeImages.length);
  const paddedImages = Array.from({ length: displayCount }, (_, i) => safeImages[i] || null);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. Main Image */}
      <div className="relative aspect-square w-full bg-white md:rounded-2xl md:border md:border-border md:overflow-hidden shadow-sm">
        <Image
          src={safeImages[activeImg]}
          alt={productName}
          fill
          className="object-contain p-4"
          priority
        />
      </div>

      {/* 2. Thumbnails */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {paddedImages.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              if (img) {
                setActiveImg(i);
                console.log("Clicked image", i);
              }
            }}
            className={`relative h-16 w-16 md:h-20 md:w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all flex items-center justify-center bg-surface cursor-pointer ${
              activeImg === i && img ? "border-primary ring-2 ring-primary/20" : "border-border/50 opacity-70 hover:opacity-100"
            }`}
          >
            {img ? (
              <Image src={img} alt={`${productName} - ${i+1}`} fill className="object-cover" />
            ) : (
              <div className="flex flex-col items-center text-muted">
                <ImageIcon size={16} />
                <span className="text-[8px] mt-1">Empty</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}