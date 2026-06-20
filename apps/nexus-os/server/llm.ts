/**
 * OpenAI-compatible LLM layer with a multi-provider model registry.
 * Reuses the same env contract as the NexusAI Playbooks app so a single
 * key powers both the Hub specialist and Nexus OS.
 *
 *   LLM_API_URL  — e.g. https://generativelanguage.googleapis.com/v1beta/openai
 *   LLM_API_KEY  — your key
 *   LLM_MODEL    — default model id
 */
import type { ModelOption } from "../shared/types.ts";

export const MODEL_REGISTRY: ModelOption[] = [
  { key: "gemini-2.5-flash", label: "Gemini 2.5 Flash", provider: "Google", contextNote: "Fast, low-cost default" },
  { key: "gemini-2.5-pro", label: "Gemini 2.5 Pro", provider: "Google", contextNote: "Deep reasoning" },
  { key: "gpt-4o", label: "GPT-4o", provider: "OpenAI", contextNote: "Balanced multimodal" },
  { key: "gpt-4o-mini", label: "GPT-4o mini", provider: "OpenAI", contextNote: "Cheap & quick" },
  { key: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet", provider: "Anthropic", contextNote: "Strong writing/agentic" },
  { key: "llama-3.3-70b", label: "Llama 3.3 70B", provider: "Groq", contextNote: "Open weights, fast" },
];

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

import { secrets } from "./secrets.ts";

export function getEnv() {
  // UI-set secrets take priority over environment variables (no terminal needed).
  const s = secrets.getModel();
  return {
    apiUrl: s.apiUrl || process.env.LLM_API_URL || "https://generativelanguage.googleapis.com/v1beta/openai",
    apiKey: s.apiKey || process.env.LLM_API_KEY || "",
    model: s.model || process.env.LLM_MODEL || "gemini-2.5-flash",
  };
}

export function isLiveMode(): boolean {
  return Boolean(getEnv().apiKey);
}

/** Verify a model key works by making a tiny real call. */
export async function testModel(): Promise<{ ok: boolean; message: string }> {
  if (!isLiveMode()) return { ok: false, message: "No API key set — running in Demo mode." };
  try {
    const reply = await chat([{ role: "user", content: "Reply with the single word: ready" }], { maxTokens: 16 });
    return { ok: true, message: `Live — model responded: "${reply.trim().slice(0, 40)}"` };
  } catch (err) {
    return { ok: false, message: `Key set but call failed: ${String(err).slice(0, 160)}` };
  }
}

export async function chat(
  messages: ChatMessage[],
  opts: { model?: string; maxTokens?: number; json?: boolean } = {}
): Promise<string> {
  const env = getEnv();
  if (!env.apiKey) throw new Error("LLM_API_KEY not configured");

  const url = `${env.apiUrl.replace(/\/$/, "")}/chat/completions`;
  const payload: Record<string, unknown> = {
    model: opts.model ?? env.model,
    messages,
    max_tokens: opts.maxTokens ?? 2048,
  };
  if (opts.json) payload.response_format = { type: "json_object" };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`LLM ${res.status}: ${text}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content ?? "";
}
