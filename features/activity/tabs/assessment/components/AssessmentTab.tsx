"use client";

import { useState, useRef, useEffect } from "react";
import { useActivityStore } from "@/features/activity/store/activity.store";
import { useMockChat } from "../hooks/useMockChat";
import { ASSESSMENT_SCRIPT } from "../constants/assessment-chat";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

export function AssessmentTab() {
  const chat = useActivityStore((s) => s.assessmentChat);
  const addMessage = useActivityStore((s) => s.addAssessmentMessage);
  const completeAssessment = useActivityStore((s) => s.completeAssessment);

  const { messages, isTyping, canComplete, sendMessage, complete } =
    useMockChat(chat, addMessage, completeAssessment, ASSESSMENT_SCRIPT, "assessmentChat");

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;
    sendMessage(trimmed);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} text={msg.text} />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-zinc-800 p-4">
        {canComplete ? (
          <button
            onClick={complete}
            className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
          >
            Complete Assessment
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={ASSESSMENT_SCRIPT.userPlaceholder}
              disabled={isTyping}
              className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition focus:border-blue-500 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
