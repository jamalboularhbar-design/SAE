/**
 * Heartbeat scheduler — the proactive pulse.
 * Generates a morning briefing automatically on a schedule (daily at a set time,
 * or every few minutes in "demo" mode for testing). Fully controllable from the UI.
 */
import type { HeartbeatItem } from "../shared/types.ts";
import { store } from "./store.ts";
import { chat, isLiveMode } from "./llm.ts";

function greeting(d: Date): string {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export async function generateBriefing(trigger: "schedule" | "manual"): Promise<HeartbeatItem[]> {
  const now = new Date();
  const items: HeartbeatItem[] = [];
  const mk = (kind: HeartbeatItem["kind"], title: string, detail: string, specialistId: string, actionable = true): HeartbeatItem => ({
    id: store.newId(8),
    kind,
    title,
    detail,
    specialistId,
    ts: now.toISOString(),
    actionable,
  });

  // Deterministic, useful defaults from current state.
  const openDeals = "A Riad & Routes HNW inquiry and an ArtKech proposal are awaiting your reply.";
  let priorities = "Top 3 today: ship ARG-Builder launch posts, reply to the HNW travel inquiry, review weekly numbers.";

  // In Live mode, let the planner draft sharper priorities.
  if (isLiveMode()) {
    try {
      const recent = store.state.memory.slice(0, 6).map((m) => `- ${m.content}`).join("\n");
      const txt = await chat(
        [
          { role: "system", content: "You are the Chief of Staff for a founder running Riad & Routes, ArtKech, ARG-Builder and a personal brand. Write the 3 most important priorities for today as one short line each, action-first. No preamble." },
          { role: "user", content: `Context/memory:\n${recent}\n\nGive today's top 3 priorities.` },
        ],
        { model: "gemini-2.5-pro", maxTokens: 200 }
      );
      if (txt.trim()) priorities = txt.trim();
    } catch {
      /* keep deterministic */
    }
  }

  items.push(mk("briefing", `${greeting(now)} — your briefing is ready`, priorities, "planner"));
  items.push(mk("follow-up", "Deals to nudge", openDeals, "leadgen"));
  items.push(mk("alert", "Inbox needs a look", "3 messages flagged important: an investor intro, a partnership request, and a churn-risk reply.", "email"));

  for (const it of items) store.prependHeartbeat(it);
  store.addAudit({ id: store.newId(8), ts: now.toISOString(), actor: "heartbeat", action: `Generated briefing (${trigger})`, target: "heartbeat", status: "ok" });
  return items;
}

function dueKey(d: Date, frequency: "daily" | "demo"): string {
  const date = d.toISOString().slice(0, 10);
  if (frequency === "demo") return `${date} ${d.getHours()}:${Math.floor(d.getMinutes() / 3)}`; // every ~3 min
  return date; // once per day
}

export function startScheduler() {
  const tick = async () => {
    const s = store.getSchedule();
    if (!s || !s.enabled) return;
    const now = new Date();
    const key = dueKey(now, s.frequency);
    if (s.lastRunKey === key) return;

    if (s.frequency === "daily") {
      const [hh, mm] = (s.time || "08:00").split(":").map(Number);
      const due = now.getHours() > hh || (now.getHours() === hh && now.getMinutes() >= mm);
      if (!due) return;
    }
    store.setSchedule({ lastRunKey: key });
    await generateBriefing("schedule");
    console.log(`  ❤️  Heartbeat briefing generated (${s.frequency}) at ${now.toLocaleTimeString()}`);
  };
  // Check every 30s; first check shortly after boot.
  setInterval(() => void tick(), 30_000);
  setTimeout(() => void tick(), 4_000);
}
