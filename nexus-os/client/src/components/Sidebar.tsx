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
import { LogoMark } from "@/components/LogoMark";

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
    <aside className="w-[17rem] shrink-0 border-r border-[var(--color-border)] flex flex-col min-h-0 bg-[var(--color-surface)]/80">
      {/* Brand — matches Console homepage presence */}
      <div className="px-5 py-6 flex items-center gap-3 border-b border-[var(--color-border)]/70 shrink-0">
        <LogoMark size="md" />
        <div className="min-w-0">
          <p className="font-extrabold text-[15px] leading-tight tracking-tight">Nexus OS</p>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">Autonomous AI</p>
        </div>
      </div>

      <nav className="flex-1 min-h-0 overflow-y-auto nx-scroll px-3 py-4 space-y-1.5">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = view === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              className={clsx(
                "w-full shrink-0 flex items-center gap-3 px-3.5 py-3 rounded-xl text-[15px] font-medium transition-all text-left",
                active
                  ? "nx-glass text-[var(--color-text)] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-white/[0.04]",
              )}
            >
              <Icon className="w-[18px] h-[18px] shrink-0 opacity-90" />
              <span className="truncate">{label}</span>
              {id === "approvals" && status && status.pendingApprovals > 0 && (
                <span className="ml-auto shrink-0 text-[10px] font-bold rounded-full px-2 py-0.5 bg-emerald-500/25 text-emerald-200 border border-emerald-500/30">
                  {status.pendingApprovals}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 shrink-0 border-t border-[var(--color-border)]/70">
        <div className="nx-glass rounded-xl px-4 py-3.5 text-xs space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[var(--color-muted)]">Mode</span>
            <span className={clsx("font-semibold", status?.mode === "live" ? "text-emerald-300" : "text-indigo-300")}>
              {status?.mode === "live" ? "● LIVE" : "● DEMO"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[var(--color-muted)]">Hub</span>
            <span className={status?.hubConnected ? "text-emerald-300" : "text-amber-300"}>
              {status?.hubConnected ? "connected" : "built-in"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[var(--color-muted)]">Model</span>
            <span className="font-mono text-[10px] text-[var(--color-text)] truncate max-w-[7.5rem] text-right">
              {status?.model ?? "—"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
