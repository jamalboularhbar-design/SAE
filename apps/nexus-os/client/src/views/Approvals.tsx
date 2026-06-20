import { useEffect, useState } from "react";
import { Check, X, ShieldCheck, Inbox } from "lucide-react";
import { api } from "@/lib/api";
import { Card, SectionTitle, Badge } from "@/components/ui";
import type { DraftAction, Specialist } from "@shared/types";

export function Approvals({ specialists, onChange }: { specialists: Specialist[]; onChange?: () => void }) {
  const [actions, setActions] = useState<DraftAction[]>([]);
  const [tab, setTab] = useState<"pending" | "approved" | "dismissed">("pending");

  const load = () => api.actions().then(setActions).catch(() => {});
  useEffect(() => {
    load();
    const t = setInterval(load, 2500);
    return () => clearInterval(t);
  }, []);

  async function approve(id: string) {
    await api.approveAction(id);
    await load();
    onChange?.();
  }
  async function dismiss(id: string) {
    await api.dismissAction(id);
    await load();
    onChange?.();
  }

  const filtered = actions.filter((a) => a.status === tab);
  const counts = {
    pending: actions.filter((a) => a.status === "pending").length,
    approved: actions.filter((a) => a.status === "approved").length,
    dismissed: actions.filter((a) => a.status === "dismissed").length,
  };

  return (
    <div>
      <SectionTitle title="Approvals" sub="Nexus drafts; you decide. Nothing is sent without your one-tap sign-off." />

      <div className="flex items-center gap-2 mb-5">
        {(["pending", "approved", "dismissed"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-colors capitalize ${tab === t ? "border-white/20 bg-white/[0.06]" : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]"}`}
          >
            {t} <span className="text-[var(--color-muted)]">· {counts[t]}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="p-8 text-center">
          <Inbox className="w-6 h-6 mx-auto text-[var(--color-muted)] mb-2" />
          <p className="text-sm text-[var(--color-muted)]">
            {tab === "pending" ? "No drafts waiting. Ask Nexus to do something in the Console." : `No ${tab} actions yet.`}
          </p>
        </Card>
      )}

      <div className="space-y-2.5">
        {filtered.map((a) => {
          const sp = specialists.find((s) => s.id === a.specialistId);
          return (
            <Card key={a.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0" style={{ background: `${sp?.accent ?? "#6366f1"}22`, border: `1px solid ${sp?.accent ?? "#6366f1"}55` }}>
                  {sp?.emoji ?? "•"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{a.title}</p>
                    <Badge tone="ok" className="font-mono text-[10px]">{a.channel}</Badge>
                  </div>
                  <p className="text-sm text-[var(--color-muted)] mt-1 whitespace-pre-wrap">{a.detail}</p>
                  {a.resultNote && <p className="text-xs text-emerald-300 mt-1.5">{a.resultNote}</p>}
                </div>
                {a.status === "pending" ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => approve(a.id)} className="text-xs font-medium rounded-lg px-3 py-1.5 bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 hover:bg-emerald-500/30 inline-flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button onClick={() => dismiss(a.id)} className="text-xs font-medium rounded-lg px-3 py-1.5 border border-white/10 text-[var(--color-muted)] hover:bg-white/5 inline-flex items-center gap-1">
                      <X className="w-3.5 h-3.5" /> Dismiss
                    </button>
                  </div>
                ) : (
                  <Badge tone={a.status === "approved" ? "live" : "muted"} className="shrink-0">
                    {a.status === "approved" ? <ShieldCheck className="w-3 h-3" /> : null} {a.status}
                  </Badge>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
