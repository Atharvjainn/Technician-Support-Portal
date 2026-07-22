"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { ChatMessage } from "@/features/activity/store/activity.store";
import { useMissionStore } from "@/features/job-config/store/job-config.store";

interface ChatScript {
  expertMessages: ReadonlyArray<{ text: string; delayMs: number }>;
  userPlaceholder: string;
}

interface UseAIChatReturn {
  messages: ChatMessage[];
  isTyping: boolean;
  streamingMessage: string;
  canComplete: boolean;
  sendMessage: (text: string) => void;
  complete: () => void;
}

const MIN_EXCHANGES = 2;

export function useAIChat(
  chat: { messages: ChatMessage[]; nextExpertIndex: number },
  addMessage: (msg: ChatMessage) => void,
  completeTab: () => void,
  script: ChatScript,
  storageKey: "assessmentChat" | "qaChat",
  phase: "assessment" | "qa"
): UseAIChatReturn {
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");

  const equipment = useMissionStore((s) => s.equipment);
  const severity = useMissionStore((s) => s.severity);

  const mockIndexRef = useRef(0);
  const sendMessage = useCallback(
    async (text: string) => {
      if (isTyping) return;

      const apiMessages = [
        ...chat.messages,
        { role: "user" as const, text },
      ];

      addMessage({ role: "user", text });
      setIsTyping(true);
      setStreamingMessage("");

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          body: JSON.stringify({
            messages: apiMessages,
            equipment,
            severity,
            phase,
          }),
        });

        if (!response.ok) throw new Error("API error");

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setStreamingMessage(accumulated);
        }

        if (accumulated) {
          addMessage({ role: "expert", text: accumulated });
        }
      } catch {
        const fallbackMsg = script.expertMessages[mockIndexRef.current];
        if (fallbackMsg) {
          mockIndexRef.current += 1;
          await new Promise((resolve) =>
            setTimeout(resolve, fallbackMsg.delayMs)
          );
          addMessage({ role: "expert", text: fallbackMsg.text });
        }
      }

      setIsTyping(false);
      setStreamingMessage("");
    },
    [chat.messages, isTyping, addMessage, script, equipment, severity, phase]
  );

  const canComplete = chat.nextExpertIndex >= MIN_EXCHANGES;

  useEffect(() => {
    if (chat.messages.length > 0 || chat.nextExpertIndex > 0) return;

    const stored = localStorage.getItem("activity-state");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const chatData = parsed?.state?.[storageKey];
        if (chatData?.messages?.length > 0) return;
      } catch {}
    }

    let mounted = true;

    const sendGreeting = async () => {
      setIsTyping(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          body: JSON.stringify({
            messages: [],
            equipment,
            severity,
            phase,
          }),
        });

        if (!response.ok) throw new Error("API error");

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (!mounted) return;
          accumulated += decoder.decode(value, { stream: true });
          setStreamingMessage(accumulated);
        }

        if (mounted && accumulated) {
          addMessage({ role: "expert", text: accumulated });
        }
      } catch {
        if (!mounted) return;
        const firstMsg = script.expertMessages[0];
        if (firstMsg) {
          setTimeout(() => {
            if (mounted) {
              addMessage({ role: "expert", text: firstMsg.text });
            }
          }, firstMsg.delayMs);
        }
      }

      if (mounted) {
        setIsTyping(false);
        setStreamingMessage("");
      }
    };

    sendGreeting();

    return () => {
      mounted = false;
    };
  }, [chat.messages, chat.nextExpertIndex, addMessage, script, equipment, severity, phase, storageKey]);

  return {
    messages: chat.messages,
    isTyping,
    streamingMessage,
    canComplete,
    sendMessage,
    complete: completeTab,
  };
}
