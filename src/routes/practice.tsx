import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { GlassCard, PageHeader, ActionButton, GhostButton } from "@/components/saathiya/ui";
import { CATEGORIES, CONCEPTS, MCQS, PROMPT_TASKS, SCENARIOS, type CategoryId } from "@/lib/practice/content";
import { usePracticeProgress } from "@/hooks/usePracticeProgress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice — AI Fundamentals | Saathiya AI" },
      { name: "description", content: "Practise AI concepts, MCQs, prompt writing and real-world AI scenarios." },
      { property: "og:title", content: "Practice — AI Fundamentals | Saathiya AI" },
      { property: "og:description", content: "Beginner-friendly AI practice: concepts, MCQs, prompts and scenarios." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PracticePage,
});

const inputCls =
  "min-h-24 w-full rounded-xl border border-border bg-background/60 p-3 text-sm outline-none focus:border-primary";

function PracticePage() {
  const [active, setActive] = useState<CategoryId | null>(null);
  const p = usePracticeProgress();

  if (active) {
    const cat = CATEGORIES.find((c) => c.id === active)!;
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <button
          type="button"
          onClick={() => setActive(null)}
          className="inline-flex min-h-10 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden /> All practice
        </button>
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">{cat.title}</h1>
          <p className="text-sm text-muted-foreground">{cat.description}</p>
        </header>
        {active === "concept" && <OpenPractice items={CONCEPTS.map((c) => ({ prompt: c.q, explanation: c.explanation }))} />}
        {active === "mcq" && <McqPractice />}
        {active === "prompt" && <PromptPractice />}
        {active === "scenario" && (
          <OpenPractice items={SCENARIOS.map((s) => ({ context: s.situation, prompt: s.question, explanation: s.explanation }))} />
        )}
        <GlassCard className="flex flex-wrap items-center justify-between gap-3">
          {p.done[active] ? (
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <CheckCircle2 className="size-5" aria-hidden /> Practice completed
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">Finished this activity?</p>
              <ActionButton onClick={() => p.markDone(active)}>Mark as completed</ActionButton>
            </>
          )}
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Practice"
        title="Practise what you learn"
        description="Short activities based on the AI Fundamentals course. Completion is saved on this device."
      />
      {p.ready && (
        <p className="text-sm text-muted-foreground">
          {p.count === 0
            ? "You haven't completed any practice yet — pick one to start."
            : `${p.count} of ${CATEGORIES.length} practice activities completed.`}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {CATEGORIES.map((c) => (
          <button key={c.id} type="button" onClick={() => setActive(c.id)} className="text-left">
            <GlassCard interactive className="flex h-full items-start gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{c.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
              </div>
              {p.done[c.id] ? <CheckCircle2 className="size-5 shrink-0 text-primary" aria-label="Completed" /> : null}
            </GlassCard>
          </button>
        ))}
      </div>
    </div>
  );
}

function OpenPractice({ items }: { items: { context?: string; prompt: string; explanation: string }[] }) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [shown, setShown] = useState(false);
  const item = items[i];
  if (!item)
    return (
      <GlassCard className="space-y-3 text-center">
        <p className="font-semibold">All questions done — nice work!</p>
        <GhostButton onClick={() => { setI(0); setText(""); setShown(false); }}>Start again</GhostButton>
      </GlassCard>
    );
  return (
    <GlassCard className="space-y-3">
      <p className="text-xs text-muted-foreground">Question {i + 1} of {items.length}</p>
      {item.context ? <p className="rounded-xl bg-secondary/60 p-3 text-sm">{item.context}</p> : null}
      <p className="font-semibold">{item.prompt}</p>
      <textarea
        className={inputCls}
        value={text}
        disabled={shown}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your answer…"
        aria-label="Your answer"
      />
      {shown ? (
        <div className="space-y-3">
          <div className="rounded-xl border border-accent/40 p-3 text-sm">
            <p className="mb-1 font-semibold text-accent">Explanation</p>
            <p className="text-muted-foreground">{item.explanation}</p>
            <p className="mt-2 text-xs text-muted-foreground">Compare it with your answer — different wording is fine if the idea matches.</p>
          </div>
          <ActionButton onClick={() => { setI(i + 1); setText(""); setShown(false); }}>Next</ActionButton>
        </div>
      ) : (
        <ActionButton disabled={!text.trim()} onClick={() => setShown(true)}>Submit answer</ActionButton>
      )}
    </GlassCard>
  );
}

function pickFive() {
  return [...MCQS].sort(() => Math.random() - 0.5).slice(0, 5);
}

function McqPractice() {
  const [qs, setQs] = useState(() => MCQS.slice(0, 5));
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const q = qs[i];

  if (!q)
    return (
      <GlassCard className="space-y-3 text-center">
        <p className="font-display text-2xl font-bold">{score} / {qs.length}</p>
        <p className="text-sm text-muted-foreground">Your score for this session.</p>
        <GhostButton onClick={() => { setQs(pickFive()); setI(0); setScore(0); setPicked(null); }}>New session</GhostButton>
      </GlassCard>
    );

  const choose = (oi: number) => {
    if (picked !== null) return;
    setPicked(oi);
    if (oi === q.answer) setScore((s) => s + 1);
  };

  return (
    <GlassCard className="space-y-3">
      <p className="text-xs text-muted-foreground">Question {i + 1} of {qs.length}</p>
      <p className="font-semibold">{q.q}</p>
      {q.options.map((o, oi) => (
        <button
          key={o}
          type="button"
          disabled={picked !== null}
          onClick={() => choose(oi)}
          className={cn(
            "block min-h-11 w-full rounded-xl border border-border px-3 py-2 text-left text-sm",
            picked !== null && oi === q.answer && "border-primary bg-primary/20",
            picked === oi && oi !== q.answer && "border-destructive bg-destructive/15",
          )}
        >
          {o}
        </button>
      ))}
      {picked !== null ? (
        <div className="space-y-3">
          <p className="text-sm" aria-live="polite">
            <span className="font-semibold">{picked === q.answer ? "Correct. " : `Answer: ${q.options[q.answer]}. `}</span>
            <span className="text-muted-foreground">{q.explanation}</span>
          </p>
          <ActionButton onClick={() => { setI(i + 1); setPicked(null); }}>
            {i + 1 < qs.length ? "Next question" : "See score"}
          </ActionButton>
        </div>
      ) : null}
    </GlassCard>
  );
}

function promptFeedback(text: string) {
  const t = text.toLowerCase();
  const notes: string[] = [];
  if (text.trim().split(/\s+/).length < 8) notes.push("Try adding more detail — short prompts often get generic answers.");
  if (!/(student|class|beginner|teacher|for a|for my|i am|i'm)/.test(t)) notes.push("Say who the answer is for (e.g. 'a Class 6 student').");
  if (!/(points|steps|table|list|words|lines|paragraph|format|day)/.test(t)) notes.push("Ask for a format or length (e.g. '5 bullet points').");
  if (!/(simple|easy|polite|formal|friendly|tone|example)/.test(t)) notes.push("Mention the style or tone, or ask for an example.");
  return notes;
}

function PromptPractice() {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [shown, setShown] = useState(false);
  const task = PROMPT_TASKS[i];
  if (!task)
    return (
      <GlassCard className="space-y-3 text-center">
        <p className="font-semibold">All prompt tasks done!</p>
        <GhostButton onClick={() => { setI(0); setText(""); setShown(false); }}>Start again</GhostButton>
      </GlassCard>
    );
  const notes = shown ? promptFeedback(text) : [];
  return (
    <GlassCard className="space-y-3">
      <p className="text-xs text-muted-foreground">Task {i + 1} of {PROMPT_TASKS.length}</p>
      <p className="font-semibold">{task.task}</p>
      <textarea className={inputCls} value={text} disabled={shown} onChange={(e) => setText(e.target.value)} placeholder="Write your prompt…" aria-label="Your prompt" />
      {shown ? (
        <div className="space-y-3 rounded-xl border border-accent/40 p-3 text-sm">
          <p className="font-semibold text-accent">Guidance</p>
          <p className="text-muted-foreground">There's no single perfect prompt. Good prompts for this task usually:</p>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            {task.tips.map((t) => <li key={t}>{t}</li>)}
          </ul>
          {notes.length ? (
            <>
              <p className="font-semibold">Ideas to improve yours</p>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                {notes.map((n) => <li key={n}>{n}</li>)}
              </ul>
            </>
          ) : (
            <p className="text-primary">Your prompt already covers audience, format and style — well done.</p>
          )}
          <ActionButton onClick={() => { setI(i + 1); setText(""); setShown(false); }}>Next task</ActionButton>
        </div>
      ) : (
        <ActionButton disabled={!text.trim()} onClick={() => setShown(true)}>Get feedback</ActionButton>
      )}
    </GlassCard>
  );
}
