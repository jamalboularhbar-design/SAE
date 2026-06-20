import type {
  AuditEntry,
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

const base = "/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${base}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${base}${path}`, {
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
};
