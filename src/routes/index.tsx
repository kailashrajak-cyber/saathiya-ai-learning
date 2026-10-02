import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpenCheck,
  FileText,
  HeartPulse,
  LayoutPanelTop,
  MessagesSquare,
  ShieldCheck,
  Sparkle,
} from "lucide-react";
import { GlassCard, PrimaryLink } from "@/components/saathiya/ui";
import { TodayGoal } from "@/components/saathiya/TodayGoal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Saathiya AI — AI that helps you learn, understand and stay safer" },
      {
        name: "description",
        content:
          "Saathiya AI is an India-focused AI companion for learning, general health information, wellbeing and cyber safety.",
      },
      { property: "og:title", content: "Saathiya AI" },
      {
        property: "og:description",
        content:
          "An India-focused AI companion for learning, general health information, wellbeing and cyber safety.",
      },
    ],
  }),
  component: Home,
});

const FEATURES = [
  {
    to: "/chat",
    icon: MessagesSquare,
    title: "AI Chat",
    text: "Ask anything in Hindi or English and get clear, patient explanations.",
  },
  {
    to: "/student",
    icon: BookOpenCheck,
    title: "Student AI",
    text: "Explain topics, summarise notes, build quizzes and study plans.",
  },
  {
    to: "/health",
    icon: HeartPulse,
    title: "Health Information",
    text: "General, educational health information — never a diagnosis.",
  },
  {
    to: "/cyber-safety",
    icon: ShieldCheck,
    title: "Cyber Safety",
    text: "Spot phishing, secure your accounts and learn safe habits.",
  },
  {
    to: "/documents",
    icon: FileText,
    title: "Document Intelligence",
    text: "Turn PDFs and notes into summaries, key points and questions.",
  },
] as const;

const FLOW = ["Ask", "Upload", "Analyze", "Explain", "Save"] as const;

function Home() {
  return (
    <div className="space-y-12 sm:space-y-16">
      <section className="glass-strong relative overflow-hidden rounded-3xl px-5 py-10 sm:px-10 sm:py-16">
        <div
          className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-primary/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-10 size-56 rounded-full bg-accent/15 blur-3xl"
          aria-hidden
        />
        <div className="relative space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            <Sparkle className="size-3.5" aria-hidden />
            Made for India
          </span>
          <h1 className="text-4xl font-bold leading-[1.05] sm:text-6xl">
            <span className="text-gradient-saathiya">Saathiya AI</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-2xl">
            AI that helps you learn, understand and stay safer.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <PrimaryLink to="/learn">Start Learning AI</PrimaryLink>
            <PrimaryLink to="/chat" variant="outline">
              Ask the AI Assistant
            </PrimaryLink>
          </div>
        </div>
      </section>

      <section aria-label="Today's learning goal" className="grid gap-4 lg:grid-cols-2">
        <TodayGoal />
        <GlassCard className="space-y-3">
          <h2 className="text-lg font-semibold">AI Fundamentals — Beginner to Practical</h2>
          <p className="text-sm text-muted-foreground">
            10 structured modules with lessons, real-world examples, key terms and quizzes.
          </p>
          <div className="flex flex-wrap gap-3">
            <PrimaryLink to="/learn">View course</PrimaryLink>
            <PrimaryLink to="/roadmap" variant="outline">See roadmap</PrimaryLink>
          </div>
        </GlassCard>
      </section>


      <section aria-labelledby="features" className="space-y-5">
        <div className="space-y-2">
          <h2 id="features" className="text-2xl font-semibold sm:text-3xl">
            Five companions, one Saathiya
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Each space is built for a different everyday need.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ to, icon: Icon, title, text }) => (
            <Link key={to} to={to} className="group">
              <GlassCard interactive className="h-full">
                <div className="mb-4 grid size-11 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                <span className="mt-4 inline-block text-xs font-semibold text-accent">
                  Open {title} →
                </span>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="flow" className="space-y-5">
        <div className="space-y-2">
          <h2 id="flow" className="text-2xl font-semibold sm:text-3xl">
            The Workspace flow
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            A simple path from question to saved understanding.
          </p>
        </div>
        <ol className="grid gap-3 sm:grid-cols-5">
          {FLOW.map((step, i) => (
            <li key={step} className="glass rounded-2xl p-4">
              <span className="font-display text-xs font-bold text-accent">0{i + 1}</span>
              <p className="mt-1 text-sm font-semibold">{step}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
