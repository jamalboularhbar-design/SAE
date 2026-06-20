import { useEffect, useState } from "react";
import { Heart, ArrowRight } from "lucide-react";
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

  useEffect(() => {
    api.heartbeat().then(setItems).catch(() => {});
  }, []);

  return (
    <div>
      <SectionTitle title="Heartbeat" sub="The proactive pulse — Nexus acts on its own schedule, not just when you ask." />

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
