import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Fish, KeyRound, ScanSearch, ShieldCheck } from "lucide-react";
import {
  ActionButton,
  EmptyState,
  ErrorState,
  GlassCard,
  Notice,
  PageHeader,
  Spinner,
} from "@/components/saathiya/ui";
import { runAi } from "@/lib/ai/service";

export const Route = createFileRoute("/cyber-safety")({
  head: () => ({
    meta: [
      { title: "Cyber Safety — Saathiya AI" },
      {
        name: "description",
        content:
          "Defensive, educational cyber-safety tools: phishing awareness, suspicious-message checks, password safety and an account security checklist.",
      },
      { property: "og:title", content: "Cyber Safety — Saathiya AI" },
      {
        property: "og:description",
        content: "Learn to spot scams, secure accounts and build safer digital habits.",
      },
    ],
  }),
  component: CyberPage,
});

const PHISHING_SIGNS = [
  "Urgency: “your account closes in 2 hours”",
  "Unknown sender asking for OTP, PIN or UPI approval",
  "Link text and real link do not match, or use odd spellings",
  "Prize, refund or KYC message you never asked for",
  "Requests to install a screen-sharing or remote-access app",
  "Grammar or branding that looks slightly wrong",
];

const PASSWORD_TIPS = [
  "Use a long passphrase of 4+ unrelated words instead of one short word",
  "A different password for every important account",
  "Store passwords in a trusted password manager, not in chat or notes",
  "Turn on two-factor authentication wherever it is offered",
  "Change a password immediately if a service reports a breach",
];

const CHECKLIST = [
  "Two-factor authentication enabled on email, bank and social accounts",
  "Recovery phone number and email are current",
  "Reviewed apps and devices that have account access",
  "Phone lock screen, device encryption and auto-updates enabled",
  "Know how to report fraud to your bank and to cybercrime.gov.in",
  "Family members know never to share OTPs, even with “officials”",
];

const LEARNING = [
  { title: "How scams reach you", text: "SMS, WhatsApp, calls, fake job offers, lookalike websites." },
  { title: "Why OTPs matter", text: "An OTP is the final lock on your money — it is never shareable." },
  { title: "Safe browsing habits", text: "Check the address bar, avoid APK files from chat, verify apps." },
  { title: "If something goes wrong", text: "Freeze the account, report fast, keep evidence, change passwords." },
];

function CyberPage() {
  const [message, setMessage] = useState("");
  const [review, setReview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState<string[]>([]);

  async function explain() {
    setError(null);
    setReview(null);
    setLoading(true);
    try {
      const res = await runAi({ task: "cyber-explain", input: message });
      setReview(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cyber Safety"
        title="Defensive skills for everyday digital life"
        description="Learn how scams work so you can avoid them. Saathiya only teaches protection — it will never help create attacks, malware or intrusion tools."
      />

      <Notice title="Educational and defensive only">
        These tools explain warning signs and safe habits. If you have already lost money, contact
        your bank immediately and report the incident to your national cybercrime portal.
      </Notice>

      <GlassCard className="space-y-4">
        <div className="flex items-center gap-3">
          <ScanSearch className="size-5 text-accent" aria-hidden />
          <h2 className="text-base font-semibold">Explain a suspicious message</h2>
        </div>
        <label htmlFor="suspicious" className="sr-only">
          Paste the suspicious message
        </label>
        <textarea
          id="suspicious"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="Paste the SMS, email or WhatsApp text here. Never paste OTPs, passwords or card numbers."
          className="w-full resize-y rounded-xl border border-input bg-background/60 p-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <p className="text-xs text-muted-foreground">
          Tip: remove personal details before pasting anything into any AI tool.
        </p>
        <ActionButton onClick={explain} disabled={loading || !message.trim()} className="w-full sm:w-auto">
          Check warning signs
        </ActionButton>
        {loading ? <Spinner label="Reviewing warning signs" /> : null}
        {error ? <ErrorState message={error} onRetry={explain} /> : null}
        {review ? (
          <div className="space-y-3 rounded-2xl border border-border bg-background/40 p-4">
            <p className="whitespace-pre-line text-sm leading-relaxed">{review}</p>
          </div>
        ) : null}
        {!loading && !error && !review ? (
          <EmptyState
            icon={<ShieldCheck className="size-6" aria-hidden />}
            title="Nothing to review yet"
            description="Paste a message you are unsure about and Saathiya will point out the warning signs."
          />
        ) : null}
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-3 flex items-center gap-3">
            <Fish className="size-5 text-primary" aria-hidden />
            <h2 className="text-base font-semibold">Phishing awareness</h2>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {PHISHING_SIGNS.map((s) => (
              <li key={s} className="flex gap-2.5">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                {s}
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard>
          <div className="mb-3 flex items-center gap-3">
            <KeyRound className="size-5 text-primary" aria-hidden />
            <h2 className="text-base font-semibold">Password safety</h2>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {PASSWORD_TIPS.map((s) => (
              <li key={s} className="flex gap-2.5">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                {s}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="mb-3 flex items-center gap-3">
          <CheckCircle2 className="size-5 text-primary" aria-hidden />
          <h2 className="text-base font-semibold">Account security checklist</h2>
        </div>
        <ul className="space-y-2">
          {CHECKLIST.map((item) => {
            const done = checked.includes(item);
            return (
              <li key={item}>
                <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-border px-3.5 text-sm transition-colors hover:bg-secondary">
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() =>
                      setChecked((prev) =>
                        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
                      )
                    }
                    className="size-5 shrink-0 accent-[var(--primary)]"
                  />
                  <span className={done ? "text-muted-foreground line-through" : ""}>{item}</span>
                </label>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          {checked.length} of {CHECKLIST.length} steps marked done (saved only in this session).
        </p>
      </GlassCard>

      <section aria-labelledby="cyber-learn" className="space-y-4">
        <h2 id="cyber-learn" className="text-lg font-semibold">
          Cyber-safety learning
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {LEARNING.map(({ title, text }) => (
            <GlassCard key={title} interactive>
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}
