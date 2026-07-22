"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { ChatMessage } from "@/features/activity/store/activity.store";

interface ChatScript {
  expertMessages: ReadonlyArray<{ text: string; delayMs: number }>;
  userPlaceholder: string;
}

interface UseMockChatReturn {
  messages: ChatMessage[];
  isTyping: boolean;
  canComplete: boolean;
  sendMessage: (text: string) => void;
  complete: () => void;
}

export function useMockChat(
  chat: { messages: ChatMessage[]; nextExpertIndex: number },
  addMessage: (msg: ChatMessage) => void,
  completeTab: () => void,
  script: ChatScript,
  storageKey: "assessmentChat" | "qaChat"
): UseMockChatReturn {
  const [isTyping, setIsTyping] = useState(false);
  const typingRef = useRef(false);

  const canComplete =
    chat.nextExpertIndex >= script.expertMessages.length;

  const sendMessage = useCallback(
    (text: string) => {
      if (typingRef.current) return;
      if (chat.nextExpertIndex >= script.expertMessages.length) return;

      addMessage({ role: "user", text });
      setIsTyping(true);
      typingRef.current = true;

      const expertMsg = script.expertMessages[chat.nextExpertIndex];

      setTimeout(() => {
        addMessage({ role: "expert", text: expertMsg.text });
        setIsTyping(false);
        typingRef.current = false;
      }, expertMsg.delayMs);
    },
    [chat.nextExpertIndex, addMessage, script.expertMessages]
  );

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

    const firstMsg = script.expertMessages[0];
    const timer = setTimeout(() => {
      addMessage({ role: "expert", text: firstMsg.text });
    }, firstMsg.delayMs);

    return () => clearTimeout(timer);
  }, [chat.messages, chat.nextExpertIndex, addMessage, script.expertMessages, storageKey]);

  return {
    messages: chat.messages,
    isTyping,
    canComplete,
    sendMessage,
    complete: completeTab,
  };
}
