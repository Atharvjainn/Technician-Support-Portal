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

// const JOB_CONFIGURED_COOKIE = "job_configured";

// function syncJobConfiguredCookie(equipment: string, severity: string) {
//   if (typeof document === "undefined") return;
//   const configured = Boolean(equipment) && Boolean(severity);
//   document.cookie = configured
//     ? `${JOB_CONFIGURED_COOKIE}=1; path=/; max-age=${60 * 60 * 24}; samesite=lax`
//     : `${JOB_CONFIGURED_COOKIE}=; path=/; max-age=0; samesite=lax`;
// }

// useMissionStore.subscribe((state) =>
//   syncJobConfiguredCookie(state.equipment, state.severity)
// );
