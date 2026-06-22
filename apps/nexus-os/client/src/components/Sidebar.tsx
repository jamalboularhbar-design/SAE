import clsx from "clsx";
import {
  Command,
  LayoutDashboard,
  Plug,
  Sparkles,
  Users,
  Brain,
  ScrollText,
  Settings,
  Hexagon,
  CheckCheck,
  type LucideIcon,
} from "lucide-react";
import type { SystemStatus } from "@shared/types";

export type ViewId =
  | "console"
  | "dashboard"
  | "approvals"
  | "integrations"
  | "skills"
  | "team"
  | "hub"
  | "memory"
  | "activity"
  | "settings";

const NAV: { id: ViewId; label: string; icon: LucideIcon }[] = [
  { id: "console", label: "Console", icon: Command },
  { id: "dashboard", label: "Heartbeat", icon: LayoutDashboard },
  { id: "approvals", label: "Approvals", icon: CheckCheck },
  { id: "integrations", label: "Gateway", icon: Plug },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "team", label: "Specialists", icon: Users },
  { id: "hub", label: "Hub", icon: Hexagon },
  { id: "memory", label: "Memory", icon: Brain },
  { id: "activity", label: "Activity", icon: ScrollText },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  view,
  setView,
  status,
}: {
  view: ViewId;
  setView: (v: ViewId) => void;
  status: SystemStatus | null;
}) {
  return (
    <aside className="w-60 shrink-0 border-r border-[var(--color-border)] flex flex-col bg-[var(--color-surface)]/60">
      <div className="px-5 py-5 flex items-center gap-2.5">
        <img
          src={`${import.meta.env.BASE_URL}logo-mark.png`}
          alt="Nexus OS"
          className="w-9 h-9 shrink-0 object-contain bg-transparent"
          decoding="async"
        />
        <div>
          <p className="font-extrabold leading-tight tracking-tight">Nexus OS</p>
          <p className="text-[10px] text-[var(--color-muted)] -mt-0.5">Autonomous AI</p>
        </div>
      </div>

      <nav className="px-3 flex-1 space-y-0.5">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={clsx(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left",
              view === id
                ? "bg-white/[0.06] text-[var(--color-text)] border border-white/10"
                : "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-white/[0.03] border border-transparent"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
            {id === "approvals" && status && status.pendingApprovals > 0 && (
              <span className="ml-auto text-[10px] font-bold rounded-full px-1.5 py-0.5 bg-emerald-500/25 text-emerald-200 border border-emerald-500/30">
                {status.pendingApprovals}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-3">
        <div className="nx-glass rounded-xl px-3 py-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-muted)]">Mode</span>
            <span className={clsx("font-semibold", status?.mode === "live" ? "text-emerald-300" : "text-indigo-300")}>
              {status?.mode === "live" ? "● LIVE" : "● DEMO"}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[var(--color-muted)]">Hub</span>
            <span className={status?.hubConnected ? "text-emerald-300" : "text-amber-300"}>
              {status?.hubConnected ? "connected" : "built-in"}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[var(--color-muted)]">Model</span>
            <span className="font-mono text-[10px] text-[var(--color-text)] truncate max-w-[110px]">{status?.model ?? "—"}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
