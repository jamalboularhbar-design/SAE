/**
 * Deterministic demo brain — produces realistic plans, specialist reasoning,
 * and a synthesized answer WITHOUT an LLM key, so Nexus OS is always demoable.
 * When LLM_API_KEY is set, engine.ts uses the real model + Hub specialist prompts.
 */
import type { Specialist } from "../shared/types.ts";

/** Map a Hub discipline to a Gateway integration the specialist would use. */
export function categoryTool(category: string): { via: string; detail: string } {
  switch (category) {
    case "Marketing & Campaign":
      return { via: "notion", detail: "Pulled brand context · drafted campaign assets." };
    case "Social Media":
      return { via: "slack", detail: "Reviewed channel activity · drafted posts." };
    case "Sales & Revenue":
      return { via: "hubspot", detail: "Read pipeline · flagged next steps." };
    case "Writing":
      return { via: "notion", detail: "Saved draft to your workspace." };
    case "Operations & Systems":
      return { via: "webhooks", detail: "Mapped the process · proposed automation." };
    case "Strategy & Growth":
      return { via: "hub", detail: "Consulted the Hub for positioning." };
    case "Customer Success":
      return { via: "email", detail: "Drafted customer comms (held for approval)." };
    case "E-commerce":
      return { via: "hubspot", detail: "Audited store funnel · noted fixes." };
    case "Daily AI Assistant":
      return { via: "calendar", detail: "Checked schedule · structured the plan." };
    default:
      return { via: "hub", detail: "Gathered relevant context." };
  }
}

export function demoObjective(sp: Specialist, prompt: string): string {
  return `As ${sp.name}: ${lower(sp.role)} — applied to "${truncate(prompt)}".`;
}

export function demoThink(sp: Specialist): string {
  return `${sp.name} here. ${sp.role}. I'll deliver something specific and on-brand, grounded in the active workspace context.`;
}

export function demoResult(sp: Specialist): string {
  return `${sp.name} produced a draft deliverable (held for your approval) — concise, specific, and ready to ship.`;
}

export function demoSynthesis(prompt: string, team: Specialist[]): string {
  const names = team.filter((s) => s.id !== "chief-of-staff").map((s) => s.name);
  const list = names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.slice(-1)}` : names[0] ?? "the team";
  return [
    `Done — I put ${list} on "${truncate(prompt, 80)}".`,
    "",
    "What's ready for you:",
    "• Each specialist produced a draft, held for your one-tap approval (nothing sent without sign-off).",
    "• Every step is in the run timeline and the audit log.",
    "• I saved the context to Memory so the next ask is faster.",
    "",
    "Want me to put this on the Heartbeat so it runs automatically each morning?",
  ].join("\n");
}

function truncate(s: string, n = 60) {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n)}…` : t;
}
function lower(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
