import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, Clock, Lock } from "lucide-react";
import { PageHeader, GlassCard } from "@/components/saathiya/ui";
import { PY_COURSE, PY_MODULES } from "@/lib/learn/python";
import { useLearningProgress } from "@/hooks/useLearningProgress";

export const Route = createFileRoute("/learn/python/")({
  head: () => ({
    meta: [
      { title: "Python Fundamentals — Beginner to Practical | Saathiya AI" },
      { name: "description", content: "A 10-module beginner Python course with code examples, practice tasks, quizzes and a study tracker project." },
      { property: "og:title", content: "Python Fundamentals | Saathiya AI" },
      { property: "og:description", content: "Learn Python step by step: variables, conditions, loops, functions, files and a final project." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PythonCoursePage,
});

function PythonCoursePage() {
  const p = useLearningProgress();
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Learn · Track 2" title={PY_COURSE.title} description={PY_COURSE.description}>
        <div className="max-w-md space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{p.pyLessonsDone} of {PY_MODULES.length} lessons completed</span>
            <span>{p.pyPercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${p.pyPercent}%` }} />
          </div>
        </div>
      </PageHeader>

      {p.ready && !p.pyUnlocked ? (
        <GlassCard className="space-y-3 border-accent/40">
          <p className="inline-flex items-center gap-2 font-semibold text-accent"><Lock className="size-4" aria-hidden /> Unlocks after AI Fundamentals</p>
          <p className="text-sm text-muted-foreground">Complete all AI Fundamentals lessons to start this course. You can still preview the modules below.</p>
          <Link to="/learn" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">Go to AI Fundamentals</Link>
        </GlassCard>
      ) : p.ready && p.pyNext ? (
        <Link to="/learn/python/$moduleId" params={{ moduleId: p.pyNext.id }} className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">
          {p.pyLessonsDone ? `Continue: ${p.pyNext.title}` : "Start lesson 1"}
        </Link>
      ) : null}

      <ol className="space-y-3">
        {PY_MODULES.map((m, i) => {
          const e = p.modules[m.id];
          return (
            <li key={m.id}>
              <Link to="/learn/python/$moduleId" params={{ moduleId: m.id }}>
                <GlassCard interactive className="flex items-center gap-4 p-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 font-display text-sm font-bold text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{m.title}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Clock className="size-3" aria-hidden />{m.minutes} min</span>
                      {e?.quizAt ? <span>Quiz {e.quizScore}/{e.quizTotal}</span> : null}
                    </p>
                  </div>
                  {e?.lessonAt ? (
                    <CheckCircle2 className="size-5 shrink-0 text-primary" aria-label="Completed" />
                  ) : (
                    <Circle className="size-5 shrink-0 text-muted-foreground" aria-label="Not completed" />
                  )}
                </GlassCard>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
