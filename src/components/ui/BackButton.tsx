"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton({ fallbackUrl = "/" }: { fallbackUrl?: string }) {
  const router = useRouter();

  return (
    <button 
      onClick={() => {
        // If there's no history (user opened link directly), go to fallback
        if (window.history.length > 2) {
          router.back();
        } else {
          router.push(fallbackUrl);
        }
      }} 
      className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary mb-6 transition-colors group"
    >
      <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
      Back
    </button>
  );
}