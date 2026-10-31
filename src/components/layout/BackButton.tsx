"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function BackButton({ label = "Back" }: { label?: string }) {
  const router = useRouter();
  
  return (
    <div className="mx-auto max-w-[1440px] px-4 pt-6 md:pt-8">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-primary transition-colors"
      >
        <ChevronLeft size={16} /> {label}
      </button>
    </div>
  );
}