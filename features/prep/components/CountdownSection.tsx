"use client";

import { Card } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { RadialTimer } from "@/ui/RadialTimer";

interface CountdownSectionProps {
  secondsLeft: number;
  canSkip: boolean;
  skipClicked: boolean;
  canProceed: boolean;
  onSkip: () => void;
  onProceed: () => void;
}

const TOTAL = 30;

export function CountdownSection({
  secondsLeft,
  canSkip,
  skipClicked,
  canProceed,
  onSkip,
  onProceed,
}: CountdownSectionProps) {
  const progress = (TOTAL - secondsLeft) / TOTAL;

  return (
    <div className="space-y-3">
      <h2 className="font-display text-lg font-semibold text-foreground">
        Preparing Workspace
      </h2>

      <Card className="flex flex-col items-center gap-6 p-6">
        <RadialTimer
          size={112}
          strokeWidth={7}
          progress={progress}
          color="var(--color-primary)"
        >
          <span className="font-mono text-2xl font-semibold tabular-nums text-foreground">
            {String(secondsLeft).padStart(2, "0")}
          </span>
        </RadialTimer>

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