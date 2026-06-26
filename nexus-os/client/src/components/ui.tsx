import clsx from "clsx";
import type { ReactNode } from "react";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("nx-glass rounded-2xl", className)}>{children}</div>;
}

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: "default" | "live" | "warn" | "ok" | "muted";
  className?: string;
}) {
  const tones: Record<string, string> = {
    default: "bg-white/5 text-[var(--color-muted)] border border-white/10",
    live: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25",
    warn: "bg-amber-500/15 text-amber-300 border border-amber-500/25",
    ok: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25",
    muted: "bg-white/5 text-[var(--color-muted)] border border-white/10",
  };
  return (
    <span className={clsx("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone], className)}>
      {children}
    </span>
  );
}

export function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-bold text-[var(--color-text)]">{title}</h2>
      {sub && <p className="text-sm text-[var(--color-muted)] mt-0.5">{sub}</p>}
    </div>
  );
}

export function Stat({ label, value, accent }: { label: string; value: ReactNode; accent?: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
      <p className="text-2xl font-bold mt-1" style={accent ? { color: accent } : undefined}>
        {value}
      </p>
    </Card>
  );
}
