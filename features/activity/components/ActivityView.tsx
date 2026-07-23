"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { usePrepStore } from "@/features/prep/store/prep.store";
import { useHydration } from "@/lib/hooks/useHydration";
import { useActivityStore } from "../store/activity.store";
import { ActivityTimer } from "./ActivityTimer";
import { TabNavigation } from "./TabNavigation";
import { TabSkeleton } from "./TabSkeleton";

const AssessmentTab = dynamic(
  () =>
    import("../tabs/assessment/components/AssessmentTab").then(
      (m) => m.AssessmentTab
    ),
  { loading: () => <TabSkeleton />, ssr: false }
);

const RecordingTab = dynamic(
  () =>
    import("../tabs/recording/components/RecordingTab").then(
      (m) => m.RecordingTab
    ),
  { loading: () => <TabSkeleton />, ssr: false }
);

const QATab = dynamic(
  () => import("../tabs/qa/components/QATab").then((m) => m.QATab),
  { loading: () => <TabSkeleton />, ssr: false }
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
        {activeTab === "assessment" && <AssessmentTab />}
        {activeTab === "recording" && <RecordingTab />}
        {activeTab === "qa" && <QATab />}
      </div>
    </section>
  );
}