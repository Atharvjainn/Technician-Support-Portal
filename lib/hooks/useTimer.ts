"use client";

import { useEffect, useState } from "react";

interface UseTimerReturn {
  secondsLeft: number;
  isFinished: boolean;
  progress: number; // 0 to 1, elapsed fraction of totalSeconds
}

/**
 * Derives a countdown from an absolute start timestamp instead of
 * owning a local tick counter. That's what lets a timer survive a
 * remount (e.g. a page refresh) — it resumes from
 * `totalSeconds - elapsed`, computed fresh from `startedAt`, rather
 * than restarting from `totalSeconds` every time.
 *
 * Shared by both timers in the app: the 10-minute activity timer
 * and the 30s prep countdown. Pass whichever persisted `startedAt`
 * timestamp applies, and an optional `onExpire` to fire once when
 * it hits zero.
 */
export function useTimer(
  totalSeconds: number,
  startedAt: number | null,
  onExpire?: () => void
): UseTimerReturn {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    if (!startedAt) return;

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const left = Math.max(0, totalSeconds - elapsed);
      setSecondsLeft(left);
      if (left <= 0) onExpire?.();
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startedAt, totalSeconds, onExpire]);

  return {
    secondsLeft,
    isFinished: secondsLeft <= 0,
    progress: Math.min(1, 1 - secondsLeft / totalSeconds),
  };
}