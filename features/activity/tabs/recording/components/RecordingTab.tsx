"use client";

import { useActivityStore } from "@/features/activity/store/activity.store";
import { useMediaRecorder } from "../hooks/useMediaRecorder";

export function RecordingTab() {
  const completeRecording = useActivityStore((s) => s.completeRecording);

  const { state, start, stop, blobUrl, error, reset, elapsedMs } =
    useMediaRecorder();

  const formatElapsed = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = String(Math.floor(totalSec / 60)).padStart(2, "0");
    const sec = String(totalSec % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-8">
      <div className="flex aspect-video w-full max-w-lg items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
        {blobUrl ? (
          <video
            src={blobUrl}
            controls
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-500">
            <svg
              className="size-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
            <span className="text-sm">Recording preview</span>
          </div>
        )}
      </div>

      {state === "recording" && (
        <div className="flex items-center gap-3">
          <span className="size-3 animate-pulse rounded-full bg-red-500" />
          <span className="font-mono text-lg tabular-nums text-red-400">
            {formatElapsed(elapsedMs)}
          </span>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <div className="flex gap-3">
        {state === "idle" && (
          <button
            onClick={start}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Start Recording
          </button>
        )}

        {state === "recording" && (
          <button
            onClick={stop}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
          >
            <span className="size-3 rounded-sm bg-white" />
            Stop Recording
          </button>
        )}

        {state === "stopped" && (
          <>
            <button
              onClick={reset}
              className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800"
            >
              Retry
            </button>
            <button
              onClick={completeRecording}
              className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
            >
              Complete Recording
            </button>
          </>
        )}

        {state === "error" && (
          <button
            onClick={reset}
            className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
