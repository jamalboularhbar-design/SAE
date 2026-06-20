import { useEffect, useState } from "react";
import { Cpu, KeyRound, Brain, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import { Card, SectionTitle, Badge } from "@/components/ui";
import type { ModelOption, SystemStatus } from "@shared/types";

const PROVIDERS = [
  { label: "Google Gemini", apiUrl: "https://generativelanguage.googleapis.com/v1beta/openai", model: "gemini-2.5-flash" },
  { label: "OpenAI", apiUrl: "https://api.openai.com/v1", model: "gpt-4o-mini" },
  { label: "Groq (Llama)", apiUrl: "https://api.groq.com/openai/v1", model: "llama-3.3-70b-versatile" },
  { label: "Custom (OpenAI-compatible)", apiUrl: "", model: "" },
];

export function Settings({ status, onChange }: { status: SystemStatus | null; onChange?: () => void }) {
  const [models, setModels] = useState<ModelOption[]>([]);
  const [provider, setProvider] = useState(0);
  const [apiUrl, setApiUrl] = useState(PROVIDERS[0].apiUrl);
  const [model, setModel] = useState(PROVIDERS[0].model);
  const [apiKey, setApiKey] = useState("");
  const [keyMask, setKeyMask] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    api.models().then(setModels).catch(() => {});
    api.getModelSettings().then((s) => {
      setKeyMask(s.keyMask);
      if (s.apiUrl) setApiUrl(s.apiUrl);
      if (s.model) setModel(s.model);
    }).catch(() => {});
  }, []);

  function pickProvider(i: number) {
    setProvider(i);
    if (PROVIDERS[i].apiUrl) setApiUrl(PROVIDERS[i].apiUrl);
    if (PROVIDERS[i].model) setModel(PROVIDERS[i].model);
  }

  async function save() {
    setSaving(true);
    setTestResult(null);
    await api.saveModelSettings({ apiKey: apiKey || undefined, apiUrl, model });
    setApiKey("");
    const s = await api.getModelSettings();
    setKeyMask(s.keyMask);
    setSaving(false);
    onChange?.();
  }

  async function test() {
    setTesting(true);
    setTestResult(null);
    const r = await api.testModel();
    setTestResult(r);
    setTesting(false);
    onChange?.();
  }

  return (
    <div>
      <SectionTitle title="Settings" sub="Connect a model for live answers, manage the Hub, and review security — all from here, no terminal." />

      <Card className="p-5 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="w-4 h-4 text-teal-300" />
          <h3 className="font-semibold">Model connection</h3>
          <Badge tone={status?.mode === "live" ? "live" : "ok"}>{status?.mode === "live" ? "Live" : "Demo"}</Badge>
        </div>
        <p className="text-sm text-[var(--color-muted)] mb-4">
          Paste an API key to switch from Demo to <b>Live</b> answers. Works with any OpenAI-compatible provider. Your key is stored locally on your server only.
          {keyMask && <> Current key: <span className="font-mono text-[var(--color-text)]">{keyMask}</span></>}
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          <label className="text-sm">
            <span className="text-[var(--color-muted)] text-xs">Provider</span>
            <select value={provider} onChange={(e) => pickProvider(Number(e.target.value))} className="mt-1 w-full nx-select px-3 py-2">
              {PROVIDERS.map((p, i) => <option key={p.label} value={i}>{p.label}</option>)}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-[var(--color-muted)] text-xs">Model</span>
            <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="gemini-2.5-flash" className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none font-mono text-xs" />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="text-[var(--color-muted)] text-xs">API base URL</span>
            <input value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} placeholder="https://…" className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none font-mono text-xs" />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="text-[var(--color-muted)] text-xs">API key</span>
            <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={keyMask ? "•••• (saved — paste to replace)" : "Paste your API key"} className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none font-mono text-xs" />
          </label>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <button onClick={save} disabled={saving} className="text-sm font-medium rounded-lg px-4 py-2 bg-gradient-to-br from-indigo-500 to-teal-400 text-[#07090f] inline-flex items-center gap-1.5">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Save
          </button>
          <button onClick={test} disabled={testing} className="text-sm font-medium rounded-lg px-4 py-2 border border-white/15 hover:bg-white/5 inline-flex items-center gap-1.5">
            {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Test connection
          </button>
          {testResult && (
            <span className={`text-xs inline-flex items-center gap-1 ${testResult.ok ? "text-emerald-300" : "text-amber-300"}`}>
              {testResult.ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {testResult.message}
            </span>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-5">
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
