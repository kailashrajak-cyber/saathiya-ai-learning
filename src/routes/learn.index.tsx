import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { PageHeader, GlassCard } from "@/components/saathiya/ui";
import { TodayGoal } from "@/components/saathiya/TodayGoal";
import { COURSE, MODULES } from "@/lib/learn/course";
import { useLearningProgress } from "@/hooks/useLearningProgress";

export const Route = createFileRoute("/learn/")({
  head: () => ({
    meta: [
      { title: "Courses — AI Fundamentals | Saathiya AI" },
      { name: "description", content: "Learn AI step by step with the AI Fundamentals course: 10 modules with lessons, examples, key terms and quizzes." },
      { property: "og:title", content: "Courses — AI Fundamentals | Saathiya AI" },
      { property: "og:description", content: "A structured beginner-to-practical AI course for Indian students." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  const p = useLearningProgress();
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Learn" title={COURSE.title} description={COURSE.description}>
        <div className="max-w-md space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{p.lessonsDone} of {MODULES.length} lessons completed</span>
            <span>{p.percent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${p.percent}%` }} />
          </div>
        </div>
      </PageHeader>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ol className="space-y-3">
          {MODULES.map((m, i) => {
            const e = p.modules[m.id];
            return (
              <li key={m.id}>
                <Link to="/learn/$moduleId" params={{ moduleId: m.id }}>
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
        <aside><TodayGoal /></aside>
      </div>
    </div>
  );
}
