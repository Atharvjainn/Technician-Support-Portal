"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMissionStore } from "@/features/job-config/store/job-config.store";

export default function PrepPage() {
  const router = useRouter();
  const equipment = useMissionStore((s) => s.equipment);
  const severity = useMissionStore((s) => s.severity);

  useEffect(() => {
    if (!equipment || !severity) {
      router.replace("/");
    }
  }, [equipment, severity, router]);

  if (!equipment || !severity) return null;

  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Prep Phase</h1>
        <p className="text-zinc-400">
          Equipment: {equipment} &middot; Severity: {severity}
        </p>
      </div>
    </div>
  );
}
