"use client";

import { useEffect, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { usePrepStore } from "@/features/prep/store/prep.store";
import { useHydration } from "@/lib/hooks/useHydration";
import { useActivityStore } from "../store/activity.store";
import { ActivityTimer } from "./ActivityTimer";
import { TabNavigation } from "./TabNavigation";
import { TabSkeleton } from "./TabSkeleton";


const AssessmentTab = lazy(() =>
  import("../tabs/assessment/components/AssessmentTab").then((m) => ({
    default: m.AssessmentTab,
  }))
);

const RecordingTab = lazy(() =>
  import("../tabs/recording/components/RecordingTab").then((m) => ({
    default: m.RecordingTab,
  }))
);

const QATab = lazy(() =>
  import("../tabs/qa/components/QATab").then((m) => ({
    default: m.QATab,
  }))
);

export function ActivityView() {
  const router = useRouter();

  const activityHydrated = useHydration(useActivityStore.persist);
  const prepHydrated = useHydration(usePrepStore.persist);
  const hydrated = activityHydrated && prepHydrated;

  const prepCompleted = usePrepStore((s) => s.completed);
  const activeTab = useActivityStore((s) => s.activeTab);
  const timerStartedAt = useActivityStore((s) => s.timerStartedAt);
  const timerExpired = useActivityStore((s) => s.timerExpired);
  const startTimer = useActivityStore((s) => s.startTimer);
  const tabStates = useActivityStore((s) => s.tabStates);

  useEffect(() => {
    if (!hydrated) return;
    if (!prepCompleted) {
      router.replace("/prep");
    }
  }, [hydrated, prepCompleted, router]);

  useEffect(() => {
    if (!hydrated) return;
    if (!timerStartedAt && !timerExpired) {
      startTimer();
    }
  }, [hydrated, timerStartedAt, timerExpired, startTimer]);

  useEffect(() => {
    if (timerExpired) {
      router.push("/analysis");
    }
  }, [timerExpired, router]);

  useEffect(() => {
    if (!hydrated) return;
    const isLocked =
      (activeTab === "recording" && tabStates.recording === "locked") ||
      (activeTab === "qa" && tabStates.qa === "locked");

    if (isLocked) {
      router.replace("/prep");
    }
  }, [hydrated, activeTab, tabStates, router]);

  if (!hydrated || !prepCompleted || timerExpired) return null;

  return (
    <section className="flex h-[calc(100vh-4rem)] flex-col bg-background">
      <ActivityTimer />

      <TabNavigation />

      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<TabSkeleton />}>
          {activeTab === "assessment" && <AssessmentTab />}
          {activeTab === "recording" && <RecordingTab />}
          {activeTab === "qa" && <QATab />}
        </Suspense>
      </div>
    </section>
  );
}