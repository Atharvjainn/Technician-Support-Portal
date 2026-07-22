"use client";

import { useEffect, useState } from "react";
import { useActivityStore } from "../store/activity.store";

const TOTAL_SECONDS = 600;
const RADIUS = 15;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ActivityTimer() {
  const timerStartedAt = useActivityStore((s) => s.timerStartedAt);
  const expireTimer = useActivityStore((s) => s.expireTimer);

  const [remaining, setRemaining] = useState(TOTAL_SECONDS);

  useEffect(() => {
    if (!timerStartedAt) return;

    const tick = () => {
      const elapsed = Math.floor((Date.now() - timerStartedAt) / 1000);
      const left = Math.max(0, TOTAL_SECONDS - elapsed);
      setRemaining(left);

      if (left <= 0) {
        expireTimer();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [timerStartedAt, expireTimer]);

  const min = String(Math.floor(remaining / 60)).padStart(2, "0");
  const sec = String(remaining % 60).padStart(2, "0");

  const tone =
    remaining > 120 ? "primary" : remaining > 30 ? "warning" : "destructive";

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

  const progress = 1 - remaining / TOTAL_SECONDS;
  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="flex items-center justify-center gap-3 border-b border-border bg-surface py-3">
      <svg viewBox="0 0 36 36" className="size-8 -rotate-90">
        <circle
          cx="18"
          cy="18"
          r={RADIUS}
          fill="none"
          stroke="var(--color-surface-muted)"
          strokeWidth="3"
        />
        <circle
          cx="18"
          cy="18"
          r={RADIUS}
          fill="none"
          stroke={ringColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      <span className={`font-mono text-xl font-semibold tabular-nums ${textClass}`}>
        {min}:{sec}
      </span>
    </div>
  );
}