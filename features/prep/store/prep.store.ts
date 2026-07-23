import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface PrepState {
  completed: boolean;
  countdownStartedAt: number | null;
}

interface PrepActions {
  setCompleted: (val: boolean) => void;
  startCountdown: () => void;
  reset: () => void;
}

type PrepStore = PrepState & PrepActions;

export const usePrepStore = create<PrepStore>()(
  persist(
    (set, get) => ({
      completed: false,
      countdownStartedAt: null,
      setCompleted: (val) => set({ completed: val }),
      startCountdown: () => {
        if (get().countdownStartedAt !== null) return;
        set({ countdownStartedAt: Date.now() });
      },
      reset: () => set({ completed: false, countdownStartedAt: null }),
    }),
    {
      name: "prep-state",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        completed: state.completed,
        countdownStartedAt: state.countdownStartedAt,
      }),
    }
  )
);

const PREP_COOKIE = "prep_completed";

function syncPrepCookie(completed: boolean) {
  if (typeof document === "undefined") return;
  document.cookie = completed
    ? `${PREP_COOKIE}=1; path=/; max-age=${60 * 60 * 24}; samesite=lax`
    : `${PREP_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

usePrepStore.subscribe((state) => syncPrepCookie(state.completed));