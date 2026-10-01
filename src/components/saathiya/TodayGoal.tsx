import { Link } from "@tanstack/react-router";
import { Flame, Target } from "lucide-react";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { GlassCard } from "./ui";

export function TodayGoal() {
  const p = useLearningProgress();
  const next = p.next;
  const message = !p.hasActivity
    ? "Every expert started with lesson one. Ten focused minutes today is a great start."
    : p.activeToday
      ? "You showed up today — that's how real skills are built. Shabaash!"
      : p.courseComplete
        ? "Course complete! Revise one module today to keep it fresh."
        : "Small steps every day beat long sessions once a month. Keep going.";

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          <Target className="size-4" aria-hidden /> Today's goal
        </p>
        <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
          <Flame className="size-3.5" aria-hidden /> {p.ready ? p.streak : 0}-day streak
        </span>
      </div>
      <ul className="space-y-2 text-sm">
        <li>
          <span className="text-muted-foreground">Lesson: </span>
          <span className="font-semibold">{next ? next.title : "Revise any module"}</span>
        </li>
        <li>
          <span className="text-muted-foreground">Practice: </span>
          {next ? next.practice : "Teach one concept from the course to a friend."}
        </li>
        <li>
          <span className="text-muted-foreground">Quiz: </span>
          {next ? `Take the ${next.title} quiz` : "Retake one quiz and aim for full marks"}
        </li>
      </ul>
      <p className="text-sm text-muted-foreground">{message}</p>
      <Link
        to={next ? "/learn/$moduleId" : "/learn"}
        params={next ? { moduleId: next.id } : undefined}
        className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
      >
        {p.hasActivity ? "Continue learning" : "Start lesson 1"}
      </Link>
    </GlassCard>
  );
}
