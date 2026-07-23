"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Clock } from "lucide-react";
import { useActivityStore } from "@/features/activity/store/activity.store";
import { useMissionStore } from "@/features/job-config/store/job-config.store";
import { usePrepStore } from "@/features/prep/store/prep.store";
import { EQUIPMENT } from "@/features/job-config/constants/equipments";
import { SEVERITY } from "@/features/job-config/constants/severity";
import { Card } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { clearJobConfigured } from "@/features/job-config/actions/confirm-job-config";
import { clearPrepCompleted } from "@/features/prep/actions/confirm-prep";

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

  // The Zustand resets above only clear localStorage. The httpOnly
  // guard cookies (job_configured, prep_completed) can't be touched
  // by client JS at all — that's the point of httpOnly — so they
  // have to be cleared through the same Server Action boundary that
  // set them, or they'd outlive a "finished" mission for up to 24h.
  Promise.all([clearJobConfigured(), clearPrepCompleted()]).finally(() => {
    router.push("/");
  });
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
      <div className="space-y-3 text-center">
        <span
          className={`mx-auto flex size-14 items-center justify-center rounded-full ${
            timerExpired ? "bg-warning-muted text-warning" : "bg-success-muted text-success"
          }`}
        >
          {timerExpired ? <Clock className="size-7" /> : <CheckCircle2 className="size-7" />}
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Analysis
        </h1>
        <p className="text-muted-foreground">
          {timerExpired
            ? "Session ended — timer expired."
            : "Session completed successfully."}
        </p>
      </div>

      <div className="mx-auto max-w-lg space-y-4">
        <Card className="p-5">
          <h2 className="font-display mb-3 text-base font-semibold text-foreground">
            Job Details
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Equipment</span>
              <span className="font-medium text-foreground">{equipmentTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Severity</span>
              <span className="font-medium text-foreground">{severityTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span
                className={`font-medium ${timerExpired ? "text-warning" : "text-success"}`}
              >
                {timerExpired ? "Timer Expired" : "Completed"}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-display mb-3 text-base font-semibold text-foreground">
            Progress
          </h2>
          {completedTabs.length > 0 ? (
            <ul className="space-y-2">
              {completedTabs.map((tab) => (
                <li key={tab} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="size-4 text-success" />
                  <span className="text-foreground">{tab}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No phases completed.</p>
          )}
        </Card>

        <Button onClick={handleNewMission} className="w-full">
          Start New Mission
        </Button>
      </div>
    </section>
  );
}