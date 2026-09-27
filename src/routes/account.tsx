import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Bookmark, KeyRound, LogOut, Trash2, User } from "lucide-react";
import {
  ActionButton,
  EmptyState,
  ErrorState,
  GhostButton,
  GlassCard,
  Notice,
  PageHeader,
  Spinner,
} from "@/components/saathiya/ui";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  deleteSavedOutput,
  listSavedOutputs,
  type SavedOutput,
} from "@/lib/saved-outputs.functions";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Your account — Saathiya AI" },
      {
        name: "description",
        content: "View your saved Saathiya AI workspace outputs and manage your account.",
      },
      { property: "og:title", content: "Your account — Saathiya AI" },
      {
        property: "og:description",
        content: "Saved outputs, password and sign-out for your Saathiya AI account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccountPage,
});

const inputClass =
  "min-h-12 w-full rounded-xl border border-input bg-background/60 px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

function AccountPage() {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [saved, setSaved] = useState<SavedOutput[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [savedError, setSavedError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [pwBusy, setPwBusy] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setSavedLoading(true);
    setSavedError(null);
    try {
      setSaved(await listSavedOutputs());
    } catch {
      setSavedError("Could not load your saved outputs.");
    } finally {
      setSavedLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(id: string) {
    setSavedError(null);
    try {
      await deleteSavedOutput({ data: { id } });
      setSaved((prev) => prev.filter((i) => i.id !== id));
    } catch {
      setSavedError("Could not delete that item.");
    }
  }

  async function changePassword() {
    setPwMsg(null);
    if (next.length < 6) {
      setPwMsg({ ok: false, text: "New password must be at least 6 characters." });
      return;
    }
    setPwBusy(true);
    const { error } = await supabase.auth.updateUser({
      password: next,
      current_password: current,
    } as Parameters<typeof supabase.auth.updateUser>[0]);
    setPwBusy(false);
    if (error) {
      setPwMsg({ ok: false, text: error.message });
    } else {
      setCurrent("");
      setNext("");
      setPwMsg({ ok: true, text: "Password updated." });
    }
  }

  async function handleSignOut() {
    await signOut();
    void navigate({ to: "/" });
  }

  if (loading) return <Spinner label="Loading your account" />;

  if (!user) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <PageHeader
          eyebrow="Account"
          title="You're not signed in"
          description="Sign in to view your saved outputs and account settings."
        />
        <EmptyState
          icon={<User className="size-6" aria-hidden />}
          title="Sign in to see your account"
          description="Your saved workspace outputs and account settings appear here once you sign in."
          action={
            <Link
              to="/auth"
              className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              Sign in
            </Link>
          }
        />
      </div>
    );
  }

  const isEmailUser = user.app_metadata?.provider === "email";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Account"
        title="Your Saathiya account"
        description="Your saved outputs and account settings, in one place."
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <GlassCard className="space-y-3">
          <div className="flex items-center gap-2.5">
            <Bookmark className="size-5 text-accent" aria-hidden />
            <h2 className="text-base font-semibold">Saved outputs</h2>
          </div>
          {savedError ? <ErrorState message={savedError} onRetry={load} /> : null}
          {savedLoading ? <Spinner label="Loading your saved outputs" /> : null}
          {!savedLoading && !savedError && saved.length === 0 ? (
            <EmptyState
              title="No saved outputs yet"
              description="Run an analysis in the Workspace and tap Save output — it will appear here."
              action={
                <Link
                  to="/workspace"
                  className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
                >
                  Open Workspace
                </Link>
              }
            />
          ) : null}
          {saved.length > 0 ? (
            <ul className="space-y-3">
              {saved.map((item) => {
                const open = openId === item.id;
                return (
                  <li key={item.id} className="rounded-2xl border border-border bg-background/40 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? null : item.id)}
                        aria-expanded={open}
                        className="min-w-0 text-left text-sm font-semibold hover:text-primary"
                      >
                        {item.title}
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        aria-label={`Delete saved output: ${item.title}`}
                        className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary"
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleString("en-IN")}
                      {item.file_name ? ` · ${item.file_name}` : ""}
                    </p>
                    <p
                      className={`mt-2 whitespace-pre-line break-words text-sm text-muted-foreground ${open ? "" : "line-clamp-3"}`}
                    >
                      {item.content}
                    </p>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </GlassCard>

        <div className="space-y-4">
          <GlassCard className="space-y-3">
            <div className="flex items-center gap-2.5">
              <User className="size-5 text-primary" aria-hidden />
              <h2 className="text-base font-semibold">Profile</h2>
            </div>
            <p className="break-all text-sm">{user.email}</p>
            <p className="text-xs text-muted-foreground">
              Signed in with {isEmailUser ? "email" : (user.app_metadata?.provider ?? "account")}
            </p>
            <GhostButton onClick={handleSignOut} className="w-full">
              <LogOut className="size-4" aria-hidden />
              Sign out
            </GhostButton>
          </GlassCard>

          {isEmailUser ? (
            <GlassCard className="space-y-3">
              <div className="flex items-center gap-2.5">
                <KeyRound className="size-5 text-accent" aria-hidden />
                <h2 className="text-base font-semibold">Change password</h2>
              </div>
              <label className="block space-y-1 text-sm">
                <span>Current password</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="block space-y-1 text-sm">
                <span>New password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={next}
                  onChange={(e) => setNext(e.target.value)}
                  className={inputClass}
                />
              </label>
              {pwMsg ? (
                <Notice tone={pwMsg.ok ? "info" : "warning"} title={pwMsg.ok ? "Done" : "Not updated"}>
                  {pwMsg.text}
                </Notice>
              ) : null}
              <ActionButton
                onClick={changePassword}
                disabled={pwBusy || !current || !next}
                className="w-full"
              >
                {pwBusy ? "Updating…" : "Update password"}
              </ActionButton>
            </GlassCard>
          ) : null}
        </div>
      </div>
    </div>
  );
}
