import { useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2, CheckCircle2, Circle, Sparkles } from "lucide-react";
import clsx from "clsx";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui";
import type { Run, RunStep, Specialist } from "@shared/types";

const SUGGESTIONS = [
  "Clear my inbox and draft replies to anything important",
  "Find time for 3 deep-work blocks this week and protect them",
  "Which deals are going cold? Draft a nudge for each",
  "Draft a LinkedIn post from this week's wins",
  "Prep me for my next meeting with full context",
];

function specialistOf(id: string, specialists: Specialist[]) {
  return specialists.find((s) => s.id === id);
}

function StepRow({ step, specialists }: { step: RunStep; specialists: Specialist[] }) {
  const sp = specialistOf(step.specialistId, specialists);
  return (
    <div className="nx-rise flex gap-3">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 mt-0.5"
        style={{ background: `${sp?.accent ?? "#6366f1"}22`, border: `1px solid ${sp?.accent ?? "#6366f1"}55` }}
      >
        {sp?.emoji ?? "•"}
      </div>
      <div className="flex-1 min-w-0 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold">{step.title}</span>
          {step.via && <Badge tone="ok" className="font-mono text-[10px]">{step.via}</Badge>}
          <span className="text-[10px] uppercase tracking-wide text-[var(--color-muted)]">{step.type}</span>
        </div>
        <p className="text-sm text-[var(--color-muted)] mt-0.5 whitespace-pre-wrap">{step.detail}</p>
      </div>
    </div>
  );
}

export function Console({ specialists, workspaceId }: { specialists: Specialist[]; workspaceId?: string }) {
  const [prompt, setPrompt] = useState("");
  const [run, setRun] = useState<Run | null>(null);
  const [busy, setBusy] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Only stick to bottom if the user is already near the bottom (no yanking).
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 160;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  }, [run?.steps.length, run?.result]);

  async function submit(text: string) {
    if (!text.trim() || busy) return;
    setBusy(true);
    setPrompt("");
    const created = await api.createRun(text.trim(), workspaceId);
    setRun(created);
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      const fresh = await api.run(created.id);
      // Merge: keep prior step objects, only append genuinely new steps by id.
      // Prevents the timeline from re-rendering/reordering on every poll.
      setRun((prev) => {
        if (!prev || prev.id !== fresh.id) return fresh;
        const seen = new Set(prev.steps.map((s) => s.id));
        const merged = [...prev.steps, ...fresh.steps.filter((s) => !seen.has(s.id))];
        return { ...fresh, steps: merged };
      });
      if (fresh.status === "completed" || fresh.status === "failed") {
        if (pollRef.current) clearInterval(pollRef.current);
        setBusy(false);
      }
    }, 700);
  }

  const team = run ? specialists.filter((s) => run.specialistsUsed.includes(s.id)) : [];

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto w-full">
      {!run && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center text-2xl mb-5">
            ⬡
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            You ask once. <span className="nx-grad-text">Nexus puts a team on it.</span>
          </h1>
          <p className="text-[var(--color-muted)] mt-2 max-w-md">
            Nexus breaks the job down, spins up a specialist agent for each part, works in parallel, then hands you back one finished answer.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-6 max-w-xl">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => submit(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-white/20 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {run && (
        <div ref={scrollRef} className="flex-1 overflow-y-auto nx-scroll px-1 py-4 space-y-5">
          <div className="flex justify-end">
            <div className="bg-indigo-500/15 border border-indigo-500/25 rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[80%]">
              <p className="text-sm">{run.prompt}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge tone={run.status === "completed" ? "live" : "warn"}>
              {run.status === "completed" ? <CheckCircle2 className="w-3 h-3" /> : <Loader2 className="w-3 h-3 animate-spin" />}
              {run.status}
            </Badge>
            <span className="text-xs text-[var(--color-muted)]">Team:</span>
            {team.map((t) => (
              <span key={t.id} className="text-sm" title={t.name}>{t.emoji}</span>
            ))}
            <Badge tone="muted" className="font-mono text-[10px]">{run.mode}</Badge>
          </div>

          <div className="space-y-3">
            {run.steps.map((s) => (
              <StepRow key={s.id} step={s} specialists={specialists} />
            ))}
            {run.status !== "completed" && run.status !== "failed" && (
              <div className="flex items-center gap-2 text-sm text-[var(--color-muted)] nx-live">
                <Loader2 className="w-4 h-4 animate-spin" /> specialists working…
              </div>
            )}
          </div>

          {run.result && (
            <div className="nx-glass rounded-2xl p-5 nx-rise">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-teal-300" />
                <span className="text-sm font-semibold">Chief of Staff — final answer</span>
              </div>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{run.result}</p>
            </div>
          )}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(prompt);
        }}
        className="py-4"
      >
        <div className="nx-glass rounded-2xl flex items-end gap-2 p-2 pl-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(prompt);
              }
            }}
            rows={1}
            placeholder="Ask Nexus to handle something…"
            className="flex-1 bg-transparent resize-none outline-none text-sm py-2 max-h-32 nx-scroll"
          />
          <button
            type="submit"
            disabled={busy || !prompt.trim()}
            className={clsx(
              "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
              busy || !prompt.trim()
                ? "bg-white/5 text-[var(--color-muted)]"
                : "bg-gradient-to-br from-indigo-500 to-teal-400 text-[#07090f]"
            )}
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
          </button>
        </div>
        {run && (
          <button
            onClick={() => setRun(null)}
            type="button"
            className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] mt-2"
          >
            ＋ New task
          </button>
        )}
      </form>
    </div>
  );
}
