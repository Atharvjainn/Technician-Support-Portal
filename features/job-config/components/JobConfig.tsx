"use client";

import { useRouter } from "next/navigation";

import { PageHeading } from "./PageHeading";
import { SelectionGrid } from "./SelectionGrid";
import { StartMissionButton } from "./StartMissionButton";

import { EQUIPMENT } from "../constants/equipments";
import { SEVERITY } from "../constants/severity";
import { useMissionStore } from "../store/job-config.store";

export function JobConfig() {
  const router = useRouter();
  const equipment = useMissionStore((s) => s.equipment);
  const severity = useMissionStore((s) => s.severity);
  const setEquipment = useMissionStore((s) => s.setEquipment);
  const setSeverity = useMissionStore((s) => s.setSeverity);

  const canStart = equipment !== "" && severity !== "";

  const handleStartMission = () => {
    router.push("/prep");
  };

  return (
    <section className="space-y-12 py-12">
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

      <StartMissionButton
        disabled={!canStart}
        onClick={handleStartMission}
      />
    </section>
  );
}
