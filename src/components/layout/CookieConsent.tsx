"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already made a choice
    const consent = localStorage.getItem("isource_cookie_consent_v1");
    if (!consent) {
      // Small delay to prevent jarring popup on initial load
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (type: "accepted" | "rejected") => {
    localStorage.setItem("isource_cookie_consent_v1", type);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.08)] animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="mx-auto max-w-[1440px] px-4 py-5 md:py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Text Area */}
        <div className="flex items-start gap-4">
          <div className="hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-charcoal mb-1">Your Privacy Matters</h3>
            <p className="text-xs text-muted leading-relaxed max-w-3xl">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies. Read our <Link href="/privacy" className="text-primary font-medium hover:underline">Privacy Policy</Link> to learn more.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <button 
            onClick={() => handleConsent("rejected")}
            className="flex-1 md:flex-none h-10 px-5 rounded-md border border-border text-charcoal text-sm font-bold hover:bg-surface transition-colors"
          >
            Reject Non-Essential
          </button>
          <button 
            onClick={() => handleConsent("accepted")}
            className="flex-1 md:flex-none h-10 px-8 rounded-md bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors shadow-sm"
          >
            Accept All
          </button>
        </div>

      </div>
    </div>
  );
}