"use client";
import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const safeImages = images.length > 0 ? images : ["/images/placeholder.svg"];
  const [idx, setIdx] = useState(0);
  
  return (
    <div>
      <div className="relative aspect-square rounded-xl border border-border bg-white overflow-hidden p-8">
        <Image src={safeImages[idx]} alt={name} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-contain" priority />
      </div>
      {safeImages.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {safeImages.slice(0, 5).map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative aspect-square rounded-lg border overflow-hidden bg-white p-2 transition-all ${i === idx ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/60"}`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}