import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req: Request) {
  const { messages: rawMessages, equipment, severity, phase } = await req.json();
  const messages = rawMessages.length === 0
    ? [{ role: "user", content: "I need help with the equipment." }]
    : rawMessages.map((m: { role: string; text: string }) => ({
        role: m.role === "expert" ? "assistant" as const : "user" as const,
        content: m.text,
      }));

  const systemPrompt =
    phase === "assessment"
      ? `You are a remote support expert helping a field technician diagnose equipment.
Equipment: ${equipment} (${severity}).
Keep responses very short (1-3 sentences). Guide the technician one step at a time.
Start with a brief greeting and first diagnostic step.`
      : `You are a remote support expert verifying a completed repair.
Equipment: ${equipment} (${severity}).
Keep responses very short (1-3 sentences). Ask the technician to confirm specific readings or results.
Start with a brief acknowledgement and first verification question.`;

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
}
