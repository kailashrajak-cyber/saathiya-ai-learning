import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpenCheck,
  Dumbbell,
  GraduationCap,
  Route,
  FileText,
  HeartPulse,
  Home,
  LayoutPanelTop,
  LogIn,
  MessagesSquare,
  ShieldCheck,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/learn", label: "Learn", icon: GraduationCap },
  { to: "/practice", label: "Practice", icon: Dumbbell },
  { to: "/roadmap", label: "Roadmap", icon: Route },
  { to: "/progress", label: "My Progress", icon: BarChart3 },
  { to: "/chat", label: "AI Assistant", icon: MessagesSquare },
  { to: "/student", label: "Student AI", icon: BookOpenCheck },
  { to: "/workspace", label: "Workspace", icon: LayoutPanelTop },
  { to: "/health", label: "Health Info", icon: HeartPulse },
  { to: "/cyber-safety", label: "Cyber Safety", icon: ShieldCheck },
  { to: "/documents", label: "Documents", icon: FileText },
] as const;

export function SaathiyaMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-xl border border-primary/40 bg-primary/15 font-display text-sm font-bold text-primary",
        className,
      )}
      aria-hidden
    >
      स
    </span>
  );
}

function HeaderAuthButton() {
  const { user } = useAuth();
  return (
    <Link
      to={user ? "/account" : "/auth"}
      className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl border border-border bg-background/60 px-3 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
      aria-label={user ? "Account" : "Sign in"}
    >
      {user ? <User className="size-4" aria-hidden /> : <LogIn className="size-4" aria-hidden />}
      <span className="hidden sm:inline">{user ? "Account" : "Sign In"}</span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-6xl px-4 py-3">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <Link to="/" className="flex min-w-0 items-center gap-2.5">
              <SaathiyaMark />
              <span className="min-w-0">
                <span className="block truncate font-display text-base font-semibold leading-tight">
                  Saathiya AI
                </span>
                <span className="block truncate text-[11px] text-muted-foreground">
                  Learn · Understand · Stay safer
                </span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <HeaderAuthButton />
              <Link
                to="/chat"
                className="inline-flex min-h-10 shrink-0 items-center rounded-xl bg-primary px-3.5 text-xs font-semibold text-primary-foreground sm:text-sm"
              >
                Start Chatting
              </Link>
            </div>
          </div>

          <nav
            aria-label="Main"
            className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary"
                activeProps={{
                  className:
                    "border-primary/50 bg-primary/15 text-primary hover:bg-primary/15 font-semibold",
                }}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-10">{children}</main>

      <footer className="border-t border-border px-4 py-6">
        <div className="mx-auto w-full max-w-6xl space-y-2 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Saathiya AI</p>
          <p>
            Educational assistant for learning, general health information and cyber safety. Not a
            substitute for a doctor, teacher or legal advice. Cyber-safety content is defensive and
            educational only.
          </p>
        </div>
      </footer>
    </div>
  );
}
