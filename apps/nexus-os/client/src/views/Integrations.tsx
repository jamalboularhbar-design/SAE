import { useEffect, useState } from "react";
import { Check, Plus, Loader2, X, CheckCircle2, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import { Card, SectionTitle, Badge } from "@/components/ui";
import type { Integration, IntegrationCategory } from "@shared/types";

const CATEGORIES: IntegrationCategory[] = [
  "Communication",
  "Productivity",
  "CRM & Business",
  "Voice & Calls",
  "Developer",
  "Knowledge",
];

const TOKEN_HINT: Record<string, string> = {
  notion: "Notion internal integration token (starts with ntn_ or secret_). Create at notion.so/my-integrations and share your pages with it.",
  slack: "Slack Bot token (starts with xoxb-). Create a Slack app, add scopes, install to workspace.",
  email: "Google OAuth access token (Gmail). Generate from the Google OAuth Playground with Gmail scope.",
  gmail: "Google OAuth access token with Gmail scope.",
  drive: "Google OAuth access token with Drive scope.",
  hubspot: "HubSpot private app access token.",
  github: "GitHub personal access token (fine-grained).",
};

export function Integrations({ onChange }: { onChange?: () => void }) {
  const [items, setItems] = useState<Integration[]>([]);
  const [active, setActive] = useState<Integration | null>(null);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; summary: string } | null>(null);

  const load = () => api.integrations().then(setItems).catch(() => {});
  useEffect(() => { load(); }, []);

  function openConnect(i: Integration) {
    setActive(i);
    setToken("");
    setResult(null);
  }

  async function connect() {
    if (!active || !token.trim()) return;
    setBusy(true);
    await api.connectIntegration(active.id, token.trim());
    const r = await api.testIntegration(active.id);
    setResult({ ok: r.ok, summary: r.summary });
    setBusy(false);
    load();
    onChange?.();
  }

  async function disconnect(i: Integration) {
    await api.disconnectIntegration(i.id);
    load();
    onChange?.();
  }

  return (
    <div>
      <SectionTitle
        title="Gateway"
        sub="Connect once — paste a token and Nexus works inside your real tools. Replies go back out through the original channel."
      />
      {CATEGORIES.map((cat) => {
        const group = items.filter((i) => i.category === cat);
        if (group.length === 0) return null;
        return (
          <div key={cat} className="mb-7">
            <h3 className="text-sm font-semibold text-[var(--color-muted)] mb-3">{cat}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.map((i) => (
                <Card key={i.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="text-2xl">{i.emoji}</div>
                    {i.status === "connected" ? (
                      <Badge tone="live"><Check className="w-3 h-3" /> connected</Badge>
                    ) : i.status === "beta" ? (
                      <Badge tone="warn">beta</Badge>
                    ) : (
                      <Badge tone="muted">available</Badge>
                    )}
                  </div>
                  <p className="font-semibold text-sm mt-2">{i.name}</p>
                  <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">{i.description}</p>
                  {i.status === "connected" ? (
                    <button onClick={() => disconnect(i)} className="mt-3 w-full text-xs font-medium rounded-lg py-2 border border-white/10 hover:border-white/20 hover:bg-white/[0.03] transition-colors">
                      Disconnect
                    </button>
                  ) : (
                    <button onClick={() => openConnect(i)} className="mt-3 w-full text-xs font-medium rounded-lg py-2 border border-white/10 hover:border-white/20 hover:bg-white/[0.03] transition-colors inline-flex items-center justify-center gap-1.5">
                      <Plus className="w-3 h-3" /> Connect
                    </button>
                  )}
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setActive(null)}>
          <Card className="w-full max-w-md p-5">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">{active.emoji}</span>
                <h3 className="font-semibold">Connect {active.name}</h3>
              </div>
              <button onClick={() => setActive(null)} className="text-[var(--color-muted)] hover:text-[var(--color-text)]"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-[var(--color-muted)] mb-3 leading-relaxed">
              {TOKEN_HINT[active.id] ?? "Paste the API token / key for this service. Stored locally on your server only."}
            </p>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste token…"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none font-mono"
              autoFocus
            />
            {result && (
              <div className={`mt-3 text-xs inline-flex items-center gap-1.5 ${result.ok ? "text-emerald-300" : "text-amber-300"}`}>
                {result.ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {result.summary}
              </div>
            )}
            <div className="flex items-center gap-2 mt-4">
              <button onClick={connect} disabled={busy || !token.trim()} className="text-sm font-medium rounded-lg px-4 py-2 bg-gradient-to-br from-indigo-500 to-teal-400 text-[#07090f] inline-flex items-center gap-1.5 disabled:opacity-50">
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Connect & test
              </button>
              {result?.ok && (
                <button onClick={() => setActive(null)} className="text-sm rounded-lg px-4 py-2 border border-white/15 hover:bg-white/5">Done</button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
