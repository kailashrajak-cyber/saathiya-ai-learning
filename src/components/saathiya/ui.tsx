import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  children,
  interactive,
}: {
  className?: string;
  children: ReactNode;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-5",
        interactive &&
          "transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-0.5 hover:glow-ring",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-6 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {description}
      </p>
      {children}
    </header>
  );
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-accent" aria-hidden />
      Demo data
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
      {icon ? <div className="text-primary">{icon}</div> : null}
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-foreground">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="min-h-11 rounded-xl border border-border px-4 text-sm font-semibold transition-colors hover:bg-secondary"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function Notice({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warning";
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4 text-sm leading-relaxed",
        tone === "warning"
          ? "border-accent/40 bg-accent/10 text-foreground"
          : "border-primary/30 bg-primary/10 text-foreground",
      )}
    >
      <p className="mb-1 font-semibold">{title}</p>
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}

export function PrimaryLink({
  to,
  children,
  variant = "solid",
}: {
  to: string;
  children: ReactNode;
  variant?: "solid" | "outline";
}) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-xl px-5 text-sm font-semibold transition-all duration-300",
        variant === "solid"
          ? "bg-primary text-primary-foreground hover:glow-ring"
          : "border border-border bg-surface text-foreground hover:bg-secondary",
      )}
    >
      {children}
    </Link>
  );
}

export function ActionButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:glow-ring disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Spinner({ label = "Working" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground" aria-live="polite">
      <span
        className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
        aria-hidden
      />
      {label}…
    </div>
  );
}
