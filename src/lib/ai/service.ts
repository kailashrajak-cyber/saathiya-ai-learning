/**
 * Modular AI service layer.
 *
 * Every AI call goes through here and is executed by a server function, so API
 * keys stay on the server and never reach the client bundle.
 */

export const IS_DEMO_MODE = false;

export type Language = "en" | "hi";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  isDemo?: boolean;
  attachmentName?: string;
}

export interface AiRequest {
  task:
    | "chat"
    | "explain"
    | "summarize"
    | "quiz"
    | "study-plan"
    | "document-qa"
    | "document-analysis"
    | "health-info"
    | "cyber-explain";
  input: string;
  language?: Language;
  file?: { name: string; text: string | null } | null;
}

export interface AiResponse {
  text: string;
  isDemo: boolean;
}

/** Runs any Saathiya tool task against the real AI backend. */
export async function runAi(request: AiRequest): Promise<AiResponse> {
  if (!request.input.trim()) throw new Error("Please enter something first.");
  if (request.task === "chat") {
    return runChat({
      messages: [{ role: "user", content: request.input }],
      language: request.language ?? "en",
      attachment: request.file ?? null,
    });
  }

  const { runAiTask } = await import("./tasks.functions");
  const result = await runAiTask({
    data: {
      task: request.task,
      input: request.input,
      language: request.language ?? "en",
      fileName: request.file?.name ?? null,
      fileText: request.file?.text ?? null,
    },
  });
  return { text: result.text, isDemo: false };
}

/** Real AI chat. Runs through a server function so the API key stays on the server. */
export async function runChat(options: {
  messages: { role: "user" | "assistant"; content: string }[];
  language: Language;
  attachment?: { name: string; text: string | null } | null;
}): Promise<AiResponse> {
  const { chatWithSaathiya } = await import("./chat.functions");
  const result = await chatWithSaathiya({
    data: {
      language: options.language,
      messages: options.messages,
      attachment: options.attachment ?? null,
    },
  });
  return { text: result.text, isDemo: false };
}
