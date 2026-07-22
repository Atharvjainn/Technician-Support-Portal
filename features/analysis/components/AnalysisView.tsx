"use client";

import { useRouter } from "next/navigation";
import { useActivityStore } from "@/features/activity/store/activity.store";
import { useMissionStore } from "@/features/job-config/store/job-config.store";
import { usePrepStore } from "@/features/prep/store/prep.store";
import { EQUIPMENT } from "@/features/job-config/constants/equipments";
import { SEVERITY } from "@/features/job-config/constants/severity";

export function AnalysisView() {
  const router = useRouter();
  const timerExpired = useActivityStore((s) => s.timerExpired);
  const tabStates = useActivityStore((s) => s.tabStates);
  const equipmentId = useMissionStore((s) => s.equipment);
  const severityId = useMissionStore((s) => s.severity);

  const handleNewMission = () => {
    useMissionStore.getState().reset();
    usePrepStore.getState().reset();
    useActivityStore.getState().reset();
    router.push("/");
  };

  const equipmentTitle =
    EQUIPMENT.find((e) => e.id === equipmentId)?.title ?? equipmentId;
  const severityTitle =
    SEVERITY.find((s) => s.id === severityId)?.title ?? severityId;

  const completedTabs = [
    tabStates.assessment === "completed" ? "Assessment" : null,
    tabStates.recording === "completed" ? "Recording" : null,
    tabStates.qa === "completed" ? "QA Review" : null,
  ].filter((t): t is string => t !== null);

  return (
    <section className="space-y-10 py-16">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Analysis</h1>
        <p className="text-zinc-400">
          {timerExpired
            ? "Session ended — timer expired."
            : "Session completed successfully."}
        </p>
      </div>

      <div className="mx-auto max-w-lg space-y-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="mb-3 text-lg font-semibold">Job Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Equipment</span>
              <span className="font-medium">{equipmentTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Severity</span>
              <span className="font-medium">{severityTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Status</span>
              <span
                className={`font-medium ${
                  timerExpired ? "text-orange-400" : "text-green-400"
                }`}
              >
                {timerExpired ? "Timer Expired" : "Completed"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="mb-3 text-lg font-semibold">Progress</h2>
          {completedTabs.length > 0 ? (
            <ul className="space-y-2">
              {completedTabs.map((tab) => (
                <li key={tab} className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">✓</span>
                  <span className="text-zinc-300">{tab}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">No phases completed.</p>
          )}
        </div>

        <button
          onClick={handleNewMission}
          className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Start New Mission
        </button>
      </div>
    </section>
  );
}
