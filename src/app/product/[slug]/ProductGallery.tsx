"use client";
import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const safeImages = images.length > 0 ? images : ["/images/placeholder.svg"];
  const [idx, setIdx] = useState(0);
  return (
    <div>
      <div className="relative aspect-square rounded-lg border border-border bg-surface overflow-hidden">
        <Image src={safeImages[idx]} alt={name} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-contain p-4" priority />
      </div>
      {safeImages.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {safeImages.slice(0, 5).map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative aspect-square rounded-md border overflow-hidden bg-white ${i === idx ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/60"}`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}