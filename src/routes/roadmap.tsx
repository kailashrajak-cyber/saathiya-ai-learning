import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { PageHeader } from "@/components/saathiya/ui";
import { ROADMAP, MODULES } from "@/lib/learn/course";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "AI Learning Roadmap | Saathiya AI" },
      { name: "description", content: "Your path from AI beginner to advanced AI: fundamentals, Python, ML, deep learning, generative AI and projects." },
      { property: "og:title", content: "AI Learning Roadmap | Saathiya AI" },
      { property: "og:description", content: "A clear step-by-step AI learning path with your real progress." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RoadmapPage,
});

function RoadmapPage() {
  const p = useLearningProgress();
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Roadmap"
        title="Your AI learning path"
        description="Follow these stages in order. Progress shown here comes only from what you've actually completed."
      />
      <ol className="relative space-y-3 border-l border-border pl-6">
        {ROADMAP.map((s, i) => {
          const fundamentals = s.id === "fundamentals";
          const done = s.id === "beginner" ? p.hasActivity : fundamentals ? p.courseComplete : false;
          const current = !done && i === (p.hasActivity ? 1 : 0);
          const locked = !done && !current;
          const Icon = done ? CheckCircle2 : current ? PlayCircle : Lock;
          return (
            <li key={s.id} className="relative">
              <span
                className={cn(
                  "absolute -left-[37px] top-4 grid size-6 place-items-center rounded-full border bg-background",
                  done || current ? "border-primary text-primary" : "border-border text-muted-foreground",
                )}
              >
                <Icon className="size-3.5" aria-hidden />
              </span>
              <div className={cn("glass rounded-2xl p-4", current && "border-primary/60 glow-ring", locked && "opacity-70")}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{i + 1}. {s.title}</p>
                  <span className="text-xs text-muted-foreground">
                    {done ? "Completed" : current ? "Current stage" : s.course ? "Available" : "Coming soon"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
                {fundamentals ? (
                  <div className="mt-3 space-y-2">
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-primary" style={{ width: `${p.percent}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground">{p.lessonsDone} / {MODULES.length} modules</p>
                    <Link to="/learn" className="inline-flex min-h-10 items-center rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground">
                      {p.hasActivity ? "Continue course" : "Start course"}
                    </Link>
                  </div>
                ) : s.id === "beginner" && !done ? (
                  <Link to="/learn/$moduleId" params={{ moduleId: MODULES[0].id }} className="mt-3 inline-flex min-h-10 items-center rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground">
                    Begin with lesson 1
                  </Link>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
