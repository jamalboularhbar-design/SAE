import { useEffect, useState } from "react";
import { Heart, ArrowRight, Play, Loader2, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { Card, SectionTitle, Stat, Badge } from "@/components/ui";
import type { HeartbeatItem, Specialist, SystemStatus } from "@shared/types";

const KIND_TONE: Record<string, "live" | "warn" | "ok" | "muted"> = {
  briefing: "ok",
  "follow-up": "warn",
  alert: "warn",
  task: "muted",
};

export function Dashboard({
  status,
  specialists,
  onAsk,
}: {
  status: SystemStatus | null;
  specialists: Specialist[];
  onAsk: () => void;
}) {
  const [items, setItems] = useState<HeartbeatItem[]>([]);
  const [schedule, setSchedule] = useState<{ enabled: boolean; time: string; frequency: "daily" | "demo" }>({ enabled: false, time: "08:00", frequency: "daily" });
  const [running, setRunning] = useState(false);

  const loadItems = () => api.heartbeat().then(setItems).catch(() => {});
  useEffect(() => {
    loadItems();
    api.getSchedule().then(setSchedule).catch(() => {});
  }, []);

  async function patchSchedule(patch: Partial<typeof schedule>) {
    const next = await api.saveSchedule(patch);
    setSchedule(next);
  }

  async function runNow() {
    setRunning(true);
    await api.runHeartbeat();
    await loadItems();
    setRunning(false);
  }

  return (
    <div>
      <SectionTitle title="Heartbeat" sub="The proactive pulse — Nexus acts on its own schedule, not just when you ask." />

      <Card className="p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-300" />
            <span className="text-sm font-semibold">Auto morning briefing</span>
          </div>

          <button
            onClick={() => patchSchedule({ enabled: !schedule.enabled })}
            className={`relative w-11 h-6 rounded-full transition-colors ${schedule.enabled ? "bg-emerald-500/70" : "bg-white/10"}`}
            aria-label="Toggle schedule"
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${schedule.enabled ? "translate-x-5" : ""}`} />
          </button>
          <Badge tone={schedule.enabled ? "live" : "muted"}>{schedule.enabled ? "Scheduled" : "Off"}</Badge>

          <label className="text-sm flex items-center gap-2 text-[var(--color-muted)]">
            at
            <input
              type="time"
              value={schedule.time}
              onChange={(e) => patchSchedule({ time: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm outline-none text-[var(--color-text)]"
            />
          </label>

          <select
            value={schedule.frequency}
            onChange={(e) => patchSchedule({ frequency: e.target.value as "daily" | "demo" })}
            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm outline-none"
          >
            <option value="daily">Daily</option>
            <option value="demo">Demo (every ~3 min)</option>
          </select>

          <button onClick={runNow} disabled={running} className="ml-auto text-sm font-medium rounded-lg px-4 py-2 bg-gradient-to-br from-indigo-500 to-teal-400 text-[#07090f] inline-flex items-center gap-1.5">
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} Run now
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Stat label="Runs today" value={status?.runsToday ?? 0} accent="#818cf8" />
        <Stat label="Integrations" value={`${status?.integrationsConnected ?? 0}/${status?.integrationsTotal ?? 0}`} accent="#2dd4bf" />
        <Stat label="Memory items" value={status?.memoryItems ?? 0} accent="#f59e0b" />
        <Stat label="Mode" value={status?.mode === "live" ? "Live" : "Demo"} accent="#ec4899" />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-4 h-4 text-rose-400" />
        <h3 className="font-semibold">Today&apos;s proactive items</h3>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const sp = specialists.find((s) => s.id === item.specialistId);
          return (
            <Card key={item.id} className="p-4 flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
                style={{ background: `${sp?.accent ?? "#6366f1"}22`, border: `1px solid ${sp?.accent ?? "#6366f1"}55` }}
              >
                {sp?.emoji ?? "•"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm">{item.title}</p>
                  <Badge tone={KIND_TONE[item.kind] ?? "muted"}>{item.kind}</Badge>
                </div>
                <p className="text-sm text-[var(--color-muted)] mt-0.5">{item.detail}</p>
              </div>
              {item.actionable && (
                <button onClick={onAsk} className="text-xs text-indigo-300 hover:text-indigo-200 inline-flex items-center gap-1 shrink-0">
                  Handle <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
