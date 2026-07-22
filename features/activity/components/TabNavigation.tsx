"use client";

import { ClipboardList, Video, CheckSquare, Lock, Check } from "lucide-react";
import { useActivityStore } from "../store/activity.store";

const TABS = [
  { id: "assessment" as const, label: "Assessment", icon: ClipboardList },
  { id: "recording" as const, label: "Recording", icon: Video },
  { id: "qa" as const, label: "QA Review", icon: CheckSquare },
];

export function TabNavigation() {
  const activeTab = useActivityStore((s) => s.activeTab);
  const tabStates = useActivityStore((s) => s.tabStates);
  const setActiveTab = useActivityStore((s) => s.setActiveTab);

  const effective = {
    assessment: tabStates.assessment,
    recording:
      tabStates.assessment === "completed"
        ? tabStates.recording === "locked"
          ? "active"
          : tabStates.recording
        : "locked",
    qa:
      tabStates.recording === "completed"
        ? tabStates.qa === "locked"
          ? "active"
          : tabStates.qa
        : "locked",
  } as const;

  return (
    <div className="flex gap-1 border-b border-border bg-surface px-4">
      {TABS.map((tab) => {
        const state = effective[tab.id];
        const isActive = activeTab === tab.id;
        const isClickable = state !== "locked";
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => isClickable && setActiveTab(tab.id)}
            disabled={!isClickable}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "border-primary text-primary"
                : state === "completed"
                  ? "border-transparent text-success"
                  : state === "locked"
                    ? "cursor-not-allowed border-transparent text-muted-foreground/50"
                    : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="size-4" />
            <span>{tab.label}</span>
            {state === "completed" && <Check className="size-3.5" />}
            {state === "locked" && <Lock className="size-3.5" />}
          </button>
        );
      })}
    </div>
  );
}