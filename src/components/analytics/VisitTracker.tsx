"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function VisitTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    if (!pathname || pathname === lastTracked.current) return;
    lastTracked.current = pathname;

    // Fire-and-forget page view tracker
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {
      // Silently ignore tracking failures
    });
  }, [pathname]);

  return null;
}