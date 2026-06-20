/**
 * Lightweight JSON-file persistence + in-memory state.
 * Keeps Nexus OS runnable with zero external dependencies (no DB required).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { nanoid } from "nanoid";
import type {
  AuditEntry,
  HeartbeatItem,
  Integration,
  MemoryItem,
  Run,
} from "../shared/types.ts";
import { INTEGRATIONS } from "./catalog.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../.data");
const DATA_FILE = path.join(DATA_DIR, "state.json");

export interface HeartbeatSchedule {
  enabled: boolean;
  /** 24h local time, e.g. "08:00" */
  time: string;
  /** "daily" for production; "demo" runs every few minutes for testing */
  frequency: "daily" | "demo";
  lastRunKey?: string;
}

interface State {
  runs: Run[];
  memory: MemoryItem[];
  audit: AuditEntry[];
  heartbeat: HeartbeatItem[];
  integrations: Integration[];
  schedule: HeartbeatSchedule;
}

function nowIso() {
  return new Date().toISOString();
}

function seedState(): State {
  const seedMemory: MemoryItem[] = [
    { id: nanoid(8), kind: "preference", content: "Prefers concise, action-first replies. No fluff.", tags: ["style"], createdAt: nowIso() },
    { id: nanoid(8), kind: "preference", content: "Protect deep-work mornings 9–12; no meetings before noon.", tags: ["calendar"], createdAt: nowIso() },
    { id: nanoid(8), kind: "fact", content: "Runs NexusAI (Playbooks SaaS + Templates) and Riad & Routes travel concierge.", tags: ["business"], createdAt: nowIso() },
    { id: nanoid(8), kind: "relationship", content: "Top prospect: Atlas Collective Agency — multi-brand, evaluating Agency Pack.", tags: ["crm"], createdAt: nowIso() },
    { id: nanoid(8), kind: "decision", content: "Templates launch on Gumroad before SaaS multi-tenant build.", tags: ["roadmap"], createdAt: nowIso() },
  ];

  const seedHeartbeat: HeartbeatItem[] = [
    { id: nanoid(8), kind: "briefing", title: "Morning briefing ready", detail: "3 priorities today: ship ARG-Builder launch posts, reply to a Riad & Routes HNW inquiry, review weekly numbers.", specialistId: "planner", ts: nowIso(), actionable: true },
    { id: nanoid(8), kind: "follow-up", title: "2 deals need a nudge", detail: "A Riad & Routes enterprise lead (6d quiet) and an ArtKech proposal awaiting reply.", specialistId: "leadgen", ts: nowIso(), actionable: true },
    { id: nanoid(8), kind: "alert", title: "Inbox: 3 emails flagged important", detail: "Investor intro, partnership request, and a churn-risk customer reply.", specialistId: "email", ts: nowIso(), actionable: true },
    { id: nanoid(8), kind: "task", title: "Weekly metrics digest", detail: "Revenue trending up; one workspace inactive 14 days — retention risk.", specialistId: "revenue", ts: nowIso(), actionable: false },
  ];

  return {
    runs: [],
    memory: seedMemory,
    audit: [
      { id: nanoid(8), ts: nowIso(), actor: "system", action: "Nexus OS initialized", target: "core", status: "info" },
    ],
    heartbeat: seedHeartbeat,
    integrations: INTEGRATIONS.map((i) => ({ ...i })),
    schedule: { enabled: false, time: "08:00", frequency: "daily" },
  };
}

let state: State;

function load(): State {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as Partial<State>;
      // Backfill any fields added after this file was first written (safe migration).
      const base = seedState();
      return {
        ...base,
        ...parsed,
        schedule: parsed.schedule ?? base.schedule,
      } as State;
    }
  } catch {
    /* corrupted — reseed */
  }
  const seeded = seedState();
  persist(seeded);
  return seeded;
}

function persist(s: State = state) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(s, null, 2));
  } catch {
    /* non-fatal in ephemeral envs */
  }
}

state = load();

export const store = {
  get state() {
    return state;
  },
  addRun(run: Run) {
    state.runs.unshift(run);
    persist();
  },
  updateRun(id: string, patch: Partial<Run>) {
    const run = state.runs.find((r) => r.id === id);
    if (run) Object.assign(run, patch);
    persist();
    return run;
  },
  getRun(id: string) {
    return state.runs.find((r) => r.id === id);
  },
  addMemory(item: MemoryItem) {
    state.memory.unshift(item);
    persist();
  },
  addAudit(entry: AuditEntry) {
    state.audit.unshift(entry);
    if (state.audit.length > 500) state.audit.length = 500;
    persist();
  },
  setIntegrationStatus(id: string, status: Integration["status"]) {
    const i = state.integrations.find((x) => x.id === id);
    if (i) i.status = status;
    persist();
    return i;
  },
  prependHeartbeat(item: HeartbeatItem) {
    state.heartbeat.unshift(item);
    if (state.heartbeat.length > 40) state.heartbeat.length = 40;
    persist();
  },
  getSchedule() {
    return state.schedule;
  },
  setSchedule(patch: Partial<HeartbeatSchedule>) {
    state.schedule = { ...state.schedule, ...patch };
    persist();
    return state.schedule;
  },
  newId: (size = 10) => nanoid(size),
  nowIso,
};
