"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActivityStore } from "@/features/activity/store/activity.store";
import { useAIChat } from "../../assessment/hooks/useAIChat";
import { QA_SCRIPT } from "../constants/qa-chat";
import { MessageBubble } from "@/features/activity/components/MessageBubble";
import { TypingIndicator } from "@/features/activity/components/TypingIndicator";
import { Button } from "@/ui/Button";

export function QATab() {
  const router = useRouter();
  const chat = useActivityStore((s) => s.qaChat);
  const addMessage = useActivityStore((s) => s.addQAMessage);
  const completeQA = useActivityStore((s) => s.completeQA);

  const {
    messages,
    isTyping,
    streamingMessage,
    canComplete,
    sendMessage,
    complete,
  } = useAIChat(
    chat,
    addMessage,
    completeQA,
    QA_SCRIPT,
    "qaChat",
    "qa"
  );

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, streamingMessage]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    sendMessage(trimmed);
    setInput("");
  };

  const handleComplete = () => {
    complete();
    router.push("/analysis");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} text={msg.text} />
        ))}

        {isTyping && streamingMessage && (
          <MessageBubble role="expert" text={streamingMessage} />
        )}

        {isTyping && !streamingMessage && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border bg-surface p-4">
        {canComplete ? (
          <Button onClick={handleComplete} className="w-full">
            Complete & Finish
          </Button>
        ) : (
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={QA_SCRIPT.userPlaceholder}
              disabled={isTyping}
              className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition focus:border-primary disabled:opacity-50"
            />

            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
            >
              Send
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}