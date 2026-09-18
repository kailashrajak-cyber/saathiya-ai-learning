import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpenCheck, CalendarRange, FileQuestion, ListChecks, NotebookPen } from "lucide-react";
import {
  ActionButton,
  DemoBadge,
  EmptyState,
  ErrorState,
  GlassCard,
  PageHeader,
  Spinner,
} from "@/components/saathiya/ui";
import { runAi, type AiRequest } from "@/lib/ai/service";

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [
      { title: "Student AI — Saathiya AI" },
      {
        name: "description",
        content:
          "Explain topics, summarise notes, generate quizzes, build study plans and ask questions from your documents.",
      },
      { property: "og:title", content: "Student AI — Saathiya AI" },
      {
        property: "og:description",
        content: "Study tools built for Indian students: explanations, summaries, quizzes and plans.",
      },
    ],
  }),
  component: StudentPage,
});

const TOOLS: {
  task: AiRequest["task"];
  icon: typeof BookOpenCheck;
  title: string;
  placeholder: string;
  cta: string;
  long?: boolean;
}[] = [
  {
    task: "explain" as AiRequest["task"],
    icon: BookOpenCheck,
    title: "Explain a topic",
    placeholder: "e.g. Explain photosynthesis for class 9",
    cta: "Explain",
  },
  {
    task: "summarize" as AiRequest["task"],
    icon: NotebookPen,
    title: "Summarize notes",
    placeholder: "Paste your notes here…",
    cta: "Summarize",
    long: true,
  },
  {
    task: "quiz" as AiRequest["task"],
    icon: ListChecks,
    title: "Generate quiz",
    placeholder: "e.g. Indian Constitution — fundamental rights",
    cta: "Create quiz",
  },
  {
    task: "study-plan" as AiRequest["task"],
    icon: CalendarRange,
    title: "Create study plan",
    placeholder: "e.g. Board exam revision in 7 days",
    cta: "Build plan",
  },
  {
    task: "document-qa" as AiRequest["task"],
    icon: FileQuestion,
    title: "Ask questions from documents",
    placeholder: "e.g. What are the key formulas in my chapter PDF?",
    cta: "Ask",
  },
] as const;

function StudentPage() {
  const [activeTask, setActiveTask] = useState<AiRequest["task"]>("explain");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tool = TOOLS.find((t) => t.task === activeTask)!;

  async function submit() {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await runAi({ task: activeTask, input });
      setResult(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Student AI"
        title="Study tools that explain, not just answer"
        description="Choose a tool, add your topic or notes, and Saathiya turns it into something you can actually revise from."
      >
        <DemoBadge />
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <nav aria-label="Student tools" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {TOOLS.map(({ task, icon: Icon, title }) => (
            <button
              key={task}
              type="button"
              onClick={() => {
                setActiveTask(task);
                setInput("");
                setResult(null);
                setError(null);
              }}
              aria-pressed={activeTask === task}
              className={`flex min-h-12 items-center gap-3 rounded-xl border px-3.5 text-left text-sm transition-colors ${
                activeTask === task
                  ? "border-primary/50 bg-primary/15 font-semibold text-primary"
                  : "border-border bg-surface text-muted-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              <span className="min-w-0 truncate">{title}</span>
            </button>
          ))}
        </nav>

        <GlassCard className="space-y-4">
          <div className="flex items-center gap-3">
            <tool.icon className="size-5 shrink-0 text-accent" aria-hidden />
            <h2 className="text-base font-semibold">{tool.title}</h2>
          </div>

          <label htmlFor="student-input" className="sr-only">
            {tool.title}
          </label>
          {tool.long ? (
            <textarea
              id="student-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={tool.placeholder}
              rows={7}
              className="w-full resize-y rounded-xl border border-input bg-background/60 p-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          ) : (
            <input
              id="student-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={tool.placeholder}
              className="min-h-12 w-full rounded-xl border border-input bg-background/60 px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          )}

          <ActionButton onClick={submit} disabled={loading || !input.trim()} className="w-full sm:w-auto">
            {tool.cta}
          </ActionButton>

          {loading ? <Spinner label="Thinking" /> : null}
          {error ? <ErrorState message={error} onRetry={submit} /> : null}
          {result ? (
            <div className="space-y-3 rounded-2xl border border-border bg-background/40 p-4">
              <DemoBadge />
              <p className="whitespace-pre-line text-sm leading-relaxed">{result}</p>
            </div>
          ) : null}
          {!loading && !error && !result ? (
            <EmptyState
              icon={<BookOpenCheck className="size-6" aria-hidden />}
              title="No output yet"
              description="Add your topic or notes above and run the tool to see structured study output."
            />
          ) : null}
        </GlassCard>
      </div>
    </div>
  );
}
