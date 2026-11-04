"use client";
import { useState } from "react";
import { Eye, X, Info } from "lucide-react";

export function PreviewBanner({ storeUrl }: { storeUrl: string }) {
  const [showInfo, setShowInfo] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="sticky top-0 z-50 bg-charcoal text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-6 w-6 rounded-full bg-yellow-400/20 text-yellow-400 flex items-center justify-center shrink-0">
            <Eye size={14} />
          </div>
          <span className="text-xs font-bold">
            <span className="text-yellow-400">PREVIEW MODE</span>
            <span className="text-white/70 ml-2">— This is how your store will look to customers</span>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="h-7 w-7 rounded-full hover:bg-white/10 flex items-center justify-center"
            title="What am I seeing?"
          >
            <Info size={14} />
          </button>
          <a
            href={storeUrl}
            target="_blank"
            className="text-xs font-bold text-yellow-400 hover:underline hidden md:inline"
          >
            View Live Store →
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="h-7 w-7 rounded-full hover:bg-white/10 flex items-center justify-center"
            title="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {showInfo && (
        <div className="border-t border-white/10 bg-black/30">
          <div className="mx-auto max-w-[1440px] px-4 py-3 text-xs text-white/70">
            <p className="mb-2"><strong className="text-white">What you're seeing:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>• <strong className="text-green-400">LIVE items</strong> — visible to customers now</li>
              <li>• <strong className="text-yellow-400">PENDING items</strong> — showing in preview, but hidden from customers until approved</li>
              <li>• <strong className="text-orange-400">SCHEDULED items</strong> — will appear at the scheduled date</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}