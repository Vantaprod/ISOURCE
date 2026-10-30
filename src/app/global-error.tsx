"use client";
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-surface p-4">
        <div className="max-w-md w-full bg-white rounded-lg border border-border p-6 text-center">
          <h1 className="text-xl font-bold text-danger mb-2">Something went wrong</h1>
          <p className="text-sm text-muted mb-4">{error.message || "An unexpected error occurred."}</p>
          <button onClick={() => reset()} className="h-10 px-4 rounded bg-primary text-white text-sm font-semibold hover:bg-primary-hover">Try again</button>
        </div>
      </body>
    </html>
  );
}