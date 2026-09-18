import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { FileText, ListChecks, MessageCircleQuestion, Upload } from "lucide-react";
import {
  ActionButton,
  DemoBadge,
  EmptyState,
  ErrorState,
  GhostButton,
  GlassCard,
  Notice,
  PageHeader,
  Spinner,
} from "@/components/saathiya/ui";
import { runAi } from "@/lib/ai/service";

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
    ],
  }),
  component: DocumentsPage,
});

interface DocResult {
  summary: string;
  points: string[];
  questions: string[];
}

const DEMO_RESULT: DocResult = {
  summary:
    "Demo summary: this document appears to cover three main themes, each introduced with a definition and supported by examples. A real analysis will quote the document itself.",
  points: [
    "Demo point — the core argument is stated early and repeated in the conclusion.",
    "Demo point — two dates and one figure are worth memorising.",
    "Demo point — one section contains definitions likely to be asked in exams.",
    "Demo point — an appendix holds supporting data referenced earlier.",
  ],
  questions: [
    "What is the main argument of this document?",
    "Which examples support the second theme?",
    "How would you summarise this in five sentences?",
  ],
};

function DocumentsPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<DocResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    if (!fileName) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      await runAi({ task: "document-analysis", input: fileName });
      setResult(DEMO_RESULT);
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
        description="Upload a PDF, DOCX or text file and Saathiya returns a structured summary, the points that matter, and questions to test yourself."
      >
        <DemoBadge />
      </PageHeader>

      <Notice title="Your files stay on your device for now">
        No document leaves the browser in this demo build. When a secure backend is connected,
        uploads will be processed server-side with keys held in environment variables.
      </Notice>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <GlassCard className="space-y-4">
          <h2 className="text-base font-semibold">1 · Upload</h2>
          <div className="rounded-2xl border border-dashed border-border p-6 text-center">
            <Upload className="mx-auto size-7 text-primary" aria-hidden />
            <p className="mt-3 text-sm font-medium">{fileName ?? "No document selected"}</p>
            <p className="mt-1 text-xs text-muted-foreground">PDF, DOCX or TXT · up to 20 MB</p>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="sr-only"
              onChange={(e) => {
                setFileName(e.target.files?.[0]?.name ?? null);
                setResult(null);
                setError(null);
              }}
            />
            <GhostButton className="mt-4 w-full" onClick={() => inputRef.current?.click()}>
              Choose file
            </GhostButton>
          </div>
          <ActionButton onClick={analyze} disabled={!fileName || loading} className="w-full">
            {loading ? "Analyzing…" : "Analyze document"}
          </ActionButton>
        </GlassCard>

        <GlassCard className="space-y-4">
          <h2 className="text-base font-semibold">2 · Structured results</h2>
          {loading ? <Spinner label="Reading and structuring your document" /> : null}
          {error ? <ErrorState message={error} onRetry={analyze} /> : null}
          {result ? (
            <div className="space-y-4">
              <DemoBadge />
              <section className="rounded-2xl border border-border bg-background/40 p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <FileText className="size-4 text-primary" aria-hidden /> Summary
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
              </section>
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
