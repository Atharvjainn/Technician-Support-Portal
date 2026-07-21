"use client";

interface CountdownSectionProps {
  secondsLeft: number;
  canSkip: boolean;
  skipClicked: boolean;
  canProceed: boolean;
  onSkip: () => void;
  onProceed: () => void;
}

export function CountdownSection({
  secondsLeft,
  canSkip,
  skipClicked,
  canProceed,
  onSkip,
  onProceed,
}: CountdownSectionProps) {
  const progress = ((30 - secondsLeft) / 30) * 100;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Starting in {secondsLeft}s</h2>

      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold tabular-nums text-zinc-100">
          {String(secondsLeft).padStart(2, "0")}
          <span className="text-lg font-normal text-zinc-500">s</span>
        </p>

        <div className="flex gap-3">
          {canSkip && (
            <button
              onClick={onSkip}
              className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800"
            >
              Skip
            </button>
          )}

          {skipClicked && (
            <button
              disabled
              className="rounded-lg border border-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-600"
            >
              Skipped
            </button>
          )}

          <button
            onClick={onProceed}
            disabled={!canProceed}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Proceed
          </button>
        </div>
      </div>
    </section>
  );
}
