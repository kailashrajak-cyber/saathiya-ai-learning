import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, Apple, Baby, Brain, Droplets, Moon, ShieldAlert } from "lucide-react";
import {
  ActionButton,
  DemoBadge,
  EmptyState,
  ErrorState,
  GlassCard,
  Notice,
  PageHeader,
  Spinner,
} from "@/components/saathiya/ui";
import { runAi } from "@/lib/ai/service";

export const Route = createFileRoute("/health")({
  head: () => ({
    meta: [
      { title: "Health Information — Saathiya AI" },
      {
        name: "description",
        content:
          "General, educational health information from Saathiya AI. Not a diagnosis and not a replacement for a qualified doctor.",
      },
      { property: "og:title", content: "Health Information — Saathiya AI" },
      {
        property: "og:description",
        content: "Educational health topics explained simply, with clear safety guidance.",
      },
    ],
  }),
  component: HealthPage,
});

const CATEGORIES = [
  { icon: Apple, title: "Nutrition basics", text: "Balanced Indian plates, hydration, micronutrients." },
  { icon: Moon, title: "Sleep & rest", text: "Sleep hygiene, screen habits, routine building." },
  { icon: Activity, title: "Daily movement", text: "Simple activity ideas for busy days." },
  { icon: Brain, title: "Mental wellbeing", text: "Stress, focus, study pressure, when to seek help." },
  { icon: Droplets, title: "Seasonal & hygiene", text: "Monsoon care, hand hygiene, safe water." },
  { icon: Baby, title: "Family & everyday care", text: "General care topics for children and elders." },
] as const;

function HealthPage() {
  const [topic, setTopic] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask(value: string) {
    setTopic(value);
    setError(null);
    setLoading(true);
    setAnswer(null);
    try {
      const res = await runAi({ task: "health-info", input: value });
      setAnswer(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Health Information"
        title="Understand health topics in plain language"
        description="Saathiya explains general health concepts for learning purposes. It does not diagnose conditions, prescribe treatment, or replace a qualified healthcare professional."
      >
        <DemoBadge />
      </PageHeader>

      <Notice tone="warning" title="Important safety notice">
        For chest pain, breathing difficulty, heavy bleeding, fainting, suicidal thoughts, or any
        emergency, contact a doctor or local emergency services immediately. Never delay
        professional care based on information from this app.
      </Notice>

      <GlassCard className="space-y-4">
        <label htmlFor="health-topic" className="block text-sm font-semibold">
          Ask about a general health topic
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="health-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. What does a balanced diet look like?"
            className="min-h-12 flex-1 rounded-xl border border-input bg-background/60 px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <ActionButton onClick={() => ask(topic)} disabled={loading || !topic.trim()}>
            Explain
          </ActionButton>
        </div>

        {loading ? <Spinner label="Preparing educational information" /> : null}
        {error ? <ErrorState message={error} onRetry={() => ask(topic)} /> : null}
        {answer ? (
          <div className="space-y-3 rounded-2xl border border-border bg-background/40 p-4">
            <DemoBadge />
            <p className="text-sm leading-relaxed">{answer}</p>
            <p className="text-xs text-muted-foreground">
              Educational information only — please confirm with a qualified doctor.
            </p>
          </div>
        ) : null}
        {!loading && !error && !answer ? (
          <EmptyState
            icon={<ShieldAlert className="size-6" aria-hidden />}
            title="Nothing asked yet"
            description="Pick a category below or type a general health question to see an educational explanation."
          />
        ) : null}
      </GlassCard>

      <section aria-labelledby="health-categories" className="space-y-4">
        <h2 id="health-categories" className="text-lg font-semibold">
          Educational categories
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map(({ icon: Icon, title, text }) => (
            <GlassCard key={title} interactive>
              <button
                type="button"
                onClick={() => ask(title)}
                className="w-full text-left"
                aria-label={`Learn about ${title}`}
              >
                <div className="mb-3 grid size-10 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
              </button>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}
