import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ChatMessage {
  role: "user" | "expert";
  text: string;
}

interface TabStates {
  assessment: "active" | "completed";
  recording: "locked" | "active" | "completed";
  qa: "locked" | "active" | "completed";
}

interface ChatState {
  messages: ChatMessage[];
  nextExpertIndex: number;
}

interface ActivityState {
  timerStartedAt: number | null;
  timerExpired: boolean;
  activeTab: "assessment" | "recording" | "qa";
  tabStates: TabStates;
  assessmentChat: ChatState;
  qaChat: ChatState;
  recordingCompleted: boolean;
}

interface ActivityActions {
  startTimer: () => void;
  expireTimer: () => void;
  setActiveTab: (tab: "assessment" | "recording" | "qa") => void;
  completeAssessment: () => void;
  completeRecording: () => void;
  completeQA: () => void;
  addAssessmentMessage: (msg: ChatMessage) => void;
  addQAMessage: (msg: ChatMessage) => void;
  reset: () => void;
}

type ActivityStore = ActivityState & ActivityActions;

const initialState: ActivityState = {
  timerStartedAt: null,
  timerExpired: false,
  activeTab: "assessment",
  tabStates: {
    assessment: "active",
    recording: "locked",
    qa: "locked",
  },
  assessmentChat: { messages: [], nextExpertIndex: 0 },
  qaChat: { messages: [], nextExpertIndex: 0 },
  recordingCompleted: false,
};

export const useActivityStore = create<ActivityStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      startTimer: () =>
        set({ timerStartedAt: Date.now() }),

      expireTimer: () =>
        set({ timerExpired: true }),

      setActiveTab: (tab) => {
        const { tabStates } = get();
        if (tab === "recording" && tabStates.recording === "locked") return;
        if (tab === "qa" && tabStates.qa === "locked") return;
        set({ activeTab: tab });
      },

      completeAssessment: () =>
        set({
          tabStates: {
            ...get().tabStates,
            assessment: "completed",
            recording: "active",
          },
          activeTab: "recording",
        }),

      completeRecording: () =>
        set({
          tabStates: {
            ...get().tabStates,
            recording: "completed",
            qa: "active",
          },
          activeTab: "qa",
          recordingCompleted: true,
        }),

      completeQA: () =>
        set({
          tabStates: {
            ...get().tabStates,
            qa: "completed",
          },
        }),

      addAssessmentMessage: (msg) =>
        set((state) => ({
          assessmentChat: {
            messages: [...state.assessmentChat.messages, msg],
            nextExpertIndex:
              state.assessmentChat.nextExpertIndex +
              (msg.role === "expert" ? 1 : 0),
          },
        })),

      addQAMessage: (msg) =>
        set((state) => ({
          qaChat: {
            messages: [...state.qaChat.messages, msg],
            nextExpertIndex:
              state.qaChat.nextExpertIndex + (msg.role === "expert" ? 1 : 0),
          },
        })),

      reset: () => set(initialState),
    }),
    {
      name: "activity-state",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        timerStartedAt: state.timerStartedAt,
        timerExpired: state.timerExpired,
        activeTab: state.activeTab,
        tabStates: state.tabStates,
        assessmentChat: state.assessmentChat,
        qaChat: state.qaChat,
        recordingCompleted: state.recordingCompleted,
      }),
    }
  )
);
