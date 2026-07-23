"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { PageHeading } from "./PageHeading";
import { SelectionGrid } from "./SelectionGrid";
import { StartMissionButton } from "./StartMissionButton";

import { EQUIPMENT } from "../constants/equipments";
import { SEVERITY } from "../constants/severity";
import { useMissionStore } from "../store/job-config.store";
import { confirmJobConfigured } from "../actions/confirm-job-config";

export function JobConfig() {
  const router = useRouter();
  const equipment = useMissionStore((s) => s.equipment);
  const severity = useMissionStore((s) => s.severity);
  const setEquipment = useMissionStore((s) => s.setEquipment);
  const setSeverity = useMissionStore((s) => s.setSeverity);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const canStart = equipment !== "" && severity !== "" && !isPending;

  const handleStartMission = () => {
    setError(null);
    
    startTransition(async () => {
      const result = await confirmJobConfigured(equipment, severity);

      if (!result.success) {
        setError(result.error ?? "Could not start mission. Please try again.");
        return;
      }

      router.push("/prep");
    });
  };

  return (
    <section className="space-y-14 py-16">
      <PageHeading
        title="Configure Your Mission"
        description="Select the equipment type and severity level before starting the support workflow."
      />

      <SelectionGrid
        title="Equipment Type"
        options={EQUIPMENT}
        selectedId={equipment}
        onSelect={setEquipment}
      />

      <SelectionGrid
        title="Severity Level"
        options={SEVERITY}
        selectedId={severity}
        onSelect={setSeverity}
      />

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <StartMissionButton
        disabled={!canStart}
        onClick={handleStartMission}
        pending={isPending}
      />
    </section>
  );
}