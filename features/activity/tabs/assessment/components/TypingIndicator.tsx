"use client";

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl bg-zinc-800 px-4 py-3">
        <span className="size-1.5 animate-bounce rounded-full bg-zinc-500" />
        <span className="size-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:0.1s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:0.2s]" />
      </div>
    </div>
  );
}
