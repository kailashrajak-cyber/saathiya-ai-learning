import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { GlassCard, ActionButton, GhostButton } from "@/components/saathiya/ui";
import { PY_MODULES, PY_PROJECT } from "@/lib/learn/python";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn/python/$moduleId")({
  loader: ({ params }) => {
    const index = PY_MODULES.findIndex((m) => m.id === params.moduleId);
    if (index < 0) throw notFound();
    return { index };
  },
  head: ({ loaderData }) => {
    const m = loaderData ? PY_MODULES[loaderData.index] : null;
    if (!m) return { meta: [{ title: "Lesson not found | Saathiya AI" }, { name: "robots", content: "noindex" }] };
    const title = `${m.title} — Python Fundamentals | Saathiya AI`;
    const desc = m.explain[0]!;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: PyNotFound,
  component: PyLessonPage,
});

function PyNotFound() {
  return (
    <div className="space-y-4 text-center">
      <p>This lesson doesn't exist.</p>
      <Link to="/learn/python" className="text-primary underline">Back to Python course</Link>
    </div>
  );
}

function Code({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border bg-background/70 p-3 text-xs leading-relaxed sm:text-sm"><code>{code}</code></pre>
  );
}

function Reveal({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return open ? <div className="space-y-2">{children}</div> : <GhostButton onClick={() => setOpen(true)}>{label}</GhostButton>;
}

const STEPS = ["Learn", "Understand", "Practice", "Quiz", "Complete"];

function PyLessonPage() {
  const { index } = Route.useLoaderData();
  const m = PY_MODULES[index]!;
  const nextM = PY_MODULES[index + 1];
  const prevM = PY_MODULES[index - 1];
  const p = useLearningProgress();
  const done = !!p.modules[m.id]?.lessonAt;
  const isProject = m.id === "py-project";
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [checks, setChecks] = useState<number[]>([]);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
  }, [m.id]);

  if (p.ready && !p.pyUnlocked) {
    return (
      <GlassCard className="mx-auto max-w-xl space-y-3 text-center">
        <Lock className="mx-auto size-8 text-accent" aria-hidden />
        <h1 className="text-xl font-semibold">Python unlocks after AI Fundamentals</h1>
        <p className="text-sm text-muted-foreground">Complete all AI Fundamentals lessons to start the Python course.</p>
        <Link to="/learn" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">Go to AI Fundamentals</Link>
      </GlassCard>
    );
  }

  const score = m.quiz.filter((q, i) => answers[i] === q.answer).length;
  const quizDone = !!p.modules[m.id]?.quizAt;

  return (
    <article className="mx-auto max-w-3xl space-y-5">
      <Link to="/learn/python" className="inline-flex min-h-10 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden /> Python modules
      </Link>
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Python · Module {index + 1} of {PY_MODULES.length} · {m.minutes} min
        </p>
        <h1 className="text-2xl font-semibold sm:text-3xl">{m.title}</h1>
        <ol className="flex flex-wrap gap-1.5 text-[11px]" aria-label="Lesson flow">
          {STEPS.map((s, i) => (
            <li key={s} className={cn("rounded-full border px-2.5 py-1", i < 3 || (i === 3 && (quizDone || submitted)) || (i === 4 && done) ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground")}>
              {i + 1}. {s}
            </li>
          ))}
        </ol>
      </header>

      <GlassCard className="space-y-3">
        <h2 className="text-lg font-semibold">1. Learn</h2>
        {m.explain.map((t) => <p key={t} className="text-sm leading-relaxed text-muted-foreground sm:text-base">{t}</p>)}
      </GlassCard>

      <div className="grid gap-5 sm:grid-cols-2">
        <GlassCard>
          <h2 className="mb-3 text-lg font-semibold">2. Key concepts</h2>
          <dl className="space-y-2 text-sm">
            {m.concepts.map((t) => (
              <div key={t.term}>
                <dt className="font-semibold text-primary">{t.term}</dt>
                <dd className="text-muted-foreground">{t.meaning}</dd>
              </div>
            ))}
          </dl>
        </GlassCard>
        <GlassCard>
          <h2 className="mb-3 text-lg font-semibold">Real-world examples</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {m.examples.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </GlassCard>
      </div>

      <GlassCard className="space-y-4">
        <h2 className="text-lg font-semibold">Code examples</h2>
        {m.code.map((c) => (
          <div key={c.title} className="min-w-0 space-y-2">
            <p className="text-sm font-semibold">{c.title}</p>
            <Code code={c.code} />
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Output</p>
            <Code code={c.output} />
          </div>
        ))}
      </GlassCard>

      {isProject ? (
        <GlassCard className="space-y-4 border-accent/40">
          <h2 className="text-lg font-semibold text-accent">3. Project: {PY_PROJECT.title}</h2>
          <p className="text-sm text-muted-foreground">{PY_PROJECT.goal}</p>
          <ul className="list-disc space-y-1 pl-5 text-sm">{PY_PROJECT.features.map((f) => <li key={f}>{f}</li>)}</ul>
          <ol className="space-y-4">
            {PY_PROJECT.steps.map((s, i) => (
              <li key={s.title} className="min-w-0 space-y-2 rounded-xl border border-border p-3">
                <p className="font-semibold">Step {i + 1}: {s.title}</p>
                <p className="text-sm text-muted-foreground">{s.task}</p>
                <Reveal label="Show hint"><p className="text-sm"><span className="font-semibold text-primary">Hint: </span>{s.hint}</p>
                  <Reveal label="Show sample code"><Code code={s.code} /></Reveal>
                </Reveal>
              </li>
            ))}
          </ol>
          <div className="min-w-0 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Expected output (example run)</p>
            <Code code={PY_PROJECT.expected} />
          </div>
          <fieldset className="space-y-2">
            <legend className="mb-1 text-sm font-semibold">Project checklist</legend>
            {PY_PROJECT.checklist.map((c, i) => (
              <label key={c} className="flex min-h-11 items-center gap-3 text-sm">
                <input type="checkbox" className="size-5 accent-[var(--primary)]" checked={checks.includes(i) || p.pyProjectDone === 1}
                  disabled={p.pyProjectDone === 1}
                  onChange={() => setChecks((x) => (x.includes(i) ? x.filter((y) => y !== i) : [...x, i]))} />
                {c}
              </label>
            ))}
          </fieldset>
          {p.pyProjectDone ? (
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><CheckCircle2 className="size-5" aria-hidden /> Project completed</p>
          ) : (
            <ActionButton disabled={checks.length < PY_PROJECT.checklist.length} onClick={p.completePyProject}>Mark project complete</ActionButton>
          )}
        </GlassCard>
      ) : (
        <GlassCard className="space-y-3">
          <h2 className="text-lg font-semibold">3. Try it yourself: {m.exercise.title}</h2>
          <p className="text-sm text-muted-foreground">{m.exercise.task}</p>
          <p className="text-xs text-muted-foreground">Write and run it in your own Python editor — Saathiya does not run code in the browser.</p>
          <div className="min-w-0 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Expected output</p>
            <Code code={m.exercise.expected} />
          </div>
          <Reveal label="Show hint">
            <p className="text-sm"><span className="font-semibold text-primary">Hint: </span>{m.exercise.hint}</p>
            <Reveal label="Show sample solution"><Code code={m.exercise.solution} /></Reveal>
          </Reveal>
        </GlassCard>
      )}

      <GlassCard className="space-y-4">
        <h2 className="text-lg font-semibold">4. Quiz</h2>
        {m.quiz.map((q, qi) => (
          <fieldset key={q.q} className="space-y-2">
            <legend className="mb-1 text-sm font-semibold">{qi + 1}. {q.q}</legend>
            {q.options.map((o, oi) => {
              const picked = answers[qi] === oi;
              const correct = submitted && oi === q.answer;
              const wrong = submitted && picked && oi !== q.answer;
              return (
                <button key={o} type="button" disabled={submitted}
                  onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                  className={cn(
                    "block min-h-11 w-full rounded-xl border border-border px-3 py-2 text-left text-sm transition-colors",
                    picked && !submitted && "border-primary bg-primary/15",
                    correct && "border-primary bg-primary/20",
                    wrong && "border-destructive bg-destructive/15",
                  )}>
                  {o}
                </button>
              );
            })}
          </fieldset>
        ))}
        {submitted ? (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold" aria-live="polite">You scored {score} / {m.quiz.length}</p>
            <GhostButton onClick={() => { setAnswers({}); setSubmitted(false); }}>Retry quiz</GhostButton>
          </div>
        ) : (
          <ActionButton disabled={Object.keys(answers).length < m.quiz.length} onClick={() => { setSubmitted(true); p.saveQuiz(m.id, score, m.quiz.length); }}>
            Submit quiz
          </ActionButton>
        )}
      </GlassCard>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        {done ? (
          <p className="inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-primary">
            <CheckCircle2 className="size-5" aria-hidden /> Lesson completed
          </p>
        ) : (
          <ActionButton onClick={() => p.completeLesson(m.id)}>5. Mark as complete</ActionButton>
        )}
        <div className="flex gap-3">
          {prevM ? (
            <Link to="/learn/python/$moduleId" params={{ moduleId: prevM.id }} className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold hover:bg-secondary">Previous</Link>
          ) : null}
          {nextM ? (
            <Link to="/learn/python/$moduleId" params={{ moduleId: nextM.id }} className="inline-flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-xl border border-primary/50 bg-primary/15 px-4 text-sm font-semibold text-primary">
              Next lesson <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : (
            <Link to="/progress" className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-primary/50 bg-primary/15 px-4 text-sm font-semibold text-primary">View my progress</Link>
          )}
        </div>
      </div>
    </article>
  );
}
