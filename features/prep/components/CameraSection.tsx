"use client";

import { Camera, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";

interface CameraSectionProps {
  state: "pending" | "granted" | "denied" | "blocked";
  onRequest: () => void;
}

export function CameraSection({ state, onRequest }: CameraSectionProps) {
  return (
    <div className="space-y-3">
      <h2 className="font-display text-lg font-semibold text-foreground">
        Camera Access
      </h2>

      <Card className="p-5">
        {state === "pending" && (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-muted-foreground">
                <Camera className="size-4" />
              </span>
              <p className="text-sm text-foreground">
                Camera access is required to continue.
              </p>
            </div>
            <Button onClick={onRequest}>Enable Camera</Button>
          </div>
        )}

        {state === "granted" && (
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-success-muted text-success">
              <CheckCircle2 className="size-5" />
            </span>
            <p className="font-medium text-success">Camera access granted</p>
          </div>
        )}

        {state === "denied" && (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive-muted text-destructive">
                <XCircle className="size-5" />
              </span>
              <p className="text-sm text-foreground">Camera access denied.</p>
            </div>
            <Button variant="secondary" onClick={onRequest}>
              Retry
            </Button>
          </div>
        )}

        {state === "blocked" && (
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive-muted text-destructive">
              <ShieldAlert className="size-5" />
            </span>
            <div>
              <p className="font-medium text-destructive">
                Cannot proceed without camera access
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Enable camera access in your browser settings, then refresh
                the page.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}