import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { FileText, ListChecks, MessageCircleQuestion, Sparkles, Upload } from "lucide-react";
import {
  ActionButton,
  EmptyState,
  ErrorState,
  GhostButton,
  GlassCard,
  Notice,
  PageHeader,
  Spinner,
} from "@/components/saathiya/ui";
import { analyzeDocument, type DocumentAnalysis } from "@/lib/ai/documents.functions";
import { readFileBase64, readFileText } from "@/lib/file-text";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Document Intelligence — Saathiya AI" },
      {
        name: "description",
        content:
          "Upload a PDF or document and get a structured summary, important points and suggested questions.",
      },
      { property: "og:title", content: "Document Intelligence — Saathiya AI" },
      {
        property: "og:description",
        content: "Structured summaries, key points and questions from your documents.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DocumentsPage,
});

const MAX_BYTES = 6 * 1024 * 1024;

interface Picked {
  name: string;
  mediaType: string;
  text: string | null;
  base64: string | null;
}

function DocumentsPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [picked, setPicked] = useState<Picked | null>(null);
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [result, setResult] = useState<DocumentAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPick(file: File | undefined) {
    setResult(null);
    setError(null);
    if (!file) {
      setPicked(null);
      return;
    }
    if (file.size > MAX_BYTES) {
      setPicked(null);
      setError("That file is larger than 6 MB. Please upload a smaller document.");
      return;
    }
    const text = await readFileText(file);
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    setPicked({
      name: file.name,
      mediaType: isPdf ? "application/pdf" : file.type || "text/plain",
      text,
      base64: text ? null : await readFileBase64(file),
    });
    if (!text && !isPdf) {
      setError(
        "This file type can't be read directly. Upload a PDF or a text file (.txt, .md, .csv).",
      );
    }
  }

  async function analyze() {
    if (!picked) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await analyzeDocument({
        data: {
          fileName: picked.name,
          mediaType: picked.mediaType,
          fileText: picked.text,
          fileBase64: picked.text ? null : picked.base64,
          question: question.trim() ? question.trim() : null,
          language,
        },
      });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not analyse this document.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Document Intelligence"
        title="Turn documents into understanding"
        description="Upload a PDF or text file and Saathiya returns a real summary, the points that matter, and questions to test yourself."
      />

      <Notice title="Read only for your analysis">
        Your document is sent securely to the AI only to produce this analysis. Health or legal
        material is explained for understanding, never as professional advice.
      </Notice>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <GlassCard className="space-y-4">
          <h2 className="text-base font-semibold">1 · Upload</h2>
          <div className="rounded-2xl border border-dashed border-border p-6 text-center">
            <Upload className="mx-auto size-7 text-primary" aria-hidden />
            <p className="mt-3 text-sm font-medium">{picked?.name ?? "No document selected"}</p>
            <p className="mt-1 text-xs text-muted-foreground">PDF, TXT, MD or CSV · up to 6 MB</p>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.txt,.md,.csv,.json,.log"
              className="sr-only"
              onChange={(e) => void onPick(e.target.files?.[0])}
            />
            <GhostButton className="mt-4 w-full" onClick={() => inputRef.current?.click()}>
              Choose file
            </GhostButton>
          </div>

          <div>
            <label htmlFor="doc-question" className="text-sm font-medium">
              Ask something about it (optional)
            </label>
            <textarea
              id="doc-question"
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Explain section 2 in simple words"
              className="mt-2 w-full resize-y rounded-xl border border-input bg-background/60 p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex gap-2" role="group" aria-label="Answer language">
            {(["en", "hi"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                aria-pressed={language === lang}
                className={`min-h-11 flex-1 rounded-xl border px-3 text-sm font-semibold transition-colors ${
                  language === lang
                    ? "border-primary/50 bg-primary/15 text-primary"
                    : "border-border bg-surface text-muted-foreground"
                }`}
              >
                {lang === "en" ? "English" : "हिंदी"}
              </button>
            ))}
          </div>

          <ActionButton onClick={analyze} disabled={!picked || loading} className="w-full">
            {loading ? "Analyzing…" : "Analyze document"}
          </ActionButton>
        </GlassCard>

        <GlassCard className="space-y-4">
          <h2 className="text-base font-semibold">2 · Structured results</h2>
          {loading ? <Spinner label="Reading and structuring your document" /> : null}
          {error ? <ErrorState message={error} onRetry={analyze} /> : null}
          {result ? (
            <div className="space-y-4">
              <section className="rounded-2xl border border-border bg-background/40 p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <FileText className="size-4 text-primary" aria-hidden /> Summary
                </h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {result.summary}
                </p>
              </section>

              {result.answer ? (
                <section className="rounded-2xl border border-primary/40 bg-primary/10 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <Sparkles className="size-4 text-primary" aria-hidden /> Answer to your question
                  </h3>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{result.answer}</p>
                </section>
              ) : null}

              <section className="rounded-2xl border border-border bg-background/40 p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <ListChecks className="size-4 text-accent" aria-hidden /> Important points
                </h3>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  {result.points.map((p) => (
                    <li key={p} className="flex gap-2.5">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-border bg-background/40 p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <MessageCircleQuestion className="size-4 text-primary" aria-hidden /> Questions to
                  test yourself
                </h3>
                <ol className="mt-2 space-y-2 text-sm text-muted-foreground">
                  {result.questions.map((q, i) => (
                    <li key={q}>
                      {i + 1}. {q}
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          ) : null}
          {!loading && !error && !result ? (
            <EmptyState
              icon={<FileText className="size-6" aria-hidden />}
              title="No analysis yet"
              description="Choose a document and run the analysis to see its summary, key points and practice questions."
            />
          ) : null}
        </GlassCard>
      </div>
    </div>
  );
}
