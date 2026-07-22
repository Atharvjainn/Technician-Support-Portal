import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoaderCircle className="size-8 animate-spin text-primary" />

        <div className="space-y-1 text-center">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Loading
          </h2>
          <p className="text-sm text-muted-foreground">
            Preparing your workspace.
          </p>
        </div>
      </div>
    </main>
  );
}