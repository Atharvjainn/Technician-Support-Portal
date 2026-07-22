import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-base font-semibold tracking-tight text-foreground"
        >
          Remote Support Portal
        </Link>

        <div className="flex items-center gap-2 rounded-full border border-border bg-surface-muted px-3 py-1.5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            Technician Session Active
          </span>
        </div>
      </div>
    </header>
  );
}