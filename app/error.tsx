"use client";

import { AlertTriangle, RotateCw } from "lucide-react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps) {
  console.error(error);

  return (
    <html>
      <body>
        <main className="flex min-h-screen items-center justify-center bg-background px-6">
          <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
            <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-7 text-destructive" />
            </div>

            <h1 className="text-2xl font-bold">
              Something went wrong
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              An unexpected error occurred while loading this page.
              Please try again.
            </p>

            <button
              onClick={reset}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              <RotateCw className="size-4" />
              Try Again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}