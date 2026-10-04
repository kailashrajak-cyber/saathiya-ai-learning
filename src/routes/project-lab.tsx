import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, FlaskConical, Lightbulb } from "lucide-react";
import {
  ActionButton,
  GhostButton,
  GlassCard,
  Notice,
  PageHeader,
} from "@/components/saathiya/ui";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/project-lab")({
  head: () => ({
    meta: [
      { title: "Project Lab | Saathiya AI" },
      {
        name: "description",
        content:
          "Hands-on beginner projects in Saathiya AI. Build the AI Prompt Assistant project and track it in My Progress.",
      },
      { property: "og:title", content: "Project Lab | Saathiya AI" },
      {
        property: "og:description",
        content:
          "Hands-on beginner projects in Saathiya AI. Build the AI Prompt Assistant project and track it in My Progress.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProjectLabPage,
});

const PROJECT = {
  title: "AI Prompt Assistant — Beginner Project",
  objective:
    "Build your own small “prompt assistant”: a set of reusable instructions you can give to any AI tool to get clear, accurate answers for study, health information or everyday questions.",
  learn: [
    "What a prompt is and why the wording changes the answer you get.",
    "How to give an AI a role, a task and clear rules in one prompt.",
    "How to add context (your goal, your level, your language) to get useful results.",
    "How to test and improve a prompt instead of accepting the first answer.",
  ],
  tasks: [
    "Write a basic prompt asking an AI to explain any topic, then note what you dislike about the answer.",
    "Improve it: give the AI a role (for example, “You are a patient teacher for a Class 10 student in India”) and add your goal.",
    "Add rules: ask for a short answer, simple words, one real-life example, and Hindi or English.",
    "Test your final prompt on two different topics and keep the version that gives the best results.",
  ],
  example:
    "Ravi is preparing for exams and keeps getting answers that are too long and too advanced. His first prompt was “Explain photosynthesis”. After this project, his prompt became: “You are a patient science teacher. Explain photosynthesis to a Class 10 student in India in simple English, in 5 short points, with one everyday example like a kitchen or farm.” Now every answer fits his level — and he reuses the same pattern for every subject.",
  checklist: [
    "I wrote a first draft prompt and tested it.",
    "I added a clear role and a clear goal.",
    "I added rules (length, simple words, example, language).",
    "I tested the improved prompt on a second topic.",
    "I saved my final prompt in the box above.",
  ],
};

const STORAGE_KEY = "saathiya-project-lab-v1";

type Saved = { prompt: string; checked: number[] };

function readSaved(): Saved {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { prompt: "", checked: [] };
    const parsed = JSON.parse(raw) as Partial<Saved>;
    return { prompt: parsed.prompt ?? "", checked: parsed.checked ?? [] };
  } catch {
    return { prompt: "", checked: [] };
  }
}

function ProjectLabPage() {
  const p = useLearningProgress();
  const [saved, setSaved] = useState<Saved>({ prompt: "", checked: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSaved(readSaved());
    setReady(true);
  }, []);

  const persist = (next: Saved) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(next);
  };

  const completed = Boolean(p.modules["beginner-project"]?.lessonAt);
  const allChecked = PROJECT.checklist.every((_, i) => saved.checked.includes(i));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Project Lab"
        title={PROJECT.title}
        description="Learn by doing. Complete small, real projects step by step — your progress is saved on this device."
      />

      <GlassCard className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Project objective</p>
        <p className="text-sm leading-relaxed text-foreground sm:text-base">{PROJECT.objective}</p>
      </GlassCard>

      <GlassCard className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">What you will learn</p>
        <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          {PROJECT.learn.map((item) => (
            <li key={item} className="flex gap-2.5">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Step-by-step tasks</p>
        <ol className="space-y-4">
          {PROJECT.tasks.map((task, i) => (
            <li key={task} className="flex gap-3.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-xl border border-primary/40 bg-primary/15 font-display text-sm font-bold text-primary">
                {i + 1}
              </span>
              <p className="pt-1 text-sm leading-relaxed sm:text-base">{task}</p>
            </li>
          ))}
        </ol>
      </GlassCard>

      <GlassCard className="space-y-3 border-accent/30">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          <Lightbulb className="size-4" aria-hidden /> Real-world example
        </p>
        <p className="text-sm leading-relaxed text-foreground sm:text-base">{PROJECT.example}</p>
      </GlassCard>

      <GlassCard className="space-y-3">
        <label htmlFor="project-answer" className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Your prompt / project answer
        </label>
        <p className="text-sm text-muted-foreground">
          Write your improved prompt here. It is saved on this device, so you can come back and continue.
        </p>
        <textarea
          id="project-answer"
          value={saved.prompt}
          onChange={(e) => persist({ ...saved, prompt: e.target.value })}
          placeholder={"You are a patient teacher. Explain … to a Class 10 student in India in simple English/Hindi, in 5 short points, with one everyday example."}
          rows={8}
          className="w-full resize-y rounded-xl border border-border bg-background/70 p-4 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <p className="text-right text-xs text-muted-foreground">
          {saved.prompt.trim().split(/\s+/).filter(Boolean).length} words
        </p>
      </GlassCard>

      <GlassCard className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Checklist</p>
        <ul className="space-y-1">
          {PROJECT.checklist.map((item, i) => {
            const checked = saved.checked.includes(i);
            return (
              <li key={item}>
                <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-2 text-sm transition-colors hover:bg-secondary/60">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() =>
                      persist({
                        ...saved,
                        checked: checked
                          ? saved.checked.filter((c) => c !== i)
                          : [...saved.checked, i],
                      })
                    }
                  />
                  {checked ? (
                    <CheckCircle2 className="size-5 shrink-0 text-primary" aria-hidden />
                  ) : (
                    <Circle className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                  )}
                  <span className={cn(checked ? "text-foreground" : "text-muted-foreground")}>{item}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </GlassCard>

      {completed ? (
        <GlassCard className="flex flex-col gap-2 border-primary/40 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            <CheckCircle2 className="size-5" aria-hidden /> Project completed — see it in My Progress.
          </p>
          <GhostButton
            onClick={() =>
              confirm("Mark this project as not completed?") && p.resetProject()
            }
          >
            Mark as not completed
          </GhostButton>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {!allChecked ? (
            <Notice tone="info" title="Almost there">
              Tick every checklist item before marking the project complete. Saathiya only counts work you have
              really done.
            </Notice>
          ) : null}
          <ActionButton
            onClick={() => p.completeProject()}
            disabled={!allChecked}
            className="w-full sm:w-auto"
          >
            <FlaskConical className="size-4" aria-hidden /> Mark Project Complete
          </ActionButton>
        </div>
      )}
    </div>
  );
}
