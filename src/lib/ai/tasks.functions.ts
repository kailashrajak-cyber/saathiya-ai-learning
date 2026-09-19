import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TASKS = [
  "explain",
  "summarize",
  "quiz",
  "study-plan",
  "document-qa",
  "document-analysis",
  "health-info",
  "cyber-explain",
] as const;

const TaskInput = z.object({
  task: z.enum(TASKS),
  input: z.string().min(1).max(20000),
  language: z.enum(["en", "hi"]).default("en"),
  fileName: z.string().max(200).nullable().default(null),
  fileText: z.string().max(40000).nullable().default(null),
});

const BASE = [
  "You are Saathiya AI, a warm, respectful learning companion built for people in India.",
  "Use simple language and Indian everyday examples (rupees, Indian cities, exam boards, local foods).",
  "Structure answers with short headings or bullets. Be practical and specific. Never invent sources, statistics or credentials.",
  "Health topics: general educational information only. Never diagnose or prescribe. Advise consulting a qualified doctor, and urge immediate medical help for emergency symptoms.",
  "Cyber safety: defensive and educational only. Never help with hacking, attacking or bypassing security.",
].join("\n");

const TASK_PROMPT: Record<(typeof TASKS)[number], string> = {
  explain: "Explain the requested topic clearly: a plain-language definition, how it works step by step, a relatable Indian example, a short recap, and one question the learner can test themselves with.",
  summarize:
    "Summarise the supplied notes: 'Key ideas' as bullets, 'Definitions to memorise', and 'Likely exam questions'. Use only the supplied material.",
  quiz: "Create a quiz on the topic: 5 multiple-choice questions with four options each, 2 short-answer questions, then an answer key with one-line explanations.",
  "study-plan":
    "Create a realistic study plan: day-by-day schedule with focus blocks and breaks, what to revise each day, and a self-test at the end. Keep it achievable.",
  "document-qa":
    "Answer the question using the supplied document text. Quote the relevant lines. If the document does not contain the answer, say so plainly instead of guessing.",
  "document-analysis":
    "Analyse the supplied material and produce: 'Summary' (a short paragraph), 'Important points' (bullets), and 'Questions to test yourself' (numbered). Then add a short plain-language explanation of the answer to the user's question.",
  "health-info":
    "Give general, educational health information on the topic. Cover what it means, everyday habits that matter, common myths, and when to see a doctor. End with a one-line reminder that this is not a diagnosis.",
  "cyber-explain":
    "Review the pasted message for scam warning signs. List the warning signs you can see, explain why each is suspicious, give safe next steps (never share OTPs, verify via the official app, report to cybercrime.gov.in or 1930), and state how confident you are.",
};

export const runAiTask = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TaskInput.parse(input))
  .handler(async ({ data }) => {
    const { generateSaathiyaText } = await import("./generate.server");

    const system = [
      BASE,
      TASK_PROMPT[data.task],
      data.language === "hi"
        ? "Reply in simple Hindi (Devanagari), keeping common English technical terms as-is."
        : "Reply in clear, simple English.",
      "Keep the answer under 500 words unless the task needs a longer list.",
    ].join("\n");

    const parts = [data.input];
    if (data.fileName && data.fileText) {
      parts.push(
        `Document "${data.fileName}" content between markers:\n---\n${data.fileText}\n---`,
      );
    } else if (data.fileName) {
      parts.push(
        `A file named "${data.fileName}" was attached but its text could not be read. Answer from the question alone and ask the user to paste the relevant text if needed.`,
      );
    }

    const text = await generateSaathiyaText({
      system,
      messages: [{ role: "user", content: parts.join("\n\n") }],
    });
    return { text };
  });
