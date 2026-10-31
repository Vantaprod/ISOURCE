export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-10 w-48 bg-surface rounded-lg"></div>
      
      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-surface rounded-xl border border-border"></div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="h-[400px] bg-surface rounded-xl border border-border"></div>
        <div className="h-[400px] bg-surface rounded-xl border border-border"></div>
      </div>
    </div>
  );
}