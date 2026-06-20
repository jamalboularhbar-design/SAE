import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Sidebar, type ViewId } from "@/components/Sidebar";
import { Console } from "@/views/Console";
import { Dashboard } from "@/views/Dashboard";
import { Approvals } from "@/views/Approvals";
import { Integrations } from "@/views/Integrations";
import { Skills } from "@/views/Skills";
import { Team } from "@/views/Team";
import { Memory } from "@/views/Memory";
import { Activity } from "@/views/Activity";
import { Settings } from "@/views/Settings";
import { HubView } from "@/views/HubView";
import { api } from "@/lib/api";
import type { Specialist, SystemStatus, Workspace } from "@shared/types";

const TITLES: Record<ViewId, string> = {
  console: "Console",
  dashboard: "Heartbeat",
  approvals: "Approvals",
  integrations: "Gateway",
  skills: "Skills",
  team: "Specialists",
  hub: "Hub",
  memory: "Memory",
  activity: "Activity",
  settings: "Settings",
};

export default function App() {
  const [view, setView] = useState<ViewId>("console");
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWs, setActiveWs] = useState<string>("");
  const [wsOpen, setWsOpen] = useState(false);
  const [seedPrompt, setSeedPrompt] = useState("");

  const refreshStatus = () => api.status().then(setStatus).catch(() => {});

  useEffect(() => {
    refreshStatus();
    api.specialists().then(setSpecialists).catch(() => {});
    api.workspaces().then((w) => {
      setWorkspaces(w);
      if (w[0]) setActiveWs(w[0].id);
    }).catch(() => {});
    const t = setInterval(refreshStatus, 5000);
    return () => clearInterval(t);
  }, []);

  const ws = workspaces.find((w) => w.id === activeWs);
  const isHub = view === "hub";

  return (
    <div className="h-screen flex bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar view={view} setView={setView} status={status} />

      <main className="flex-1 flex flex-col min-w-0">
        {!isHub && (
          <header className="h-14 border-b border-[var(--color-border)] flex items-center justify-between px-6 shrink-0">
            <h1 className="font-bold">{TITLES[view]}</h1>

            <div className="relative">
              <button
                onClick={() => setWsOpen((o) => !o)}
                className="flex items-center gap-2 text-sm nx-glass rounded-xl px-3 py-1.5 hover:border-white/20"
              >
                <span>{ws?.icon}</span>
                <span className="font-medium" style={{ color: ws?.accent }}>{ws?.name ?? "Workspace"}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--color-muted)]" />
              </button>
              {wsOpen && (
                <div className="absolute right-0 mt-2 w-60 nx-glass rounded-xl p-1 z-20">
                  {workspaces.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => { setActiveWs(w.id); setWsOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left hover:bg-white/[0.05]"
                    >
                      <span>{w.icon}</span>
                      <div className="min-w-0">
                        <p className="font-medium truncate" style={{ color: w.accent }}>{w.name}</p>
                        <p className="text-[10px] text-[var(--color-muted)] truncate">{w.tagline}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </header>
        )}

        <div className={isHub ? "flex-1 overflow-hidden" : "flex-1 overflow-y-auto nx-scroll p-6"}>
          {view === "console" && (
            <Console
              specialists={specialists}
              workspaceId={activeWs}
              seedPrompt={seedPrompt}
              onSeedConsumed={() => setSeedPrompt("")}
              onApprovals={() => setView("approvals")}
            />
          )}
          {view === "dashboard" && <Dashboard status={status} specialists={specialists} onAsk={() => setView("console")} />}
          {view === "approvals" && (
            <Approvals
              specialists={specialists}
              onChange={refreshStatus}
              onFollowUp={(prompt) => { setSeedPrompt(prompt); setView("console"); }}
              onViewActivity={() => setView("activity")}
            />
          )}
          {view === "integrations" && <Integrations onChange={refreshStatus} />}
          {view === "skills" && <Skills specialists={specialists} />}
          {view === "team" && <Team specialists={specialists} />}
          {view === "hub" && <HubView />}
          {view === "memory" && <Memory />}
          {view === "activity" && <Activity />}
          {view === "settings" && <Settings status={status} onChange={refreshStatus} />}
        </div>
      </main>
    </div>
  );
}
