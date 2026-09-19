import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bookmark, Brain, MessageSquareText, Sparkles, Trash2, Upload } from "lucide-react";
import {
  ActionButton,
  EmptyState,
  ErrorState,
  GhostButton,
  GlassCard,
  PageHeader,
  Spinner,
} from "@/components/saathiya/ui";
import { runAi } from "@/lib/ai/service";
import { readFileText } from "@/lib/file-text";
import {
  deleteSavedOutput,
  listSavedOutputs,
  saveOutput,
  type SavedOutput,
} from "@/lib/saved-outputs.functions";
import { useAuth } from "@/hooks/useAuth";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WorkspacePage,
});

const STEPS = ["Ask", "Upload", "Analyze", "Explain", "Save"] as const;

function WorkspacePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, loading: authLoading } = useAuth();
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState<{ name: string; text: string | null } | null>(null);
  const [stage, setStage] = useState(0);
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<SavedOutput[]>([]);
  const [savedError, setSavedError] = useState<string | null>(null);
  const [savedLoading, setSavedLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadSaved = useCallback(async () => {
    if (!user) {
      setSaved([]);
      return;
    }
    setSavedLoading(true);
    setSavedError(null);
    try {
      setSaved(await listSavedOutputs());
    } catch {
      setSavedError("Could not load your saved outputs.");
    } finally {
      setSavedLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadSaved();
  }, [loadSaved]);

  async function analyze() {
    setError(null);
    setOutput(null);
    setLoading(true);
    setStage(2);
    try {
      const res = await runAi({
        task: "document-analysis",
        input: question,
        file,
      });
      setOutput(res.text);
      setStage(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed.");
      setStage(1);
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!output || !user) return;
    setSaving(true);
    setSavedError(null);
    try {
      const row = await saveOutput({
        data: {
          title: question.slice(0, 300),
          content: output,
          fileName: file?.name ?? null,
          source: "workspace",
        },
      });
      setSaved((prev) => [row, ...prev]);
      setStage(4);
    } catch {
      setSavedError("Could not save this output. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    setSavedError(null);
    try {
      await deleteSavedOutput({ data: { id } });
      setSaved((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setSavedError("Could not delete that item.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AI Workspace"
        title="Ask → Upload → Analyze → Explain → Save"
        description="A single flow for working through a question with your own material, and keeping what you learn."
      />

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
            <p className="text-sm text-muted-foreground">
              {file
                ? file.text
                  ? `${file.name} — text read, Saathiya will use it`
                  : `${file.name} — text could not be read, paste the key parts into your question`
                : "No file attached"}
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".txt,.md,.csv,.json,.log,.pdf,.doc,.docx"
              className="sr-only"
              onChange={async (e) => {
                const picked = e.target.files?.[0];
                if (!picked) {
                  setFile(null);
                  return;
                }
                setFile({ name: picked.name, text: await readFileText(picked) });
              }}
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <GhostButton onClick={() => inputRef.current?.click()}>Attach file</GhostButton>
              {file ? <GhostButton onClick={() => setFile(null)}>Remove</GhostButton> : null}
            </div>
            <ActionButton
              onClick={analyze}
              disabled={loading || !question.trim()}
              className="w-full"
            >
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
                <p className="whitespace-pre-line text-sm leading-relaxed">{output}</p>
                {user ? (
                  <ActionButton onClick={save} disabled={saving} className="w-full sm:w-auto">
                    <Bookmark className="size-4" aria-hidden />
                    {saving ? "Saving…" : "Save output"}
                  </ActionButton>
                ) : (
                  <Link
                    to="/auth"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 text-sm font-semibold hover:bg-secondary"
                  >
                    <Bookmark className="size-4" aria-hidden />
                    Sign in to save this
                  </Link>
                )}
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
            {savedError ? <ErrorState message={savedError} onRetry={loadSaved} /> : null}
            {authLoading || savedLoading ? <Spinner label="Loading your saved outputs" /> : null}
            {!authLoading && !user ? (
              <EmptyState
                title="Sign in to keep your outputs"
                description="Saved analyses stay in your account, so they are still here next time you open Saathiya."
                action={
                  <Link
                    to="/auth"
                    className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
                  >
                    Sign in
                  </Link>
                }
              />
            ) : null}
            {user && !savedLoading && saved.length === 0 ? (
              <EmptyState
                title="No saved outputs yet"
                description="Run an analysis and tap Save output — it will appear here on every device you sign in on."
              />
            ) : null}
            {user && saved.length > 0 ? (
              <ul className="space-y-3">
                {saved.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-2xl border border-border bg-background/40 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 text-sm font-semibold">{item.title}</p>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        aria-label={`Delete saved output: ${item.title}`}
                        className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary"
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>
                    {item.file_name ? (
                      <p className="mt-1 text-xs text-accent">Attached: {item.file_name}</p>
                    ) : null}
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {item.content}
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
