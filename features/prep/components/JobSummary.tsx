"use client";

import { useMissionStore } from "@/features/job-config/store/job-config.store";
import { EQUIPMENT } from "@/features/job-config/constants/equipments";
import { SEVERITY } from "@/features/job-config/constants/severity";

export function JobSummary() {
  const equipmentId = useMissionStore((s) => s.equipment);
  const severityId = useMissionStore((s) => s.severity);

  const equipmentTitle =
    EQUIPMENT.find((e) => e.id === equipmentId)?.title ?? equipmentId;
  const severityTitle =
    SEVERITY.find((s) => s.id === severityId)?.title ?? severityId;

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Job Summary</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-500">Equipment</p>
          <p className="mt-1 font-medium">{equipmentTitle}</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-500">Severity</p>
          <p className="mt-1 font-medium">{severityTitle}</p>
        </div>
      </div>
    </section>
  );
}
