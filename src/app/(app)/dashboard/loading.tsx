export default function DashboardLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Welcome banner skeleton */}
      <div className="rounded-xl border border-border bg-card p-6 animate-pulse">
        <div className="h-5 w-40 bg-muted rounded mb-3" />
        <div className="h-8 w-64 bg-muted rounded mb-2" />
        <div className="h-4 w-80 bg-muted rounded" />
      </div>

      {/* Job list skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-4 animate-pulse"
          >
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-lg bg-muted shrink-0" />
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-48 bg-muted rounded" />
                  <div className="h-4 w-16 bg-muted rounded ml-auto" />
                </div>
                <div className="h-3 w-32 bg-muted rounded" />
                <div className="flex gap-2 mt-2">
                  <div className="h-5 w-16 bg-muted rounded-full" />
                  <div className="h-5 w-20 bg-muted rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
