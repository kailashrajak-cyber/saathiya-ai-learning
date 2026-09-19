import { createLovableAiGatewayRunIdFetch } from "@/lib/ai-gateway.server";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

export interface GenerateOptions {
  system: string;
  messages: { role: "user" | "assistant"; content: string }[];
}

/** Single place where Saathiya talks to the AI gateway. Server-only. */
export async function generateSaathiyaText({ system, messages }: GenerateOptions) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured yet. Please try again later.");

  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const lovable = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey: key,
    headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: lovable.responses("openai/gpt-6-astra"),
    system,
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
  return text.trim();
}
