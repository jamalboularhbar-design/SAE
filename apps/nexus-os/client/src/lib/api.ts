import type {
  AuditEntry,
  DraftAction,
  HeartbeatItem,
  Integration,
  MemoryItem,
  ModelOption,
  Run,
  Skill,
  Specialist,
  SystemStatus,
  Workspace,
} from "@shared/types";

const base = import.meta.env.BASE_URL ?? "/";
const normalized = base.endsWith("/") ? base.slice(0, -1) : base;

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${normalized}/api${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${normalized}/api${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed`);
  return res.json() as Promise<T>;
}

export const api = {
  status: () => get<SystemStatus>("/status"),
  specialists: () => get<Specialist[]>("/specialists"),
  workspaces: () => get<Workspace[]>("/workspaces"),
  skills: () => get<Skill[]>("/skills"),
  models: () => get<ModelOption[]>("/models"),
  integrations: () => get<Integration[]>("/integrations"),
  heartbeat: () => get<HeartbeatItem[]>("/heartbeat"),
  memory: () => get<MemoryItem[]>("/memory"),
  audit: () => get<AuditEntry[]>("/audit"),
  runs: () => get<Run[]>("/runs"),
  run: (id: string) => get<Run>(`/runs/${id}`),
  createRun: (prompt: string, workspaceId?: string) => post<Run>("/runs", { prompt, workspaceId }),
  setIntegration: (id: string, status: Integration["status"]) =>
    post<Integration>(`/integrations/${id}`, { status }),
  addMemory: (kind: MemoryItem["kind"], content: string, tags: string[] = []) =>
    post<MemoryItem>("/memory", { kind, content, tags }),
  askHub: (query: string) => post<{ answer: string; source: string }>("/hub/ask", { query }),

  // Model settings
  getModelSettings: () => get<{ apiUrl: string; model: string; hasKey: boolean; keyMask: string | null }>("/settings/model"),
  saveModelSettings: (body: { apiKey?: string; apiUrl?: string; model?: string }) => post<{ ok: boolean; hasKey: boolean; model: string }>("/settings/model", body),
  testModel: () => post<{ ok: boolean; message: string }>("/settings/model/test", {}),

  // Integration credentials
  connectIntegration: (id: string, token: string, meta?: Record<string, string>) => post<{ ok: boolean }>(`/integrations/${id}/connect`, { token, meta }),
  disconnectIntegration: (id: string) => post<{ ok: boolean }>(`/integrations/${id}/disconnect`, {}),
  testIntegration: (id: string) => post<{ ok: boolean; live: boolean; summary: string }>(`/integrations/${id}/test`, {}),

  // Heartbeat schedule
  getSchedule: () => get<{ enabled: boolean; time: string; frequency: "daily" | "demo" }>("/heartbeat/schedule"),
  saveSchedule: (body: { enabled?: boolean; time?: string; frequency?: "daily" | "demo" }) =>
    post<{ enabled: boolean; time: string; frequency: "daily" | "demo" }>("/heartbeat/schedule", body),
  runHeartbeat: () => post<{ ok: boolean; added: number }>("/heartbeat/run", {}),

  // Approvals
  actions: (status?: "pending" | "approved" | "dismissed") => get<DraftAction[]>(`/actions${status ? `?status=${status}` : ""}`),
  approveAction: (id: string) => post<{ ok: boolean; note: string; executionStatus?: string; followUpPrompt?: string }>(`/actions/${id}/approve`, {}),
  dismissAction: (id: string) => post<{ ok: boolean }>(`/actions/${id}/dismiss`, {}),
};
