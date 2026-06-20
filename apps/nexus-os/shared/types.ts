/**
 * Nexus OS — shared domain types (client + server).
 * Architecture mirrors an autonomous AI OS: Brain, Memory, Gateway, Skills, Heartbeat, Security.
 */

/** Specialist ids are dynamic — sourced from the user's Hub roster + the orchestrator. */
export type SpecialistId = string;

export interface Specialist {
  id: SpecialistId;
  name: string;
  role: string;
  emoji: string;
  /** Capabilities this specialist can apply */
  skills: string[];
  /** Default model key from the model registry */
  model: string;
  accent: string;
  /** Hub discipline (e.g. "Sales & Revenue"); "Orchestration" for the Chief of Staff */
  category: string;
  /** Underlying system prompt used in live mode */
  prompt?: string;
}

export interface Workspace {
  id: string;
  name: string;
  domain: string;
  tagline: string;
  icon: string;
  accent: string;
  context: string;
}

export type IntegrationCategory =
  | "Communication"
  | "Productivity"
  | "CRM & Business"
  | "Voice & Calls"
  | "Developer"
  | "Knowledge";

export type IntegrationStatus = "connected" | "available" | "beta";

export interface Integration {
  id: string;
  name: string;
  category: IntegrationCategory;
  emoji: string;
  description: string;
  status: IntegrationStatus;
  authType: "oauth" | "api_key" | "webhook" | "native";
}

export interface Skill {
  id: string;
  name: string;
  emoji: string;
  description: string;
  specialist: SpecialistId;
  /** Example trigger phrases that route to this skill */
  triggers: string[];
}

export type MemoryKind =
  | "preference"
  | "fact"
  | "relationship"
  | "decision"
  | "note";

export interface MemoryItem {
  id: string;
  kind: MemoryKind;
  content: string;
  tags: string[];
  createdAt: string;
  source?: string;
}

export type RunStatus = "planning" | "running" | "completed" | "failed";

export type StepType = "plan" | "think" | "tool" | "handoff" | "result";

export interface RunStep {
  id: string;
  specialistId: SpecialistId;
  type: StepType;
  title: string;
  detail: string;
  status: "pending" | "active" | "done";
  ts: string;
  /** Optional tool/integration the step used */
  via?: string;
}

export interface SubTask {
  id: string;
  specialistId: SpecialistId;
  objective: string;
  status: "pending" | "active" | "done";
}

export interface Run {
  id: string;
  prompt: string;
  status: RunStatus;
  createdAt: string;
  completedAt?: string;
  plan: SubTask[];
  steps: RunStep[];
  specialistsUsed: SpecialistId[];
  result?: string;
  mode: "live" | "demo";
}

export interface AuditEntry {
  id: string;
  ts: string;
  actor: string;
  action: string;
  target: string;
  status: "ok" | "blocked" | "info";
}

export type HeartbeatKind = "briefing" | "follow-up" | "alert" | "task";

export interface HeartbeatItem {
  id: string;
  kind: HeartbeatKind;
  title: string;
  detail: string;
  specialistId: SpecialistId;
  ts: string;
  actionable: boolean;
}

export interface ModelOption {
  key: string;
  label: string;
  provider: string;
  contextNote: string;
}

export interface SystemStatus {
  mode: "live" | "demo";
  model: string;
  hubConnected: boolean;
  integrationsConnected: number;
  integrationsTotal: number;
  memoryItems: number;
  runsToday: number;
}
