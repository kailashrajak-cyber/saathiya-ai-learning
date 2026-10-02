import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { GlassCard, ActionButton, GhostButton } from "@/components/saathiya/ui";
import { MODULES } from "@/lib/learn/course";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn/$moduleId")({
  loader: ({ params }) => {
    const index = MODULES.findIndex((m) => m.id === params.moduleId);
    if (index < 0) throw notFound();
    return { index };
  },
  head: ({ loaderData }) => {
    const m = loaderData ? MODULES[loaderData.index] : null;
    if (!m) return { meta: [{ title: "Lesson not found | Saathiya AI" }, { name: "robots", content: "noindex" }] };
    const title = `${m.title} — AI Fundamentals | Saathiya AI`;
    return {
      meta: [
        { title },
        { name: "description", content: m.simple },
        { property: "og:title", content: title },
        { property: "og:description", content: m.simple },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: LessonNotFound,
  component: LessonPage,
});

function LessonNotFound() {
  return (
    <div className="space-y-4 text-center">
      <p>This lesson doesn't exist.</p>
      <Link to="/learn" className="text-primary underline">Back to course</Link>
    </div>
  );
}

function LessonPage() {
  const { index } = Route.useLoaderData();
  const m = MODULES[index]!;
  const nextM = MODULES[index + 1];
  const prevM = MODULES[index - 1];
  const p = useLearningProgress();
  const done = !!p.modules[m.id]?.lessonAt;
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
  }, [m.id]);

  const score = m.quiz.filter((q, i) => answers[i] === q.answer).length;
  const submit = () => {
    setSubmitted(true);
    p.saveQuiz(m.id, score, m.quiz.length);
  };

  return (
    <article className="mx-auto max-w-3xl space-y-5">
      <Link to="/learn" className="inline-flex min-h-10 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden /> All modules
      </Link>
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Module {index + 1} of {MODULES.length} · {m.minutes} min
        </p>
        <h1 className="text-2xl font-semibold sm:text-3xl">{m.title}</h1>
      </header>

      <GlassCard className="space-y-3">
        <h2 className="text-lg font-semibold">Lesson</h2>
        {m.lesson.map((t) => <p key={t} className="text-sm leading-relaxed text-muted-foreground sm:text-base">{t}</p>)}
      </GlassCard>

      <GlassCard className="border-accent/40">
        <h2 className="mb-2 text-lg font-semibold text-accent">In simple words</h2>
        <p className="text-sm leading-relaxed sm:text-base">{m.simple}</p>
      </GlassCard>

      <div className="grid gap-5 sm:grid-cols-2">
        <GlassCard>
          <h2 className="mb-3 text-lg font-semibold">Real-world examples</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {m.examples.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </GlassCard>
        <GlassCard>
          <h2 className="mb-3 text-lg font-semibold">Key terms</h2>
          <dl className="space-y-2 text-sm">
            {m.terms.map((t) => (
              <div key={t.term}>
                <dt className="font-semibold text-primary">{t.term}</dt>
                <dd className="text-muted-foreground">{t.meaning}</dd>
              </div>
            ))}
          </dl>
        </GlassCard>
      </div>

      <GlassCard>
        <h2 className="mb-2 text-lg font-semibold">Practice</h2>
        <p className="text-sm text-muted-foreground">{m.practice}</p>
      </GlassCard>

      <GlassCard className="space-y-4">
        <h2 className="text-lg font-semibold">Short quiz</h2>
        {m.quiz.map((q, qi) => (
          <fieldset key={q.q} className="space-y-2">
            <legend className="mb-1 text-sm font-semibold">{qi + 1}. {q.q}</legend>
            {q.options.map((o, oi) => {
              const picked = answers[qi] === oi;
              const correct = submitted && oi === q.answer;
              const wrong = submitted && picked && oi !== q.answer;
              return (
                <button
                  key={o}
                  type="button"
                  disabled={submitted}
                  onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                  className={cn(
                    "block min-h-11 w-full rounded-xl border border-border px-3 py-2 text-left text-sm transition-colors",
                    picked && !submitted && "border-primary bg-primary/15",
                    correct && "border-primary bg-primary/20",
                    wrong && "border-destructive bg-destructive/15",
                  )}
                >
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
          <ActionButton disabled={Object.keys(answers).length < m.quiz.length} onClick={submit}>
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
          <ActionButton onClick={() => p.completeLesson(m.id)}>Mark as complete</ActionButton>
        )}
        <div className="flex gap-3">
          {prevM ? (
            <Link to="/learn/$moduleId" params={{ moduleId: prevM.id }} className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold hover:bg-secondary">
              Previous
            </Link>
          ) : null}
          {nextM ? (
            <Link to="/learn/$moduleId" params={{ moduleId: nextM.id }} className="inline-flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-xl border border-primary/50 bg-primary/15 px-4 text-sm font-semibold text-primary">
              Next lesson <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : (
            <Link to="/progress" className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-primary/50 bg-primary/15 px-4 text-sm font-semibold text-primary">
              View my progress
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
