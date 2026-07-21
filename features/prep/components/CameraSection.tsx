"use client";

interface CameraSectionProps {
  state: "pending" | "granted" | "denied" | "blocked";
  onRequest: () => void;
}

export function CameraSection({ state, onRequest }: CameraSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Camera Access</h2>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        {state === "pending" && (
          <div className="flex items-center justify-between">
            <p className="text-zinc-300">
              Camera access is required to continue.
            </p>
            <button
              onClick={onRequest}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Request Camera Access
            </button>
          </div>
        )}

        {state === "granted" && (
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-green-500/20">
              <svg
                className="size-5 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </span>
            <p className="font-medium text-green-400">Camera access granted</p>
          </div>
        )}

        {state === "denied" && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-red-500/20">
                <svg
                  className="size-5 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
              <p className="text-zinc-300">Camera access denied</p>
            </div>
            <button
              onClick={onRequest}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800"
            >
              Retry
            </button>
          </div>
        )}

        {state === "blocked" && (
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-red-500/20">
              <svg
                className="size-5 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </span>
            <div>
              <p className="font-medium text-red-400">
                Cannot proceed without camera access
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Please enable camera in your browser settings and refresh the
                page.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
