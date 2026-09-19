import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import {
  ActionButton,
  ErrorState,
  GhostButton,
  GlassCard,
  Notice,
  PageHeader,
} from "@/components/saathiya/ui";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Saathiya AI" },
      {
        name: "description",
        content:
          "Sign in to Saathiya AI to keep your saved workspace outputs available on any device.",
      },
      { property: "og:title", content: "Sign in — Saathiya AI" },
      {
        property: "og:description",
        content: "Create a Saathiya AI account to save and revisit your workspace outputs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (user) void navigate({ to: "/workspace" });
  }, [user, navigate]);

  async function submit() {
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/workspace` },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setInfo("Check your inbox for a confirmation link, then sign in.");
          setMode("signin");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not complete that. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("Google sign-in did not complete. Please try again.");
      return;
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader
        eyebrow="Your account"
        title={mode === "signin" ? "Welcome back" : "Create your account"}
        description="An account keeps your saved workspace outputs with you — on your phone and any other device."
      />

      <GlassCard className="space-y-4">
        <button
          type="button"
          onClick={google}
          className="min-h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm font-semibold transition-colors hover:bg-secondary"
        >
          Continue with Google
        </button>

        <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or use email
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="auth-email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-12 w-full rounded-xl border border-input bg-background/60 px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="auth-password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-h-12 w-full rounded-xl border border-input bg-background/60 px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        {error ? <ErrorState message={error} /> : null}
        {info ? <Notice title="Almost there">{info}</Notice> : null}

        <ActionButton
          onClick={submit}
          disabled={busy || !email.trim() || password.length < 6}
          className="w-full"
        >
          {mode === "signin" ? (
            <>
              <LogIn className="size-4" aria-hidden /> Sign in
            </>
          ) : (
            <>
              <UserPlus className="size-4" aria-hidden /> Create account
            </>
          )}
        </ActionButton>

        <GhostButton
          className="w-full"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setInfo(null);
          }}
        >
          {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
        </GhostButton>

        <p className="text-xs text-muted-foreground">
          You can use chat, study tools, health information and cyber safety without an account.
          Signing in only adds saving.{" "}
          <Link to="/chat" className="font-semibold text-primary">
            Go to chat
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
