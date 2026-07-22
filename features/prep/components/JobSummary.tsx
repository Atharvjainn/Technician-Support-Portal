"use client";

import { useMissionStore } from "@/features/job-config/store/job-config.store";
import { EQUIPMENT } from "@/features/job-config/constants/equipments";
import { SEVERITY } from "@/features/job-config/constants/severity";
import { Card } from "@/ui/Card";

export function JobSummary() {
  const equipmentId = useMissionStore((s) => s.equipment);
  const severityId = useMissionStore((s) => s.severity);

  const equipmentTitle =
    EQUIPMENT.find((e) => e.id === equipmentId)?.title ?? equipmentId;
  const severityTitle =
    SEVERITY.find((s) => s.id === severityId)?.title ?? severityId;

  return (
    <div className="space-y-3">
      <h2 className="font-display text-lg font-semibold text-foreground">
        Job Summary
      </h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Equipment
          </p>
          <p className="font-display mt-1 font-semibold text-foreground">
            {equipmentTitle}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Severity
          </p>
          <p className="font-display mt-1 font-semibold text-foreground">
            {severityTitle}
          </p>
        </Card>
      </div>
    </div>
  );
}