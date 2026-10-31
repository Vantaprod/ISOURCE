"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { usePathname } from "next/navigation";

export function BackToDashboard() {
  const pathname = usePathname();
  
  // Don't show the back button on the main account dashboard
  if (pathname === "/account") return null;

  return (
    <div className="mb-4">
      <Link 
        href="/account" 
        className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-primary transition-colors"
      >
        <ChevronLeft size={16} /> Back to Dashboard
      </Link>
    </div>
  );
}