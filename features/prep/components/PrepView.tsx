"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMissionStore } from "@/features/job-config/store/job-config.store";
import { useMissionHydration } from "@/features/job-config/hooks/useMissionHydration";
import { usePrepStore } from "../store/prep.store";
import { useCameraPermission } from "../hooks/useCameraPermission";
import { useCountdown } from "../hooks/useCountdown";
import { JobSummary } from "./JobSummary";
import { SafetyInstructions } from "./SafetyInstructions";
import { CameraSection } from "./CameraSection";
import { CountdownSection } from "./CountdownSection";

export function PrepView() {
  const router = useRouter();
  const navigatingRef = useRef(false);

  const equipment = useMissionStore((s) => s.equipment);
  const severity = useMissionStore((s) => s.severity);
  const prepCompleted = usePrepStore((s) => s.completed);
  const setPrepCompleted = usePrepStore((s) => s.setCompleted);

  const { state: cameraState, request } = useCameraPermission();
  const { secondsLeft, isFinished, stop } = useCountdown(30);
  const hydrated = useMissionHydration();
  const [skipClicked, setSkipClicked] = useState(false);

  const shouldHidePage =
    !hydrated || !equipment || !severity || prepCompleted;

  useEffect(() => {
    if (!hydrated) return;

    if (!equipment || !severity) {
    router.replace("/");
    }

  }, [hydrated,equipment, severity, router]);

  useEffect(() => {
    if (prepCompleted) {
      router.replace("/activity");
    }
  }, [prepCompleted, router]);

  const canSkip = secondsLeft <= 25 && !skipClicked && !isFinished;
  const canProceed =
    cameraState === "granted" && (isFinished || skipClicked);

  const navigateToActivity = useCallback(() => {
  if (navigatingRef.current) return;

  navigatingRef.current = true;
  setPrepCompleted(true);
  router.push("/activity");
}, [router, setPrepCompleted]);

  useEffect(() => {
    if (isFinished && cameraState === "granted") {
      navigateToActivity();
    }
  }, [isFinished, cameraState, navigateToActivity]);

  const handleSkip = () => {
    stop();
    setSkipClicked(true);
  };

  const handleProceed = () => {
    navigateToActivity();
  };

  if (shouldHidePage) return null;

  return (
    <section className="space-y-10 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Preparation</h1>
        <p className="text-zinc-400">
          Review the job details and prepare your workspace.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CameraSection state={cameraState} onRequest={request} />

        <CountdownSection
          secondsLeft={secondsLeft}
          canSkip={canSkip}
          skipClicked={skipClicked}
          canProceed={canProceed}
          onSkip={handleSkip}
          onProceed={handleProceed}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <JobSummary />

        <SafetyInstructions />
      </div>
    </section>
  );
}
