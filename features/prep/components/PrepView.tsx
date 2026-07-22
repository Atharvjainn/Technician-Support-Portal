"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMissionStore } from "@/features/job-config/store/job-config.store";
import { useMissionHydration } from "@/features/job-config/hooks/useMissionHydration";
import { usePrepStore } from "../store/prep.store";
import { useCameraPermission } from "../hooks/useCameraPermission";
import { useTimer } from "@/lib/hooks/useTimer";
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
  const countdownStartedAt = usePrepStore((s) => s.countdownStartedAt);
  const startCountdown = usePrepStore((s) => s.startCountdown);

  const { state: cameraState, request } = useCameraPermission();

  const missionHydrated = useMissionHydration();

  // usePrepStore is also persisted, so it needs the same
  // hydration wait — otherwise countdownStartedAt reads as `null`
  // (its pre-hydration default) for one render, and the countdown
  // would look like it's restarting even though a real value is
  // about to load from localStorage.
  const [prepStoreHydrated, setPrepStoreHydrated] = useState(false);

  useEffect(() => {
    const check = () => setPrepStoreHydrated(usePrepStore.persist.hasHydrated());
    check();
    const unsub = usePrepStore.persist.onFinishHydration(check);
    return unsub;
  }, []);

  const hydrated = missionHydrated && prepStoreHydrated;

  const [skipClicked, setSkipClicked] = useState(false);

  const { secondsLeft, isFinished } = useTimer(30, countdownStartedAt);

  const shouldHidePage =
    !hydrated || !equipment || !severity || prepCompleted;

  useEffect(() => {
    if (!hydrated) return;

    if (!equipment || !severity) {
      router.replace("/");
    }
  }, [hydrated, equipment, severity, router]);

  useEffect(() => {
    if (!hydrated) return;
    if (prepCompleted) {
      router.replace("/activity");
    }
  }, [hydrated, prepCompleted, router]);

  // Start the countdown clock exactly once, only after hydration
  // has confirmed there isn't already a persisted start time to
  // resume from.
  useEffect(() => {
    if (!hydrated) return;
    if (countdownStartedAt === null) {
      startCountdown();
    }
  }, [hydrated, countdownStartedAt, startCountdown]);

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
    setSkipClicked(true);
  };

  const handleProceed = () => {
    navigateToActivity();
  };

  if (shouldHidePage) return null;

  return (
    <section className="space-y-10 py-16">
      <div className="space-y-2 text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Preparation
        </h1>
        <p className="text-muted-foreground">
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