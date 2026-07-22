"use client";

import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorProps) {
  console.error(error);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-destructive-muted">
          <AlertTriangle className="size-7 text-destructive" />
        </div>

        <h1 className="font-display text-2xl font-semibold text-foreground">
          Something went wrong
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected error occurred while loading this page. Please try
          again.
        </p>

        <Button onClick={reset} className="mt-6">
          <RotateCw className="size-4" />
          Try Again
        </Button>
      </Card>
    </main>
  );
}