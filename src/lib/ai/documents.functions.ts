import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const DocInput = z.object({
  fileName: z.string().min(1).max(200),
  mediaType: z.string().max(120).default("application/octet-stream"),
  /** Extracted plain text (for .txt/.md/.csv/... files). */
  fileText: z.string().max(60000).nullable().default(null),
  /** Base64 file bytes, used for PDFs. */
  fileBase64: z.string().max(9000000).nullable().default(null),
  question: z.string().max(2000).nullable().default(null),
  language: z.enum(["en", "hi"]).default("en"),
});

export interface DocumentAnalysis {
  summary: string;
  points: string[];
  questions: string[];
  answer: string | null;
}

export const analyzeDocument = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => DocInput.parse(input))
  .handler(async ({ data }): Promise<DocumentAnalysis> => {
    if (!data.fileText && !data.fileBase64) {
      throw new Error("This file could not be read. Please upload a PDF or a text file.");
    }
    const { analyzeDocumentWithAi } = await import("./documents.server");
    return analyzeDocumentWithAi(data);
  });
