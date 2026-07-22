"use client";

import { useState, useCallback, useRef } from "react";

type RecorderState = "idle" | "recording" | "stopped" | "error";

interface UseMediaRecorderReturn {
  state: RecorderState;
  start: () => void;
  stop: () => void;
  blob: Blob | null;
  blobUrl: string | null;
  error: string | null;
  reset: () => void;
  elapsedMs: number;
}

export function useMediaRecorder(): UseMediaRecorderReturn {
  const [state, setState] = useState<RecorderState>("idle");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopMedia = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      chunksRef.current = [];
      setError(null);

      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        clearTimer();
        const recordedBlob = new Blob(chunksRef.current, {
          type: recorder.mimeType,
        });
        setBlob(recordedBlob);
        setBlobUrl(URL.createObjectURL(recordedBlob));
        setState("stopped");
        stopMedia();
      };

      recorder.onerror = () => {
        clearTimer();
        stopMedia();
        setError("Recording failed.");
        setState("error");
      };

      recorderRef.current = recorder;
      recorder.start();
      startedAtRef.current = Date.now();
      setState("recording");
      setElapsedMs(0);

      timerRef.current = setInterval(() => {
        setElapsedMs(Date.now() - startedAtRef.current);
      }, 200);
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError("Camera or microphone access denied.");
      } else {
        setError("Could not access camera or microphone.");
      }
      setState("error");
    }
  }, [clearTimer, stopMedia]);

  const stop = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
    }
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    stopMedia();
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    recorderRef.current = null;
    chunksRef.current = [];
    setBlob(null);
    setBlobUrl(null);
    setError(null);
    setElapsedMs(0);
    setState("idle");
  }, [blobUrl, clearTimer, stopMedia]);

  return {
    state,
    start,
    stop,
    blob,
    blobUrl,
    error,
    reset,
    elapsedMs,
  };
}
