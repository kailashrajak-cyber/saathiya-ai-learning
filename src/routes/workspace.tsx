import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Bookmark, Brain, MessageSquareText, Sparkles, Upload } from "lucide-react";
import {
  ActionButton,
  DemoBadge,
  EmptyState,
  ErrorState,
  GhostButton,
  GlassCard,
  PageHeader,
  Spinner,
} from "@/components/saathiya/ui";
import { runAi } from "@/lib/ai/service";

export const Route = createFileRoute("/workspace")({
  head: () => ({
    meta: [
      { title: "AI Workspace — Saathiya AI" },
      {
        name: "description",
        content:
          "Ask, upload, analyze, explain and save — one workspace for working through documents and questions with Saathiya AI.",
      },
      { property: "og:title", content: "AI Workspace — Saathiya AI" },
      {
        property: "og:description",
        content: "A five-step workspace: Ask, Upload, Analyze, Explain, Save.",
      },
    ],
  }),
  component: WorkspacePage,
});

const STEPS = ["Ask", "Upload", "Analyze", "Explain", "Save"] as const;

interface SavedOutput {
  id: string;
  question: string;
  file?: string;
  text: string;
}

function WorkspacePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [question, setQuestion] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [stage, setStage] = useState(0);
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<SavedOutput[]>([]);

  async function analyze() {
    setError(null);
    setOutput(null);
    setLoading(true);
    setStage(2);
    try {
      const res = await runAi({
        task: "document-analysis",
        input: question,
        context: fileName ? { file: fileName } : undefined,
      });
      setOutput(
        `${res.text}\n\nExplanation for “${question}”: Saathiya walks through the answer step by step, in simple language, and flags anything that needs a human expert.`,
      );
      setStage(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed.");
      setStage(1);
    } finally {
      setLoading(false);
    }
  }

  function save() {
    if (!output) return;
    setSaved((prev) => [
      { id: crypto.randomUUID(), question, file: fileName ?? undefined, text: output },
      ...prev,
    ]);
    setStage(4);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AI Workspace"
        title="Ask → Upload → Analyze → Explain → Save"
        description="A single flow for working through a question with your own material, and keeping what you learn."
      >
        <DemoBadge />
      </PageHeader>

      <ol className="grid grid-cols-5 gap-1.5" aria-label="Workflow progress">
        {STEPS.map((step, i) => (
          <li
            key={step}
            aria-current={stage === i ? "step" : undefined}
            className={`rounded-xl border px-2 py-2.5 text-center text-[11px] font-semibold transition-colors sm:text-sm ${
              i <= stage
                ? "border-primary/50 bg-primary/15 text-primary"
                : "border-border bg-surface text-muted-foreground"
            }`}
          >
            {step}
          </li>
        ))}
      </ol>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <GlassCard className="space-y-3">
            <div className="flex items-center gap-2.5">
              <MessageSquareText className="size-5 text-primary" aria-hidden />
              <h2 className="text-base font-semibold">Ask</h2>
            </div>
            <label htmlFor="ws-question" className="sr-only">
              Your question
            </label>
            <textarea
              id="ws-question"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (stage < 1) setStage(e.target.value.trim() ? 1 : 0);
              }}
              rows={4}
              placeholder="What do you want to understand? e.g. Summarise this chapter and quiz me on it."
              className="w-full resize-y rounded-xl border border-input bg-background/60 p-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </GlassCard>

          <GlassCard className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Upload className="size-5 text-accent" aria-hidden />
              <h2 className="text-base font-semibold">Upload (optional)</h2>
            </div>
            <p className="text-sm text-muted-foreground">{fileName ?? "No file attached"}</p>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg"
              className="sr-only"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <GhostButton onClick={() => inputRef.current?.click()}>Attach file</GhostButton>
              {fileName ? (
                <GhostButton onClick={() => setFileName(null)}>Remove</GhostButton>
              ) : null}
            </div>
            <ActionButton onClick={analyze} disabled={loading || !question.trim()} className="w-full">
              <Brain className="size-4" aria-hidden />
              Analyze & explain
            </ActionButton>
          </GlassCard>
        </div>

        <div className="space-y-4">
          <GlassCard className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="size-5 text-primary" aria-hidden />
              <h2 className="text-base font-semibold">Results</h2>
            </div>
            {loading ? <Spinner label="Analyzing your input" /> : null}
            {error ? <ErrorState message={error} onRetry={analyze} /> : null}
            {output ? (
              <div className="space-y-3">
                <DemoBadge />
                <p className="whitespace-pre-line text-sm leading-relaxed">{output}</p>
                <ActionButton onClick={save} className="w-full sm:w-auto">
                  <Bookmark className="size-4" aria-hidden />
                  Save output
                </ActionButton>
              </div>
            ) : null}
            {!loading && !error && !output ? (
              <EmptyState
                icon={<Sparkles className="size-6" aria-hidden />}
                title="Nothing analyzed yet"
                description="Ask a question, optionally attach a file, then run the analysis."
              />
            ) : null}
          </GlassCard>

          <GlassCard className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Bookmark className="size-5 text-accent" aria-hidden />
              <h2 className="text-base font-semibold">Saved outputs</h2>
            </div>
            {saved.length === 0 ? (
              <EmptyState
                title="No saved outputs"
                description="Saved results appear here for this session. Persistent saving needs a connected backend."
              />
            ) : (
              <ul className="space-y-3">
                {saved.map((item) => (
                  <li key={item.id} className="rounded-2xl border border-border bg-background/40 p-4">
                    <p className="text-sm font-semibold">{item.question}</p>
                    {item.file ? (
                      <p className="mt-1 text-xs text-accent">Attached: {item.file}</p>
                    ) : null}
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{item.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
