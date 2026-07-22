"use client";

import { useEffect, useState } from "react";
import { useActivityStore } from "../store/activity.store";

const TOTAL_SECONDS = 600;

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

  const color =
    remaining > 120
      ? "text-zinc-100"
      : remaining > 30
        ? "text-orange-400"
        : "text-red-400";

  return (
    <div className="flex items-center justify-center gap-2 py-3">
      <span className="text-lg text-zinc-500">⏱</span>
      <span className={`font-mono text-2xl font-bold tabular-nums ${color}`}>
        {min}:{sec}
      </span>
    </div>
  );
}
