export default function DocumentLibrarySkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Search bar skeleton */}
      <div className="h-12 rounded-xl bg-card/50 border border-border/30" />
      
      {/* Filter pills skeleton */}
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-8 rounded-lg bg-card/50 border border-border/30" style={{ width: `${60 + Math.random() * 60}px` }} />
        ))}
      </div>

      {/* Category cards skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-card/30 border border-border/30 flex items-center px-4 gap-3">
            <div className="w-9 h-9 rounded-lg bg-muted/30" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-muted/30" />
              <div className="h-3 w-20 rounded bg-muted/20" />
            </div>
            <div className="h-6 w-10 rounded bg-muted/20" />
          </div>
        ))}
      </div>
    </div>
  );
}
