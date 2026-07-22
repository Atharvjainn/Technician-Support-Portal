export function TabSkeleton() {
  return (
    <div className="flex h-full flex-col animate-pulse">
      <div className="flex-1 space-y-3 p-4">
        <div className="h-16 w-2/3 rounded-2xl bg-surface-muted" />
        <div className="ml-auto h-10 w-1/2 rounded-2xl bg-surface-muted" />
        <div className="h-12 w-3/5 rounded-2xl bg-surface-muted" />
      </div>
      <div className="border-t border-border bg-surface p-4">
        <div className="h-10 w-full rounded-lg bg-surface-muted" />
      </div>
    </div>
  );
}