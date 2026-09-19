import { createLovableAiGatewayRunIdFetch } from "@/lib/ai-gateway.server";
import { createOpenAI } from "@ai-sdk/openai";
import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

const ChatInput = z.object({
  language: z.enum(["en", "hi"]).default("en"),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      }),
    )
    .min(1)
    .max(30),
  attachment: z
    .object({
      name: z.string().max(200),
      text: z.string().max(20000).nullable(),
    })
    .nullable()
    .default(null),
});

function systemPrompt(language: "en" | "hi") {
  return [
    "You are Saathiya AI, a warm, respectful companion built for people in India.",
    "You help with learning and school/exam topics, general wellbeing and health information, and cyber-safety awareness.",
    "Use simple, encouraging language and Indian everyday examples (rupees, local foods, Indian cities, exam boards).",
    "Health: give general educational information only. Never diagnose, never prescribe medicine or dosages, and advise consulting a qualified doctor for personal concerns. For emergency symptoms, tell the person to seek immediate medical help.",
    "Cyber safety: stay defensive and educational only. Never help with hacking, attacking, or bypassing security. Explain warning signs and safe steps (never share OTPs, verify via official apps, report to cybercrime.gov.in / 1930).",
    "Keep answers well structured with short paragraphs, headings or bullets where useful. Be concise: usually under 250 words unless the user asks for detail.",
    language === "hi"
      ? "Reply in Hindi (Devanagari script), using simple everyday Hindi; keep common English technical terms as-is."
      : "Reply in clear, simple English.",
    "If the user writes in another language or mixes Hinglish, mirror their style.",
  ].join("\n");
}

export const chatWithSaathiya = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured yet. Please try again later.");

    const runIdFetch = createLovableAiGatewayRunIdFetch();
    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: key,
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: runIdFetch.fetch,
    });

    const messages = data.messages.map((m) => ({ role: m.role, content: m.content }));
    if (data.attachment) {
      const attachmentNote = data.attachment.text
        ? `The user attached a file named "${data.attachment.name}". Its text content follows between the markers. Use it to answer.\n---\n${data.attachment.text}\n---`
        : `The user attached a file named "${data.attachment.name}", but its text could not be read in the browser. Ask them to paste the relevant text, or answer from the file name and their question.`;
      messages.unshift({ role: "user", content: attachmentNote });
    }

    const result = streamText({
      model: lovable.responses("openai/gpt-6-astra"),
      system: systemPrompt(data.language),
      messages,
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });

    const text = await result.text;
    return { text: text.trim() };
  });
