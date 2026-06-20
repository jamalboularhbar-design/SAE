import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { Card, SectionTitle, Badge } from "@/components/ui";
import type { AuditEntry } from "@shared/types";

export function Activity() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);

  useEffect(() => {
    api.audit().then(setEntries).catch(() => {});
    const t = setInterval(() => api.audit().then(setEntries).catch(() => {}), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <SectionTitle title="Activity & Audit" sub="Security-first — every action Nexus takes is logged. You stay in control." />
      <Card className="p-2">
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-[var(--color-muted)]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Append-only audit log · {entries.length} recent entries
        </div>
        <div className="divide-y divide-white/5">
          {entries.map((e) => (
            <div key={e.id} className="flex items-center gap-3 px-3 py-2.5 text-sm">
              <span className="font-mono text-[10px] text-[var(--color-muted)] w-16 shrink-0">
                {new Date(e.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
              <Badge tone={e.status === "ok" ? "live" : e.status === "blocked" ? "warn" : "muted"} className="shrink-0">{e.actor}</Badge>
              <span className="flex-1">{e.action}</span>
              <span className="font-mono text-[10px] text-[var(--color-muted)] truncate max-w-[120px]">{e.target}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
