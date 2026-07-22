"use client";

import { RadialTimer } from "@/ui/RadialTimer"
import { useTimer } from "@/lib/hooks/useTimer";
import { useActivityStore } from "../store/activity.store";

const TOTAL_SECONDS = 600;

export function ActivityTimer() {
  const timerStartedAt = useActivityStore((s) => s.timerStartedAt);
  const expireTimer = useActivityStore((s) => s.expireTimer);

  const { secondsLeft, progress } = useTimer(
    TOTAL_SECONDS,
    timerStartedAt,
    expireTimer
  );

  const min = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const sec = String(secondsLeft % 60).padStart(2, "0");

  const tone =
    secondsLeft > 120 ? "primary" : secondsLeft > 30 ? "warning" : "destructive";

  const ringColor = {
    primary: "var(--color-primary)",
    warning: "var(--color-warning)",
    destructive: "var(--color-destructive)",
  }[tone];

  const textClass = {
    primary: "text-foreground",
    warning: "text-warning",
    destructive: "text-destructive",
  }[tone];

  return (
    <div className="flex items-center justify-center gap-3 border-b border-border bg-surface py-3">
      <RadialTimer size={32} strokeWidth={3} progress={progress} color={ringColor} />
      <span className={`font-mono text-xl font-semibold tabular-nums ${textClass}`}>
        {min}:{sec}
      </span>
    </div>
  );
}