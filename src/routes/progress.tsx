import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { EmptyState, GlassCard, GhostButton, PageHeader } from "@/components/saathiya/ui";
import { TodayGoal } from "@/components/saathiya/TodayGoal";
import { MODULES, ROADMAP } from "@/lib/learn/course";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { usePracticeProgress } from "@/hooks/usePracticeProgress";
import { CATEGORIES } from "@/lib/practice/content";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "My Progress | Saathiya AI" },
      { name: "description", content: "Track your lessons, quizzes, projects and learning streak in Saathiya AI." },
      { property: "og:title", content: "My Progress | Saathiya AI" },
      { property: "og:description", content: "See your real AI learning progress and continue where you left off." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const p = useLearningProgress();
  const pr = usePracticeProgress();
  const header = (
    <PageHeader
      eyebrow="My progress"
      title="Your learning journey"
      description="Saved on this device. Only lessons and quizzes you've actually completed are counted."
    />
  );
  if (!p.ready) return header;
  if (!p.hasActivity)
    return (
      <div className="space-y-6">
        {header}
        <EmptyState
          icon={<GraduationCap className="size-8" />}
          title="No learning activity yet"
          description="Finish your first lesson or quiz and your progress, streak and stage will appear here."
          action={
            <Link to="/learn" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">
              Start AI Fundamentals
            </Link>
          }
        />
      </div>
    );

  const stats = [
    { label: "Lessons completed", value: `${p.lessonsDone} / ${MODULES.length}` },
    { label: "Quizzes completed", value: `${p.quizzesDone} / ${MODULES.length}` },
    { label: "Projects completed", value: `${p.projectDone} / 1` },
    { label: "Practice completed", value: `${pr.count} / ${CATEGORIES.length}` },
    { label: "Learning streak", value: `${p.streak} day${p.streak === 1 ? "" : "s"}` },
  ];

  return (
    <div className="space-y-6">
      {header}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <GlassCard className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-semibold">AI Fundamentals</span>
              <span className="text-primary">{p.percent}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
              <div className="h-full bg-primary" style={{ width: `${p.percent}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">
              Current stage: <span className="font-semibold text-foreground">{ROADMAP[p.stageIndex]?.title}</span>
            </p>
            {p.next ? (
              <Link to="/learn/$moduleId" params={{ moduleId: p.next.id }} className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">
                Continue: {p.next.title}
              </Link>
            ) : (
              <p className="text-sm font-semibold text-primary">Course complete — well done!</p>
            )}
          </GlassCard>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <GlassCard key={s.label} className="p-4">
                <p className="font-display text-xl font-bold">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </GlassCard>
            ))}
          </div>
          <GhostButton onClick={() => confirm("Reset all learning progress on this device?") && p.reset()}>
            Reset progress
          </GhostButton>
        </div>
        <aside><TodayGoal /></aside>
      </div>
    </div>
  );
}
