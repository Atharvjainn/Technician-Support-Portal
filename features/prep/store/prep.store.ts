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