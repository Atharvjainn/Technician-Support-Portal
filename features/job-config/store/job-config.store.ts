import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { validateJobConfig } from "../schemas/job-config.schema";

interface MissionState {
  equipment: string;
  severity: string;
}

interface MissionActions {
  setEquipment: (id: string) => void;
  setSeverity: (id: string) => void;
  reset: () => void;
}

type MissionStore = MissionState & MissionActions;

export const useMissionStore = create<MissionStore>()(
  persist(
    (set) => ({
      equipment: "",
      severity: "",
      setEquipment: (id) => set({ equipment: id }),
      setSeverity: (id) => set({ severity: id }),
      reset: () => set({ equipment: "", severity: "" }),
    }),
    {
      name: "mission-config",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        equipment: state.equipment,
        severity: state.severity,
      }),
      merge: (persisted, current) => {
        const valid = validateJobConfig(persisted);
        if (valid) {
          return { ...current, ...valid };
        }
        return current;
      },
    }
  )
);
