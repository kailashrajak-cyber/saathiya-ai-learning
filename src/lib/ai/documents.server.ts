import { createLovableAiGatewayRunIdFetch } from "@/lib/ai-gateway.server";
import { createOpenAI } from "@ai-sdk/openai";
import { Output, streamText, NoObjectGeneratedError } from "ai";
import { z } from "zod";

const AnalysisSchema = z.object({
  summary: z.string(),
  points: z.array(z.string()),
  questions: z.array(z.string()),
  answer: z.string().nullable(),
});

export interface AnalyzeArgs {
  fileName: string;
  mediaType: string;
  fileText: string | null;
  fileBase64: string | null;
  question: string | null;
  language: "en" | "hi";
}

/** Real document analysis through the Lovable AI Gateway. Server-only. */
export async function analyzeDocumentWithAi(args: AnalyzeArgs) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured yet. Please try again later.");

  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const lovable = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey: key,
    headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const system = [
    "You are Saathiya AI, a careful study companion for people in India.",
    "Analyse the supplied document and answer only from its actual contents. Never invent facts, sources or statistics.",
    "summary: one clear paragraph of what the document is and says.",
    "points: 4 to 7 short important points, each specific to the document.",
    "questions: 3 to 5 self-test questions a learner could answer from the document.",
    "answer: if the user asked a question, answer it from the document (say plainly if the document does not contain the answer); otherwise null.",
    args.language === "hi"
      ? "Write all fields in simple Hindi (Devanagari), keeping common English technical terms as-is."
      : "Write all fields in clear, simple English.",
  ].join("\n");

  const parts: Array<Record<string, unknown>> = [
    {
      type: "text",
      text: [
        `Document file name: ${args.fileName}`,
        args.question ? `User question: ${args.question}` : "The user did not ask a specific question.",
        args.fileText
          ? `Document text between markers:\n---\n${args.fileText}\n---`
          : "The document is attached as a file.",
      ].join("\n\n"),
    },
  ];

  if (!args.fileText && args.fileBase64) {
    parts.push({
      type: "file",
      data: args.fileBase64,
      mediaType: args.mediaType || "application/pdf",
      filename: args.fileName,
    });
  }

  try {
    const result = streamText({
      model: lovable.responses("openai/gpt-6-astra"),
      system,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: [{ role: "user", content: parts as any }],
      output: Output.object({ schema: AnalysisSchema }),
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

    const output = await result.output;
    return {
      summary: output.summary.trim(),
      points: output.points.filter(Boolean).slice(0, 8),
      questions: output.questions.filter(Boolean).slice(0, 6),
      answer: output.answer?.trim() ? output.answer.trim() : null,
    };
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error)) {
      throw new Error("Could not read a structured analysis from this document. Please try again.");
    }
    throw error;
  }
}
