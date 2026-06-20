/**
 * Nexus OS API server (Express).
 * Endpoints power the Brain, Gateway, Skills, Memory, Heartbeat, and Security views.
 */
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { z } from "zod";
import { INTEGRATIONS, SKILLS, SPECIALISTS, WORKSPACES } from "./catalog.ts";
import { MODEL_REGISTRY, getEnv, isLiveMode, testModel } from "./llm.ts";
import { store } from "./store.ts";
import { createRun } from "./engine.ts";
import { askHub, hubConfigured } from "./hub.ts";
import { secrets, maskKey } from "./secrets.ts";
import { testIntegration, executeApprovedAction } from "./adapters.ts";
import { startScheduler, generateBriefing } from "./scheduler.ts";
import type { MemoryItem, SystemStatus } from "../shared/types.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const api = express.Router();

api.get("/status", (_req, res) => {
  const s = store.state;
  const today = new Date().toDateString();
  const status: SystemStatus = {
    mode: isLiveMode() ? "live" : "demo",
    model: getEnv().model,
    hubConnected: hubConfigured(),
    integrationsConnected: s.integrations.filter((i) => i.status === "connected").length,
    integrationsTotal: s.integrations.length,
    memoryItems: s.memory.length,
    runsToday: s.runs.filter((r) => new Date(r.createdAt).toDateString() === today).length,
    pendingApprovals: store.pendingApprovals(),
  };
  res.json(status);
});

api.get("/specialists", (_req, res) => res.json(SPECIALISTS));
api.get("/workspaces", (_req, res) => res.json(WORKSPACES));
api.get("/skills", (_req, res) => res.json(SKILLS));
api.get("/models", (_req, res) => res.json(MODEL_REGISTRY));
api.get("/integrations", (_req, res) => res.json(store.state.integrations));
api.get("/heartbeat", (_req, res) => res.json(store.state.heartbeat));
api.get("/memory", (_req, res) => res.json(store.state.memory));
api.get("/audit", (_req, res) => res.json(store.state.audit.slice(0, 100)));
api.get("/runs", (_req, res) => res.json(store.state.runs.slice(0, 50)));

api.get("/runs/:id", (req, res) => {
  const run = store.getRun(req.params.id);
  if (!run) return res.status(404).json({ error: "not found" });
  res.json(run);
});

const runSchema = z.object({ prompt: z.string().min(1).max(2000), workspaceId: z.string().optional() });
api.post("/runs", (req, res) => {
  const parsed = runSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "prompt required" });
  const run = createRun(parsed.data.prompt, parsed.data.workspaceId);
  res.json(run);
});

const integrationSchema = z.object({ status: z.enum(["connected", "available", "beta"]) });
api.post("/integrations/:id", (req, res) => {
  const parsed = integrationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid status" });
  const updated = store.setIntegrationStatus(req.params.id, parsed.data.status);
  if (!updated) return res.status(404).json({ error: "not found" });
  store.addAudit({
    id: store.newId(8),
    ts: store.nowIso(),
    actor: "user",
    action: `${parsed.data.status === "connected" ? "Connected" : "Updated"} ${updated.name}`,
    target: updated.id,
    status: "ok",
  });
  res.json(updated);
});

const memorySchema = z.object({
  kind: z.enum(["preference", "fact", "relationship", "decision", "note"]),
  content: z.string().min(1).max(500),
  tags: z.array(z.string()).optional(),
});
api.post("/memory", (req, res) => {
  const parsed = memorySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid memory" });
  const item: MemoryItem = {
    id: store.newId(8),
    kind: parsed.data.kind,
    content: parsed.data.content,
    tags: parsed.data.tags ?? [],
    createdAt: store.nowIso(),
    source: "user",
  };
  store.addMemory(item);
  res.json(item);
});

const hubSchema = z.object({ query: z.string().min(1).max(1000) });
api.post("/hub/ask", async (req, res) => {
  const parsed = hubSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "query required" });
  const answer = await askHub(parsed.data.query);
  res.json(answer);
});

// ── Model settings (set from UI; no terminal) ──
api.get("/settings/model", (_req, res) => {
  const m = secrets.getModel();
  const env = getEnv();
  res.json({ apiUrl: m.apiUrl ?? "", model: m.model ?? env.model, hasKey: isLiveMode(), keyMask: maskKey(m.apiKey) });
});

const modelSchema = z.object({
  apiKey: z.string().optional(),
  apiUrl: z.string().optional(),
  model: z.string().optional(),
});
api.post("/settings/model", (req, res) => {
  const parsed = modelSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid" });
  secrets.setModel(parsed.data);
  store.addAudit({ id: store.newId(8), ts: store.nowIso(), actor: "user", action: "Updated model settings", target: "model", status: "ok" });
  res.json({ ok: true, hasKey: isLiveMode(), model: getEnv().model });
});
api.post("/settings/model/test", async (_req, res) => res.json(await testModel()));
api.post("/settings/model/clear", (_req, res) => { secrets.clearModel(); res.json({ ok: true }); });

// ── Integration credentials (connect from UI) ──
const connectSchema = z.object({ token: z.string().min(1), meta: z.record(z.string()).optional() });
api.post("/integrations/:id/connect", (req, res) => {
  const parsed = connectSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "token required" });
  secrets.setIntegration(req.params.id, { token: parsed.data.token, meta: parsed.data.meta });
  store.setIntegrationStatus(req.params.id, "connected");
  store.addAudit({ id: store.newId(8), ts: store.nowIso(), actor: "user", action: `Connected ${req.params.id}`, target: req.params.id, status: "ok" });
  res.json({ ok: true });
});
api.post("/integrations/:id/disconnect", (req, res) => {
  secrets.removeIntegration(req.params.id);
  store.setIntegrationStatus(req.params.id, "available");
  store.addAudit({ id: store.newId(8), ts: store.nowIso(), actor: "user", action: `Disconnected ${req.params.id}`, target: req.params.id, status: "info" });
  res.json({ ok: true });
});
api.post("/integrations/:id/test", async (req, res) => res.json(await testIntegration(req.params.id)));

// ── Approvals (drafts held for sign-off) ──
api.get("/actions", (req, res) => {
  const status = req.query.status as string | undefined;
  const all = store.listActions();
  res.json(status ? all.filter((a) => a.status === status) : all);
});
api.post("/actions/:id/approve", async (req, res) => {
  const a = store.getAction(req.params.id);
  if (!a) return res.status(404).json({ error: "not found" });
  if (a.status !== "pending") return res.status(400).json({ error: "already resolved" });

  const exec = await executeApprovedAction(a);
  store.updateAction(a.id, {
    status: "approved",
    resolvedAt: store.nowIso(),
    resultNote: exec.summary,
    executionStatus: exec.status,
    executionSummary: exec.summary,
    followUpPrompt: exec.followUpPrompt,
  });
  store.addMemory({
    id: store.newId(8),
    kind: "decision",
    content: `Approved: ${a.title} → ${exec.summary}`,
    tags: [a.channel, a.specialistId],
    createdAt: store.nowIso(),
  });
  store.addAudit({
    id: store.newId(8),
    ts: store.nowIso(),
    actor: "user",
    action: `Approved & ${exec.status}: ${a.title}`,
    target: a.channel,
    status: exec.status === "failed" ? "blocked" : "ok",
  });
  res.json({ ok: true, note: exec.summary, executionStatus: exec.status, followUpPrompt: exec.followUpPrompt });
});
api.post("/actions/:id/dismiss", (req, res) => {
  const a = store.getAction(req.params.id);
  if (!a) return res.status(404).json({ error: "not found" });
  store.updateAction(a.id, { status: "dismissed", resolvedAt: store.nowIso() });
  store.addAudit({ id: store.newId(8), ts: store.nowIso(), actor: "user", action: `Dismissed: ${a.title}`, target: a.channel, status: "info" });
  res.json({ ok: true });
});

// ── Heartbeat schedule ──
api.get("/heartbeat/schedule", (_req, res) => res.json(store.getSchedule()));
const scheduleSchema = z.object({
  enabled: z.boolean().optional(),
  time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  frequency: z.enum(["daily", "demo"]).optional(),
});
api.post("/heartbeat/schedule", (req, res) => {
  const parsed = scheduleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid" });
  const next = store.setSchedule(parsed.data);
  store.addAudit({ id: store.newId(8), ts: store.nowIso(), actor: "user", action: `Heartbeat schedule ${next.enabled ? "enabled" : "updated"}`, target: "heartbeat", status: "ok" });
  res.json(next);
});
api.post("/heartbeat/run", async (_req, res) => {
  const items = await generateBriefing("manual");
  res.json({ ok: true, added: items.length });
});

app.use("/api", api);

// Serve built client in production
const publicDir = path.resolve(__dirname, "../public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get("*", (_req, res) => res.sendFile(path.join(publicDir, "index.html")));
}

const PORT = Number(process.env.PORT ?? 8787);
app.listen(PORT, () => {
  console.log(`\n  ⬡ Nexus OS API → http://localhost:${PORT}  [${isLiveMode() ? "LIVE" : "DEMO"} mode]\n`);
  startScheduler();
});
