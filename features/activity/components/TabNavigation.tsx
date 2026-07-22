"use client";

import { useActivityStore } from "../store/activity.store";

const TABS = [
  { id: "assessment" as const, label: "Assessment", icon: "📋" },
  { id: "recording" as const, label: "Recording", icon: "🎥" },
  { id: "qa" as const, label: "QA Review", icon: "✅" },
];

function tabStateLabel(
  state: "active" | "completed" | "locked"
): string {
  if (state === "completed") return "✓";
  if (state === "locked") return "🔒";
  return "";
}

export function TabNavigation() {
  const activeTab = useActivityStore((s) => s.activeTab);
  const tabStates = useActivityStore((s) => s.tabStates);
  const setActiveTab = useActivityStore((s) => s.setActiveTab);

  const effective = {
    assessment: tabStates.assessment as "active" | "completed",
    recording:
      tabStates.assessment === "completed"
        ? tabStates.recording === "locked"
          ? "active"
          : tabStates.recording
        : ("locked" as const),
    qa:
      tabStates.recording === "completed"
        ? tabStates.qa === "locked"
          ? "active"
          : tabStates.qa
        : ("locked" as const),
  };

  return (
    <div className="flex gap-2 border-b border-zinc-800 px-4">
      {TABS.map((tab) => {
        const state = effective[tab.id];
        const isActive = activeTab === tab.id;
        const isClickable = state !== "locked";

        return (
          <button
            key={tab.id}
            onClick={() => isClickable && setActiveTab(tab.id)}
            disabled={!isClickable}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "border-blue-500 text-blue-400"
                : state === "completed"
                  ? "border-transparent text-green-400"
                  : state === "locked"
                    ? "cursor-not-allowed border-transparent text-zinc-600"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            <span className="text-xs">{tabStateLabel(state)}</span>
          </button>
        );
      })}
    </div>
  );
}
