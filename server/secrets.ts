/**
 * Secrets store — model keys + tool credentials, set from the UI (no terminal, no .env editing).
 * Stored in .data/secrets.json (gitignored). Self-hosted: stays on your machine.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../.data");
const FILE = path.join(DATA_DIR, "secrets.json");

export interface ModelSecret {
  apiUrl?: string;
  apiKey?: string;
  model?: string;
}

export interface IntegrationCredential {
  /** token / api key / access token depending on the service */
  token?: string;
  /** optional secondary value (e.g. default channel, base url) */
  meta?: Record<string, string>;
  connectedAt?: string;
}

interface SecretsState {
  model: ModelSecret;
  integrations: Record<string, IntegrationCredential>;
}

let state: SecretsState = { model: {}, integrations: {} };

function load() {
  try {
    if (fs.existsSync(FILE)) state = JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    state = { model: {}, integrations: {} };
  }
}
function persist() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(state, null, 2));
  } catch {
    /* non-fatal */
  }
}
load();

export const secrets = {
  // ── Model ──
  getModel(): ModelSecret {
    return state.model;
  },
  setModel(m: ModelSecret) {
    state.model = { ...state.model, ...m };
    persist();
  },
  clearModel() {
    state.model = {};
    persist();
  },
  // ── Integration credentials ──
  getIntegration(id: string): IntegrationCredential | undefined {
    return state.integrations[id];
  },
  setIntegration(id: string, cred: IntegrationCredential) {
    state.integrations[id] = { ...cred, connectedAt: new Date().toISOString() };
    persist();
  },
  removeIntegration(id: string) {
    delete state.integrations[id];
    persist();
  },
  isIntegrationConnected(id: string): boolean {
    return Boolean(state.integrations[id]?.token);
  },
};

/** Mask a secret for display (never return full keys to the client). */
export function maskKey(key?: string): string | null {
  if (!key) return null;
  if (key.length <= 6) return "••••";
  return `${key.slice(0, 3)}••••${key.slice(-4)}`;
}
