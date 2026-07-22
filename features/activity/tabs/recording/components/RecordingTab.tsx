"use client";

import { Play, Square, Video } from "lucide-react";
import { useActivityStore } from "@/features/activity/store/activity.store";
import { useMediaRecorder } from "../hooks/useMediaRecorder";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";

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
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-background p-8">
      <Card className="flex aspect-video w-full max-w-lg items-center justify-center overflow-hidden p-0">
        {blobUrl ? (
          <video
            src={blobUrl}
            controls
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Video className="size-8" strokeWidth={1.5} />
            <span className="text-sm">Recording preview</span>
          </div>
        )}
      </Card>

      {state === "recording" && (
        <div className="flex items-center gap-2">
          <span className="size-2.5 animate-pulse rounded-full bg-destructive" />
          <span className="font-mono text-lg tabular-nums text-destructive">
            {formatElapsed(elapsedMs)}
          </span>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        {state === "idle" && (
          <Button onClick={start}>
            <Play className="size-4" />
            Start Recording
          </Button>
        )}

        {state === "recording" && (
          <Button variant="destructive" onClick={stop}>
            <Square className="size-4" />
            Stop Recording
          </Button>
        )}

        {state === "stopped" && (
          <>
            <Button variant="secondary" onClick={reset}>
              Retry
            </Button>
            <Button onClick={completeRecording}>Complete Recording</Button>
          </>
        )}

        {state === "error" && (
          <Button variant="secondary" onClick={reset}>
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}