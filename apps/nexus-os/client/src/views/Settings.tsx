import { useEffect, useState } from "react";
import { Cpu, KeyRound, Brain } from "lucide-react";
import { api } from "@/lib/api";
import { Card, SectionTitle, Badge } from "@/components/ui";
import type { ModelOption, SystemStatus } from "@shared/types";

export function Settings({ status }: { status: SystemStatus | null }) {
  const [models, setModels] = useState<ModelOption[]>([]);

  useEffect(() => {
    api.models().then(setModels).catch(() => {});
  }, []);

  return (
    <div>
      <SectionTitle title="Settings" sub="Models, the Hub specialist connection, and security posture." />

      <Card className="p-5 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="w-4 h-4 text-teal-300" />
          <h3 className="font-semibold">Model registry</h3>
          <Badge tone={status?.mode === "live" ? "live" : "ok"}>{status?.mode === "live" ? "Live" : "Demo"}</Badge>
        </div>
        <p className="text-sm text-[var(--color-muted)] mb-4">
          Active model: <span className="font-mono text-[var(--color-text)]">{status?.model}</span>. Set{" "}
          <span className="font-mono">LLM_API_KEY</span> (+ optional <span className="font-mono">LLM_API_URL</span>,{" "}
          <span className="font-mono">LLM_MODEL</span>) to switch from Demo to Live. Any OpenAI-compatible provider works.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {models.map((m) => (
            <div key={m.key} className="nx-glass rounded-xl p-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{m.label}</p>
                {m.key === status?.model && <Badge tone="live">active</Badge>}
              </div>
              <p className="text-[10px] uppercase tracking-wide text-[var(--color-muted)] mt-0.5">{m.provider}</p>
              <p className="text-xs text-[var(--color-muted)] mt-1">{m.contextNote}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-rose-300" />
          <h3 className="font-semibold">Hub specialist (jamal-hub-v2)</h3>
          <Badge tone={status?.hubConnected ? "live" : "warn"}>{status?.hubConnected ? "connected" : "built-in"}</Badge>
        </div>
        <p className="text-sm text-[var(--color-muted)]">
          Your Hub roster powers the Brain&apos;s specialists. Connect the live Hub three ways:
        </p>
        <ul className="text-sm text-[var(--color-muted)] mt-2 space-y-1.5 list-disc list-inside">
          <li>HTTP: set <span className="font-mono">HUB_SPECIALIST_URL</span> to your Hub endpoint</li>
          <li>Embedded: the original UI is available in the <span className="text-[var(--color-text)]">Hub</span> tab</li>
          <li>LLM persona: auto-enabled when <span className="font-mono">LLM_API_KEY</span> is set</li>
        </ul>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <KeyRound className="w-4 h-4 text-indigo-300" />
          <h3 className="font-semibold">Security</h3>
        </div>
        <ul className="text-sm text-[var(--color-muted)] space-y-1.5 list-disc list-inside">
          <li>Self-hostable — your data stays on your infrastructure</li>
          <li>Every action is written to the append-only audit log (Activity tab)</li>
          <li>Drafted actions are held for approval — nothing is sent autonomously</li>
        </ul>
      </Card>
    </div>
  );
}
