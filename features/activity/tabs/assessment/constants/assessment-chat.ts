export const ASSESSMENT_SCRIPT = {
  expertMessages: [
    { text: "Describe what you're observing.", delayMs: 1500 },
    { text: "Check the power indicator light.", delayMs: 2000 },
    { text: "Try a soft reset of the unit.", delayMs: 2000 },
    { text: "That confirms the issue. Proceed with the fix.", delayMs: 2000 },
  ],
  userPlaceholder: "Type your observation...",
} as const;
