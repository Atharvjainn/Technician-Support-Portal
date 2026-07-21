import { useState, useEffect, useCallback, useRef } from "react";

interface UseCountdownReturn {
  secondsLeft: number;
  isFinished: boolean;
  start: () => void;
  stop: () => void;
}

export function useCountdown(
  initialSeconds: number
): UseCountdownReturn {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFinished = secondsLeft <= 0;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isRunning || isFinished) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, isFinished, clearTimer]);

  const start = useCallback(() => {
    setSecondsLeft(initialSeconds);
    setIsRunning(true);
  }, [initialSeconds]);

  const stop = useCallback(() => {
    setIsRunning(false);
    clearTimer();
  }, [clearTimer]);

  return { secondsLeft, isFinished, start, stop };
}
