import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface PrepState {
  completed: boolean;
}

interface PrepActions {
  setCompleted: (val: boolean) => void;
  reset: () => void;
}

type PrepStore = PrepState & PrepActions;

export const usePrepStore = create<PrepStore>()(
  persist(
    (set) => ({
      completed: false,
      setCompleted: (val) => set({ completed: val }),
      reset: () => set({ completed: false }),
    }),
    {
      name: "prep-state",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ completed: state.completed }),
    }
  )
);
