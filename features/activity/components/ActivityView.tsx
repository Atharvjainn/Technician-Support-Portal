"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrepStore } from "@/features/prep/store/prep.store";
import { useActivityStore } from "../store/activity.store";
import { ActivityTimer } from "./ActivityTimer";
import { TabNavigation } from "./TabNavigation";
import { AssessmentTab } from "../tabs/assessment/components/AssessmentTab";
import { RecordingTab } from "../tabs/recording/components/RecordingTab";
import { QATab } from "../tabs/qa/components/QATab";

export function ActivityView() {
  const router = useRouter();
  const prepCompleted = usePrepStore((s) => s.completed);
  const activeTab = useActivityStore((s) => s.activeTab);
  const timerStartedAt = useActivityStore((s) => s.timerStartedAt);
  const timerExpired = useActivityStore((s) => s.timerExpired);
  const startTimer = useActivityStore((s) => s.startTimer);
  const tabStates = useActivityStore((s) => s.tabStates);

  useEffect(() => {
    if (!prepCompleted) {
      router.replace("/prep");
    }
  }, [prepCompleted, router]);

  useEffect(() => {
    if (!timerStartedAt && !timerExpired) {
      startTimer();
    }
  }, [timerStartedAt, timerExpired, startTimer]);

  useEffect(() => {
    if (timerExpired) {
      router.push("/analysis");
    }
  }, [timerExpired, router]);

  useEffect(() => {
    const isLocked =
      (activeTab === "recording" && tabStates.recording === "locked") ||
      (activeTab === "qa" && tabStates.qa === "locked");

    if (isLocked) {
      router.replace("/prep");
    }
  }, [activeTab, tabStates, router]);

  if (!prepCompleted || timerExpired) return null;

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