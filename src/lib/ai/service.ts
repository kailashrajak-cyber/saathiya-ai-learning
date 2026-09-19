/**
 * Modular AI service layer.
 *
 * All AI calls funnel through this module so a secure backend can be plugged in
 * later without touching UI code. Secrets must NEVER live in this file or any
 * client bundle: when a backend is connected, replace `demoAdapter` with a
 * `serverAdapter` that calls a server function / API route which reads keys
 * from environment variables on the server.
 *
 * Until then every response below is clearly labelled demo content.
 */

export const IS_DEMO_MODE = true;
export const DEMO_NOTICE = "Demo response — no AI service connected yet.";

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
  context?: Record<string, string>;
}

export interface AiResponse {
  text: string;
  isDemo: boolean;
  sections?: { title: string; items: string[] }[];
}

export interface AiAdapter {
  run(request: AiRequest): Promise<AiResponse>;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function demoText(request: AiRequest) {
  const hi = request.language === "hi";
  switch (request.task) {
    case "chat":
      return hi
        ? `यह एक डेमो उत्तर है। आपने पूछा: “${request.input}”. असली AI जुड़ने के बाद यहाँ विस्तृत, स्रोत-सहित उत्तर दिखेगा।`
        : `This is a demo answer. You asked: “${request.input}”. Once a secure AI backend is connected, a full, sourced explanation appears here.`;
    case "explain":
      return `Demo explanation of “${request.input}”: starts with a plain-language definition, then a real-world Indian example, then a short recap and one check-your-understanding question.`;
    case "summarize":
      return `Demo summary: the notes you pasted are condensed into 5 key ideas, 3 definitions worth memorising, and 2 likely exam questions.`;
    case "quiz":
      return `Demo quiz on “${request.input}”: 5 multiple-choice questions and 2 short-answer questions with an answer key.`;
    case "study-plan":
      return `Demo study plan for “${request.input}”: a 7-day schedule with daily 45-minute focus blocks, revision days, and a self-test on day 7.`;
    case "document-qa":
      return `Demo answer from your document: the relevant passage would be quoted here with a page reference.`;
    case "document-analysis":
      return `Demo document analysis complete. Structured summary, key points and suggested questions are shown in the results panel.`;
    case "health-info":
      return `Demo general health information about “${request.input}”. This is educational only and is not a diagnosis. Please consult a qualified doctor for personal medical advice.`;
    case "cyber-explain":
      return `Demo safety review: this message shows common warning signs — urgency, an unfamiliar link, and a request for OTP or payment. Never share OTPs, and verify through the official app.`;
    default:
      return DEMO_NOTICE;
  }
}

const demoAdapter: AiAdapter = {
  async run(request) {
    await wait(700 + Math.random() * 600);
    if (!request.input.trim()) {
      throw new Error("Please enter something first.");
    }
    return { text: demoText(request), isDemo: true };
  },
};

let adapter: AiAdapter = demoAdapter;

/** Swap in a backend-backed adapter once secure APIs exist. */
export function setAiAdapter(next: AiAdapter) {
  adapter = next;
}

export function runAi(request: AiRequest) {
  return adapter.run(request);
}

/**
 * Real AI chat. Runs through a server function so the API key stays on the server.
 */
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
