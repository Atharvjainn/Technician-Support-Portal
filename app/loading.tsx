import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <LoaderCircle className="size-10 animate-spin text-primary" />

        <div className="space-y-1 text-center">
          <h2 className="text-lg font-semibold">Loading...</h2>
          <p className="text-sm text-muted-foreground">
            Preparing your workspace.
          </p>
        </div>
      </div>
    </main>
  );
}