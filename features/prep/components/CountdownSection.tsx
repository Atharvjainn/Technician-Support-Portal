"use client";

import { Card } from "@/ui/Card";
import { Button } from "@/ui/Button";

interface CountdownSectionProps {
  secondsLeft: number;
  canSkip: boolean;
  skipClicked: boolean;
  canProceed: boolean;
  onSkip: () => void;
  onProceed: () => void;
}

const TOTAL = 30;
const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CountdownSection({
  secondsLeft,
  canSkip,
  skipClicked,
  canProceed,
  onSkip,
  onProceed,
}: CountdownSectionProps) {
  const progress = (TOTAL - secondsLeft) / TOTAL;
  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="space-y-3">
      <h2 className="font-display text-lg font-semibold text-foreground">
        Preparing Workspace
      </h2>

      <Card className="flex flex-col items-center gap-6 p-6">
        <div className="relative flex size-28 items-center justify-center">
          <svg viewBox="0 0 96 96" className="size-28 -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={RADIUS}
              fill="none"
              stroke="var(--color-surface-muted)"
              strokeWidth="7"
            />
            <circle
              cx="48"
              cy="48"
              r={RADIUS}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              className="transition-[stroke-dashoffset] duration-1000 ease-linear"
            />
          </svg>
          <span className="absolute font-mono text-2xl font-semibold tabular-nums text-foreground">
            {String(secondsLeft).padStart(2, "0")}
          </span>
        </div>

        <div className="flex w-full gap-3">
          {canSkip && (
            <Button variant="secondary" onClick={onSkip} className="flex-1">
              Skip
            </Button>
          )}

          {skipClicked && (
            <Button variant="secondary" disabled className="flex-1">
              Skipped
            </Button>
          )}

          <Button onClick={onProceed} disabled={!canProceed} className="flex-1">
            Proceed
          </Button>
        </div>
      </Card>
    </div>
  );
}