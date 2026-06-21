/**
 * Hub Specialist connector — integration point for `jamal-hub-v2.jsx`.
 *
 * Nexus OS treats your loaded Hub as a first-class specialist agent.
 * There are three supported ways to wire it in (auto-detected in priority order):
 *
 *  1. HTTP endpoint  — set HUB_SPECIALIST_URL to an endpoint that accepts
 *       POST { query, context } and returns { answer, citations? }.
 *       (Recommended for production — keeps the Hub decoupled.)
 *
 *  2. Embedded JSX  — drop `jamal-hub-v2.jsx` into client/src/hub/ and it will
 *       render inside the Hub panel in the UI (see client/src/hub/README).
 *
 *  3. Built-in fallback — a deterministic domain responder so the OS is fully
 *       functional before you wire the real Hub.
 *
 * The contract your Hub should satisfy:
 *   - HTTP:  POST {url}  body: { query: string, context?: object }
 *            -> 200 { answer: string, citations?: string[] }
 *   - JSX:   export default function Hub({ query, onAnswer }) { ... }
 */
import { chat, isLiveMode } from "./llm.ts";

export interface HubResponse {
  answer: string;
  citations?: string[];
  source: "http" | "llm" | "builtin";
}

export function hubConfigured(): boolean {
  return Boolean(process.env.HUB_SPECIALIST_URL) || isLiveMode();
}

export async function askHub(query: string, context?: Record<string, unknown>): Promise<HubResponse> {
  const url = process.env.HUB_SPECIALIST_URL;

  // 1. External Hub endpoint (jamal-hub-v2 served over HTTP)
  if (url) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query, context }),
      });
      if (res.ok) {
        const data = (await res.json()) as { answer?: string; citations?: string[] };
        return { answer: data.answer ?? "(empty Hub response)", citations: data.citations, source: "http" };
      }
    } catch {
      /* fall through to other strategies */
    }
  }

  // 2. LLM-backed Hub persona (uses your configured model as the Hub brain)
  if (isLiveMode()) {
    const answer = await chat(
      [
        {
          role: "system",
          content:
            "You are the Hub Specialist (jamal-hub-v2), a domain expert on the user's business operations, " +
            "playbooks, and SOPs. Answer concisely with concrete, actionable guidance grounded in operational best practice.",
        },
        { role: "user", content: query },
      ],
      { maxTokens: 700 }
    );
    return { answer, source: "llm" };
  }

  // 3. Built-in deterministic fallback
  return { answer: builtinHubAnswer(query), source: "builtin" };
}

function builtinHubAnswer(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("onboard")) {
    return "Hub playbook — Client Onboarding: 1) Send welcome + intake form, 2) Kickoff call within 48h, 3) Provision workspace & access, 4) 30/60/90 success plan, 5) Day-7 check-in. Owner: Success.";
  }
  if (q.includes("pricing") || q.includes("price")) {
    return "Hub playbook — Pricing: anchor on outcomes, present 3 tiers, default to annual (20% off), and always quote the bundle credit toward Playbooks.";
  }
  if (q.includes("follow") || q.includes("deal")) {
    return "Hub playbook — Deal Follow-up: touch within 24h of last activity, lead with value (case study or resource), propose a concrete next step + time.";
  }
  return (
    "Hub Specialist (built-in mode): I can answer from your operational playbooks once jamal-hub-v2 is wired " +
    "(set HUB_SPECIALIST_URL or drop the JSX into client/src/hub/). For now, here's a general best-practice take: " +
    "break the request into the smallest shippable step, assign one owner, and set a check-in time."
  );
}
