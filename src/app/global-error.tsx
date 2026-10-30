"use client";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({ reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-surface p-4">
        <div className="max-w-md w-full bg-white rounded-xl border border-border p-8 text-center shadow-sm">
          <div className="h-16 w-16 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} className="text-danger" />
          </div>
          <h1 className="text-2xl font-bold text-charcoal mb-2">Something went wrong</h1>
          <p className="text-sm text-muted mb-6">An unexpected error occurred. Please try again.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => reset()} className="h-10 px-6 rounded bg-primary text-white text-sm font-semibold hover:bg-primary-hover">Try again</button>
            <Link href="/" className="h-10 px-6 leading-10 rounded border border-border text-charcoal text-sm font-semibold hover:bg-surface">Go Home</Link>
          </div>
        </div>
      </body>
    </html>
  );
}